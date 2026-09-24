"""Local, fully-offline machine-learning features for the Personal Stylist API."""
from __future__ import annotations

import base64
import binascii
import random
import threading
from typing import Any

import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

try:
    import cv2
    _HAS_CV2 = True
except ImportError:
    _HAS_CV2 = False

try:
    import torch
    import torch.nn as nn
    _HAS_TORCH = True
except ImportError:
    _HAS_TORCH = False


# Expanded categories
CATEGORIES = ["Tops", "Bottoms", "Dresses", "Shoes", "Outerwear", "Bags"]


# ---------------------------------------------------------------------------
# Shared: image decoding
# ---------------------------------------------------------------------------
def _decode_image(image_data: str | bytes) -> np.ndarray:
    if not _HAS_CV2:
        raise RuntimeError("opencv-python is required to decode images")
    if isinstance(image_data, str):
        image_data = image_data.strip()
        if "," in image_data and "base64" in image_data.split(",", 1)[0].lower():
            image_data = image_data.split(",", 1)[1]
        elif "," in image_data and image_data.strip().lower().startswith("data:"):
            image_data = image_data.split(",", 1)[1]
        image_data = "".join(image_data.split())
        missing_padding = len(image_data) % 4
        if missing_padding:
            image_data += "=" * (4 - missing_padding)
        try:
            raw = base64.b64decode(image_data, validate=False)
        except (binascii.Error, ValueError) as exc:
            raise ValueError("Could not base64-decode the provided image") from exc
    else:
        raw = image_data

    buf = np.frombuffer(raw, dtype=np.uint8)
    img = cv2.imdecode(buf, cv2.IMREAD_COLOR)

    if img is None:
        try:
            import io
            from PIL import Image
            pil_img = Image.open(io.BytesIO(raw)).convert("RGB")
            arr = np.array(pil_img)
            img = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
        except Exception:
            pass

    if img is None:
        raise ValueError("Could not decode image — unsupported or corrupt file")

    max_dim = max(img.shape[:2])
    if max_dim > 1200:
        scale = 1200.0 / max_dim
        img = cv2.resize(img, (int(img.shape[1] * scale), int(img.shape[0] * scale)), interpolation=cv2.INTER_AREA)

    return img


def _largest_foreground_contour(img_bgr: np.ndarray):
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, raw_mask = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    contours, _ = cv2.findContours(raw_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None, raw_mask
    largest = max(contours, key=cv2.contourArea)
    if cv2.contourArea(largest) < (img_bgr.shape[0] * img_bgr.shape[1]) * 0.02:
        return None, raw_mask
    filled = np.zeros_like(raw_mask)
    cv2.drawContours(filled, [largest], -1, 255, thickness=cv2.FILLED)
    return cv2.boundingRect(largest), filled


# ---------------------------------------------------------------------------
# 1) Image Auto-tagging Engine
# ---------------------------------------------------------------------------
if _HAS_TORCH:

    class GarmentClassifier(nn.Module):
        def __init__(self, in_dim: int = 4, num_classes: int = len(CATEGORIES)):
            super().__init__()
            self.net = nn.Sequential(
                nn.Linear(in_dim, 32), nn.ReLU(),
                nn.Linear(32, 32), nn.ReLU(),
                nn.Linear(32, num_classes),
            )

        def forward(self, x):
            return self.net(x)

    _FEATURE_SCALE = np.array([2.5, 1.0, 1.0, 1.0], dtype=np.float32)

    def _band_width(mask: np.ndarray, row_start: float, row_end: float) -> float:
        h, w = mask.shape
        r0, r1 = int(h * row_start), max(int(h * row_end), int(h * row_start) + 1)
        band = mask[r0:r1, :]
        if band.size == 0 or band.max() == 0:
            return 0.0
        cols = np.where(band.max(axis=0) > 0)[0]
        return float(cols.max() - cols.min() + 1) / w if len(cols) else 0.0

    def _silhouette_features(img_bgr: np.ndarray) -> np.ndarray:
        _, mask = _largest_foreground_contour(img_bgr)
        h, w = mask.shape
        ys, xs = np.where(mask > 0)
        if len(xs) < 10:
            return np.zeros(4, dtype=np.float32)
        bbox_w, bbox_h = xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
        aspect_ratio = bbox_h / max(bbox_w, 1)
        fill_ratio = len(xs) / max(bbox_w * bbox_h, 1)
        top_w, bot_w = _band_width(mask, 0.05, 0.20), _band_width(mask, 0.75, 0.95)
        taper = (bot_w - top_w) / max(top_w, bot_w, 1e-3)
        lower_band = mask[int(h * 0.55):int(h * 0.9), :]
        gap_ratio = 0.0
        if lower_band.size:
            col_has_fg = lower_band.max(axis=0) > 0
            fg_cols = np.where(col_has_fg)[0]
            if len(fg_cols) > 4:
                span = fg_cols.max() - fg_cols.min() + 1
                filled_cols = col_has_fg[fg_cols.min():fg_cols.max() + 1].sum()
                gap_ratio = float(span - filled_cols) / span
        return np.array([aspect_ratio, fill_ratio, gap_ratio, taper], dtype=np.float32)

    def _scaled_features(img_bgr: np.ndarray) -> np.ndarray:
        return _silhouette_features(img_bgr) / _FEATURE_SCALE

    def _draw_top(draw, size, cx, body_w, color) -> None:
        top, bottom = int(size * 0.15), int(size * 0.62)
        draw.rectangle([cx - body_w // 2, top, cx + body_w // 2, bottom], fill=color)

    def _draw_bottom(draw, size, cx, body_w, color) -> None:
        waist_top, waist_bot, hem = int(size * 0.15), int(size * 0.32), int(size * 0.9)
        gap = int(body_w * 0.16)
        draw.rectangle([cx - body_w // 2, waist_top, cx + body_w // 2, waist_bot], fill=color)
        draw.rectangle([cx - body_w // 2, waist_bot, cx - gap // 2, hem], fill=color)
        draw.rectangle([cx + gap // 2, waist_bot, cx + body_w // 2, hem], fill=color)

    def _draw_dress(draw, size, cx, body_w, color) -> None:
        top_w, top, hem = int(body_w * 0.46), int(size * 0.12), int(size * 0.92)
        draw.polygon([(cx - top_w // 2, top), (cx + top_w // 2, top), (cx + body_w // 2, hem), (cx - body_w // 2, hem)], fill=color)

    def _draw_shoes(draw, size, cx, body_w, color) -> None:
        # Footwear is wider horizontally or has lower aspect ratio
        draw.rectangle([cx - int(body_w * 0.6), int(size * 0.5), cx + int(body_w * 0.6), int(size * 0.8)], fill=color)

    def _draw_bag(draw, size, cx, body_w, color) -> None:
        top, bottom = int(size * 0.45), int(size * 0.85)
        draw.rectangle([cx - int(body_w * 0.5), top, cx + int(body_w * 0.5), bottom], fill=color)
        draw.arc([cx - int(body_w * 0.3), top - 20, cx + int(body_w * 0.3), top + 10], 180, 360, fill=color, width=3)

    _DRAW_FN = {
        "Tops": _draw_top, 
        "Bottoms": _draw_bottom, 
        "Dresses": _draw_dress, 
        "Shoes": _draw_shoes,
        "Outerwear": _draw_top,
        "Bags": _draw_bag
    }

    def _synthetic_sample(label: str, size: int = 160, rng: random.Random | None = None) -> np.ndarray:
        from PIL import Image, ImageDraw
        rng = rng or random
        img = Image.new("RGB", (size, size), (255, 255, 255))
        draw = ImageDraw.Draw(img)
        cx = size // 2 + rng.randint(-6, 6)
        body_w = rng.randint(int(size * 0.32), int(size * 0.56))
        color = tuple(rng.randint(15, 210) for _ in range(3))
        _DRAW_FN[label](draw, size, cx, body_w, color)
        img = img.rotate(rng.uniform(-4, 4), fillcolor=(255, 255, 255))
        arr = np.array(img).astype(np.int16)
        arr = np.clip(arr + np.random.randint(-8, 8, arr.shape), 0, 255).astype(np.uint8)
        return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)

    def _train_classifier(n_per_class: int = 100, epochs: int = 90, seed: int = 7) -> "GarmentClassifier":
        rng = random.Random(seed)
        X, y = [], []
        for label_idx, label in enumerate(CATEGORIES):
            for _ in range(n_per_class):
                X.append(_scaled_features(_synthetic_sample(label, rng=rng)))
                y.append(label_idx)
        xt = torch.tensor(np.stack(X))
        yt = torch.tensor(np.array(y, dtype=np.int64))
        model = GarmentClassifier()
        opt = torch.optim.Adam(model.parameters(), lr=0.02)
        model.train()
        for _ in range(epochs):
            opt.zero_grad()
            loss = torch.nn.functional.cross_entropy(model(xt), yt)
            loss.backward()
            opt.step()
        model.eval()
        return model

    _model_lock = threading.Lock()
    _model_cache: dict[str, Any] = {"model": None}

    def _get_model() -> "GarmentClassifier":
        if _model_cache["model"] is None:
            with _model_lock:
                if _model_cache["model"] is None:
                    _model_cache["model"] = _train_classifier()
        return _model_cache["model"]

    def _cnn_predict(img_bgr: np.ndarray) -> dict[str, Any]:
        model = _get_model()
        feats = _scaled_features(img_bgr)
        with torch.no_grad():
            logits = model(torch.tensor(feats, dtype=torch.float32).unsqueeze(0))
            probs = torch.softmax(logits, dim=1).squeeze(0).numpy()
        idx = int(np.argmax(probs))
        return {
            "category": CATEGORIES[idx],
            "confidence": round(float(probs[idx]), 3),
            "probabilities": {c: round(float(p), 3) for c, p in zip(CATEGORIES, probs)},
            "source": "pytorch-mlp",
        }

else:
    def _cnn_predict(img_bgr: np.ndarray) -> dict[str, Any] | None:
        return None


def _is_on_model(img_bgr: np.ndarray) -> tuple[bool, np.ndarray]:
    ih, iw = img_bgr.shape[:2]
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    skin_mask = ((h <= 22) | (h >= 170)) & (s >= 35) & (s <= 175) & (v >= 70)
    upper_skin = float(np.mean(skin_mask[:int(ih * 0.35), :]))
    total_skin = float(np.mean(skin_mask))
    return (upper_skin > 0.05 or total_skin > 0.04), skin_mask


def _heuristic_predict(img_bgr: np.ndarray) -> dict[str, Any]:
    """Aspect ratio and silhouette heuristic for flat-lay / product photography."""
    box, mask = _largest_foreground_contour(img_bgr)
    h_img, w_img = img_bgr.shape[:2]
    
    if box is None:
        aspect = h_img / max(w_img, 1)
        category = "Shoes" if aspect < 0.85 else ("Dresses" if aspect >= 1.35 else "Tops")
        return {"category": category, "confidence": 0.60, "source": "heuristic-frame"}

    x, y, w, h = box
    aspect = h / max(w, 1)

    # Shoes/Footwear feature lower aspect ratios (wider than tall or balanced square)
    if aspect < 0.85:
        return {"category": "Shoes", "confidence": 0.86, "source": "opencv-heuristic"}

    top_band = mask[y : y + h // 3, x : x + w]
    bottom_band = mask[y + 2 * h // 3 : y + h, x : x + w]
    top_fill = float(np.count_nonzero(top_band)) / max(top_band.size, 1)
    bottom_fill = float(np.count_nonzero(bottom_band)) / max(bottom_band.size, 1)

    if aspect >= 1.4 and top_fill > 0.15 and bottom_fill > 0.15:
        category, confidence = "Dresses", 0.78
    elif (y + h / 2) < h_img * 0.55 and aspect < 1.3:
        category, confidence = "Tops", 0.75
    else:
        category, confidence = "Bottoms", 0.65

    return {"category": category, "confidence": confidence, "source": "opencv-heuristic"}


def classify_category(image_data: str | bytes) -> dict[str, Any]:
    """Classifies an uploaded clothing photo as Tops / Bottoms / Dresses / Shoes / Outerwear / Bags."""
    img = _decode_image(image_data)
    is_model, skin_mask = _is_on_model(img)

    # Only invoke on-model logic if skin is genuinely present (prevents shoes on white backgrounds from misfiring)
    if is_model:
        box, _ = _largest_foreground_contour(img)
        if box is not None:
            _, _, w, h = box
            if (h / max(w, 1)) < 0.90:  # Shoes placed near a person or hand
                return {"category": "Shoes", "confidence": 0.85, "source": "heuristic-aspect"}

    # Run heuristic / PyTorch silhouette prediction
    result = None
    try:
        result = _cnn_predict(img)
    except Exception:
        result = None

    if result is not None and result.get("confidence", 0) > 0.75 and result.get("category") in CATEGORIES:
        return result

    return _heuristic_predict(img)


# ---------------------------------------------------------------------------
# 2) Dominant color extraction - OpenCV decode + scikit-learn KMeans
# ---------------------------------------------------------------------------
NAMED_PALETTE = {
    "Black": (20, 18, 20), "White": (243, 240, 236), "Maroon": (122, 17, 40), "Red": (140, 26, 43),
    "Beige": (217, 206, 189), "Navy": (35, 42, 59), "Denim": (62, 86, 112), "Grey": (140, 136, 128),
    "Olive": (91, 92, 66), "Pink": (199, 144, 152), "Cream": (239, 231, 216), "Brown": (92, 66, 48),
    "Gold": (173, 138, 70), "Silver": (183, 179, 172), "Mustard": (176, 138, 52), "Green": (70, 90, 69),
}


def _nearest_named_color(rgb: tuple[int, int, int]) -> str:
    import colorsys
    r, g, b = rgb
    rn, gn, bn = r / 255.0, g / 255.0, b / 255.0
    h, s, v = colorsys.rgb_to_hsv(rn, gn, bn)
    h_deg = h * 360.0
    spread = max(r, g, b) - min(r, g, b)
    avg = (r + g + b) / 3.0

    if spread < 18 and s < 0.12:
        if avg < 48:
            return "Black"
        elif avg > 218:
            return "White"
        else:
            return "Grey"

    if avg > 190 and s < 0.28:
        if 20 <= h_deg <= 55:
            return "Cream" if avg > 225 else "Beige"
        if s < 0.08:
            return "Silver"

    if 5 <= h_deg <= 48 and g >= (b - 3):
        if v < 0.65 or avg < 145:
            return "Brown"
        elif s > 0.55:
            return "Gold" if v > 0.70 else "Brown"
        else:
            return "Beige"

    if h_deg <= 15 or h_deg >= 335:
        if avg > 160 and s < 0.50:
            return "Pink"
        elif avg < 110 or b > g:
            return "Maroon"
        else:
            return "Red"

    if 15 < h_deg <= 48:
        return "Brown" if (v < 0.65 or avg < 145) else "Beige"

    if 48 < h_deg <= 75:
        return "Olive" if (v < 0.55 or avg < 120) else "Mustard"

    if 75 < h_deg <= 165:
        return "Olive" if (s < 0.40 or avg < 110) else "Green"

    if 165 < h_deg <= 260:
        return "Navy" if (avg < 70 or v < 0.35) else "Denim"

    if 260 < h_deg <= 335:
        return "Pink" if avg > 130 else "Maroon"

    return "Grey"


def extract_dominant_colors(image_data: str | bytes, k: int = 3) -> list[dict[str, Any]]:
    img_bgr = _decode_image(image_data)
    ih, iw = img_bgr.shape[:2]
    is_model, skin_mask = _is_on_model(img_bgr)

    if is_model:
        xs, xe = int(iw * 0.20), int(iw * 0.80)
        garment_roi = img_bgr[int(ih * 0.28):int(ih * 0.72), xs:xe]
        skin_roi = skin_mask[int(ih * 0.28):int(ih * 0.72), xs:xe]
        cloth_pixels = garment_roi[~skin_roi]
        if len(cloth_pixels) < 50:
            cloth_pixels = garment_roi.reshape(-1, 3)
        small_rgb = cv2.cvtColor(cloth_pixels.reshape(-1, 1, 3), cv2.COLOR_BGR2RGB).reshape(-1, 3).astype(np.float32)
    else:
        small = cv2.resize(img_bgr, (120, 120), interpolation=cv2.INTER_AREA)
        rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB).reshape(-1, 3).astype(np.float32)
        brightness = rgb.mean(axis=1)
        channel_spread = rgb.max(axis=1) - rgb.min(axis=1)
        is_background = ((brightness > 245) | (brightness < 12)) & (channel_spread < 18)
        small_rgb = rgb[~is_background]
        if len(small_rgb) < k * 10:
            small_rgb = rgb

    n_clusters = max(1, min(k, len(np.unique(small_rgb.astype(int), axis=0))))
    kmeans = KMeans(n_clusters=n_clusters, n_init=10, random_state=42)
    labels = kmeans.fit_predict(small_rgb)
    counts = np.bincount(labels, minlength=n_clusters)
    order = np.argsort(-counts)

    total = counts.sum()
    results = []

    for idx in order[:k]:
        center = kmeans.cluster_centers_[idx]
        r, g, b = (int(round(c)) for c in np.clip(center, 0, 255))
        results.append({
            "hex": f"#{r:02X}{g:02X}{b:02X}",
            "rgb": [r, g, b],
            "percent": round(float(counts[idx]) / float(total) * 100, 1),
            "name": _nearest_named_color((r, g, b)),
        })
    return results


# ---------------------------------------------------------------------------
# 3) Outfit Matcher
# ---------------------------------------------------------------------------
FEATURE_CATEGORIES = ["Tops", "Bottoms", "Dresses", "Shoes", "Jewelry", "Bags", "Accessories", "Outerwear"]
FEATURE_COLORS = list(NAMED_PALETTE.keys()) + ["Ivory", "Tan", "Blue"]
FEATURE_PATTERNS = ["Solid", "Striped", "Floral", "Checked", "Printed", "Polka Dot", "Textured"]
FEATURE_STYLES = ["Casual", "Elegant", "Minimal", "Edgy", "Sporty", "Romantic", "Tailored", "Bold"]
FEATURE_FITS = ["Relaxed", "Fitted", "Oversized", "Tailored", "Regular"]
FEATURE_SEASONS = ["Summer", "Monsoon", "Winter", "All-season"]


def _one_hot(value: str, options: list[str]) -> list[float]:
    return [1.0 if value == opt else 0.0 for opt in options]


def _multi_hot(values: list[str], options: list[str]) -> list[float]:
    values = set(values or [])
    return [1.0 if opt in values else 0.0 for opt in options]


def _item_vector(item: dict[str, Any]) -> list[float]:
    vec: list[float] = []
    vec += _one_hot(item.get("category", ""), FEATURE_CATEGORIES)
    vec += _one_hot(item.get("color", ""), FEATURE_COLORS)
    vec += _one_hot(item.get("pattern", "Solid"), FEATURE_PATTERNS)
    vec += _multi_hot(item.get("style", []), FEATURE_STYLES)
    vec += _one_hot(item.get("fit", "Regular"), FEATURE_FITS)
    vec += _multi_hot(item.get("season", []), FEATURE_SEASONS)
    vec.append(float(item.get("formality", 3)) / 5.0)
    vec.append(float(item.get("warmth", 2)) / 3.0)
    return vec


def build_feature_matrix(items: list[dict[str, Any]]) -> np.ndarray:
    return np.array([_item_vector(it) for it in items], dtype=np.float32)


def compatibility_matrix(items: list[dict[str, Any]]) -> tuple[list[str], list[list[float]]]:
    if not items:
        return [], []
    matrix = build_feature_matrix(items)
    sim = cosine_similarity(matrix)
    ids = [it.get("id", str(i)) for i, it in enumerate(items)]
    return ids, np.round(sim, 4).tolist()


def rank_compatible_items(
    items: list[dict[str, Any]],
    target_id: str,
    categories: list[str] | None = None,
    top_n: int = 5,
) -> list[dict[str, Any]]:
    if not items:
        return []
    target_idx = next((i for i, it in enumerate(items) if it.get("id") == target_id), None)
    if target_idx is None:
        raise ValueError(f"target_id {target_id!r} not found among the provided items")

    matrix = build_feature_matrix(items)
    sims = cosine_similarity(matrix[target_idx : target_idx + 1], matrix)[0]

    candidates = []
    for i, item in enumerate(items):
        if i == target_idx:
            continue
        if categories and item.get("category") not in categories:
            continue
        candidates.append((float(sims[i]), item))
    candidates.sort(key=lambda pair: pair[0], reverse=True)

    return [
        {"id": item.get("id"), "name": item.get("name", ""), "category": item.get("category", ""), "score": round(score, 4)}
        for score, item in candidates[:top_n]
    ]


def engine_status() -> dict[str, Any]:
    tagging_model = "unavailable"
    if _HAS_TORCH:
        _get_model()
        tagging_model = "pytorch-mlp-trained-in-process"
    return {
        "opencv_available": _HAS_CV2,
        "torch_available": _HAS_TORCH,
        "tagging_model": tagging_model,
        "tagging_fallback": "opencv-heuristic",
        "color_extraction": "opencv+kmeans" if _HAS_CV2 else "unavailable",
        "compatibility_matcher": "sklearn-cosine-similarity",
    }