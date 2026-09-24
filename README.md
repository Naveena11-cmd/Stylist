# Personal Stylist

A premium, editorial AI-stylist web app: closet management, mood + occasion +
weather-aware outfit generation, and a conversational stylist chat.

## Running it

Start the FastAPI app from the project root:

```
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Open `http://127.0.0.1:8000`. FastAPI serves the React/Babel frontend from `frontend/` and exposes the API under `/api`.

The frontend uses React + Babel (in-browser JSX transform) + Tailwind from CDN. Closet, saved outfits, profile, theme, and the local user session are persisted to `localStorage`. Auth, weather, onboarding profile sync, and recommendation cards use the FastAPI endpoints; the client still degrades gracefully to its deterministic local stylist when the API is unavailable.

## File structure

The repository is organized as:

- `backend/main.py` - FastAPI routes, in-memory auth/session adapter, and static file hosting.
- `backend/ml_engine.py` - explainable weather simulation, profile-aware recommendation engine, and the style-chat reply generator.
- `backend/vision_engine.py` - local computer-vision features: garment auto-tagging (PyTorch), dominant-color extraction (OpenCV + scikit-learn KMeans), and the outfit compatibility matcher (scikit-learn cosine similarity). See "Local ML features" below.
- `backend/requirements.txt` - Python dependencies.
- `frontend/index.html` - browser entry point.
- `frontend/app.jsx` - React UI, local persistence, auth/onboarding flow, and API integration.
- `frontend/styles.css` - design tokens, motion, glass recommendation cards, and responsive utilities.

The main client modules are organized top to bottom as:

1. **`<head>`** — Tailwind config (custom `ink` / `paper` / `maroon` palette,
   `Archivo` + `Inter` font families), CSS custom properties for
   light/dark theme tokens, and small utility CSS (hairline borders, chip
   states, motion, safe-area padding).
2. **Icons** — hand-built inline SVG icon set (no icon library dependency).
3. **`DATA`** — categories, moods, occasions, filter option lists, a
   color→hex lookup for placeholder swatches, and `SEED_CLOSET`, a starter
   wardrobe so outfit generation has real material on first load.
4. **`WeatherService`** — `getForecast(city, date)`. Currently a
   deterministic **simulated** forecast (seeded by city + date) so the app
   behaves consistently without a live network call from a published page.
   **This is the integration point for a real weather API** — swap the
   body of `getForecast` for a `fetch` to your weather provider and keep
   the same return shape: `{ city, date, tempC, condition, bucket, rain, season }`.
5. **`StylistEngine`** — the recommendation logic, isolated from the UI:
   - `scoreItem(item, ctx)` — scores a closet item against mood, occasion,
     weather and filters.
   - `generate(closet, { mood, occasion, weather, filters })` — picks a
     full outfit (top+bottom or dress, shoes, jewelry, bag, optional
     accessory) and writes the "why this works" explanation.
   - `regenerateSlot(outfit, slot, closet)` — swaps just one piece.
   **This is the integration point for a real AI/ML recommendation
   service** — replace the body of `generate`/`regenerateSlot` with a call
   to your backend/model, keeping the same input/output shape, and the UI
   needs no changes.
6. **Shared UI** — `ItemVisual` (renders a photo if the item has one,
   otherwise a color-tinted placeholder with a category icon), chips,
   nav, weather badge.
7. **Pages** — `Home`, `ClosetPage` (+ `AddItemModal`), `OutfitPage`
   (+ `OutfitCard`), `ChatPage` (+ rule-based NLU: mood/occasion/slot
   keyword matching, closing/farewell detection), `ProfilePage`.
8. **`App`** — routing (simple page-state switch, no router dependency),
   `localStorage` persistence via a small `useLocalState` hook, theming.

## Local ML features

`backend/vision_engine.py` adds three fully local, offline machine-learning features —
nothing here calls an external vision or LLM API:

1. **Image auto-tagging** — `POST /api/vision/classify` classifies an uploaded clothing
   photo as `Tops` / `Bottoms` / `Dresses`. It's a small PyTorch model (`GarmentClassifier`,
   an MLP), but it does *not* learn from raw pixels: there's no fashion image dataset or
   pretrained weights reachable from a typical restricted-network environment, so a
   from-scratch raw-pixel CNN would just memorize noise. Instead it classifies a compact,
   OpenCV-derived **silhouette feature vector** (aspect ratio, fill ratio, leg-gap, hem
   taper), trained in-process on procedurally generated silhouettes in well under a second
   — no checkpoint file to ship or go stale. This transfers cleanly to real photos shot on
   a plain/light background (flat-lay or product-style photography); accuracy drops on
   cluttered backgrounds or on-model shots. Swap in a real pretrained fashion classifier
   (e.g. a fine-tuned ResNet on DeepFashion) as a drop-in replacement for `classify_category`
   if you have network access to fetch those weights. If PyTorch isn't installed, this
   endpoint automatically falls back to a plain OpenCV heuristic over the same silhouette.
2. **Color extraction** — `POST /api/vision/colors` decodes the image with OpenCV, filters
   out likely background pixels, and runs scikit-learn's `KMeans` to find the 3 dominant
   colors, each returned with hex/RGB/percent-share and the nearest named color in the
   app's own palette (so it can pre-fill an item's color dropdown directly).
3. **Outfit compatibility** — `POST /api/closet/compatibility` and
   `POST /api/closet/compatibility-matrix` turn each closet item into a numeric feature
   vector (category, color, pattern, style tags, fit, formality, warmth, season) and use
   scikit-learn's `cosine_similarity` to rank — or return the full pairwise matrix of —
   how compatible items are with one another.

`GET /api/vision/status` reports whether torch/opencv are installed and which tagging
path is actually in use. None of these three endpoints are wired into the frontend UI yet
— they're ready to call from `AddItemModal` (auto-tag + auto-color on photo upload) and
from the closet/outfit pages (suggested pairings) whenever you want that UI.



The current backend is intentionally small and easy to replace with a database and weather provider:

- Replace the in-memory `USERS` and `SESSIONS` stores in `backend/main.py` with a database adapter.
- Replace `get_weather` in `backend/ml_engine.py` with a provider such as Open-Meteo or WeatherAPI.
- Add wardrobe persistence endpoints and pass closet items into `recommend` for item-level matching.

## Design system

- Palette: black / white / deep maroon only — see the `--ink`, `--bg`,
  `--surface`, `--maroon` CSS variables (light + dark variants).
- Type: `Archivo` for display/editorial headings (italic used selectively
  for emphasis), `Inter` for UI and body text.
- No gradients, no drop shadows, no rounded "SaaS card" chrome — hairline
  borders and generous whitespace throughout, in an editorial fashion-app
  style.
