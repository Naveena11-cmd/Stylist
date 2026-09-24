"""FastAPI application for the Personal Stylist web app."""
from __future__ import annotations

from datetime import date
from pathlib import Path
from secrets import token_urlsafe
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

try:
    from .ml_engine import chat_reply, get_weather, recommend
    from .vision_engine import classify_category, compatibility_matrix, engine_status, extract_dominant_colors, rank_compatible_items
except ImportError:
    from ml_engine import chat_reply, get_weather, recommend
    from vision_engine import classify_category, compatibility_matrix, engine_status, extract_dominant_colors, rank_compatible_items


ROOT = Path(__file__).resolve().parent.parent
app = FastAPI(title="Personal Stylist API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Replace this in-memory store with a database adapter for production deployments.
USERS: dict[str, dict[str, Any]] = {}
SESSIONS: dict[str, str] = {}


class AuthPayload(BaseModel):
    email: str = Field(min_length=3)
    password: str = Field(min_length=4)
    name: str = ""


class ProfilePayload(BaseModel):
    gender: str = ""
    birthday: str = ""
    age: int | None = Field(default=None, ge=13, le=120)
    city: str = Field(min_length=1)
    state: str = ""
    style_preference: str = "Casual"
    style_goal: str = ""


class RecommendationPayload(BaseModel):
    profile: ProfilePayload
    weather: dict[str, Any] | None = None


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatPayload(BaseModel):
    message: str = Field(min_length=1)
    history: list[ChatMessage] = Field(default_factory=list)
    mood: str | None = None
    occasion: str | None = None
    closet_count: int = 0
    city: str = ""
    weather_temp: int | None = None
    weather_condition: str = ""


class ImagePayload(BaseModel):
    image: str = Field(min_length=1, description="A data: URL, raw base64 string, or base64 of the image bytes.")


class ClosetItemFeatures(BaseModel):
    id: str
    name: str = ""
    category: str
    color: str = "Black"
    pattern: str = "Solid"
    style: list[str] = Field(default_factory=list)
    season: list[str] = Field(default_factory=lambda: ["All-season"])
    fit: str = "Regular"
    formality: int = Field(default=3, ge=1, le=5)
    warmth: int = Field(default=2, ge=1, le=3)


class CompatibilityPayload(BaseModel):
    items: list[ClosetItemFeatures]
    target_id: str
    categories: list[str] | None = None
    top_n: int = Field(default=5, ge=1, le=25)


class MatrixPayload(BaseModel):
    items: list[ClosetItemFeatures]


def _current_user(authorization: str | None) -> dict[str, Any] | None:
    """Resolve the logged-in user from a `Bearer <token>` Authorization header, if any."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.removeprefix("Bearer ").strip()
    email = SESSIONS.get(token)
    return USERS.get(email) if email else None


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "personal-stylist"}


@app.post("/api/auth/register")
def register(payload: AuthPayload) -> dict[str, Any]:
    email = payload.email.strip().lower()
    if email in USERS:
        raise HTTPException(status_code=409, detail="An account already exists for this email.")
    USERS[email] = {"email": email, "name": payload.name.strip() or email.split("@")[0], "password": payload.password, "profile": None}
    token = token_urlsafe(24)
    SESSIONS[token] = email
    return {"token": token, "user": {"email": email, "name": USERS[email]["name"], "profile": None}}


@app.post("/api/auth/login")
def login(payload: AuthPayload) -> dict[str, Any]:
    email = payload.email.strip().lower()
    user = USERS.get(email)
    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    token = token_urlsafe(24)
    SESSIONS[token] = email
    return {"token": token, "user": {"email": email, "name": user["name"], "profile": user["profile"]}}


@app.post("/api/profile")
def save_profile(payload: ProfilePayload, authorization: str | None = Header(default=None)) -> dict[str, Any]:
    user = _current_user(authorization)
    if user is not None:
        # Persist onto the authenticated account so it survives future logins.
        user["profile"] = payload.model_dump()
    return {"profile": payload.model_dump(), "saved_at": date.today().isoformat()}


@app.post("/api/chat")
def chat(payload: ChatPayload) -> dict[str, Any]:
    """Open-ended side of the style chat: greetings, small talk, style Q&A. Calls a real LLM
    when ANTHROPIC_API_KEY is set in the environment; otherwise uses a large randomized local
    phrase bank so replies vary instead of repeating the same fixed lines."""
    context = {
        "closet_count": payload.closet_count,
        "mood": payload.mood,
        "occasion": payload.occasion,
        "city": payload.city,
        "weather_temp": payload.weather_temp,
        "weather_condition": payload.weather_condition,
    }
    history = [m.model_dump() for m in payload.history]
    return chat_reply(payload.message, context, history)


@app.get("/api/weather")
def weather(city: str, state: str = "") -> dict[str, Any]:
    return get_weather(city, state)


@app.post("/api/recommendations")
def recommendations(payload: RecommendationPayload) -> dict[str, Any]:
    weather_data = payload.weather or get_weather(payload.profile.city, payload.profile.state)
    return recommend(payload.profile.model_dump(), weather_data)


# ---------------------------------------------------------------------------
# Local ML: image auto-tagging, dominant-color extraction, outfit compatibility.
# Everything here runs on this machine — no external API calls. See vision_engine.py.
# ---------------------------------------------------------------------------
@app.get("/api/vision/status")
def vision_status() -> dict[str, Any]:
    """Tells the caller whether it's getting full-precision (trained CNN) tagging or the OpenCV
    heuristic fallback, and whether torch/opencv are installed at all."""
    return engine_status()


@app.post("/api/vision/classify")
def vision_classify(payload: ImagePayload) -> dict[str, Any]:
    """Auto-tags an uploaded clothing photo as Tops / Bottoms / Dresses."""
    try:
        return classify_category(payload.image)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/vision/colors")
def vision_colors(payload: ImagePayload) -> dict[str, Any]:
    """Extracts the top 3 dominant colors from an apparel photo (OpenCV decode + sklearn KMeans)."""
    try:
        return {"colors": extract_dominant_colors(payload.image, k=3)}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/closet/compatibility")
def closet_compatibility(payload: CompatibilityPayload) -> dict[str, Any]:
    """Ranks how well the rest of the closet (optionally filtered to given categories) pairs
    with `target_id`, using cosine similarity over each item's style/color/formality vector."""
    items = [i.model_dump() for i in payload.items]
    try:
        matches = rank_compatible_items(items, payload.target_id, payload.categories, payload.top_n)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"target_id": payload.target_id, "matches": matches}


@app.post("/api/closet/compatibility-matrix")
def closet_compatibility_matrix(payload: MatrixPayload) -> dict[str, Any]:
    """Full pairwise compatibility matrix across every item passed in."""
    items = [i.model_dump() for i in payload.items]
    ids, matrix = compatibility_matrix(items)
    return {"ids": ids, "matrix": matrix}


@app.get("/")
def index() -> FileResponse:
    return FileResponse(ROOT / "frontend" / "index.html")


app.mount("/static", StaticFiles(directory=ROOT / "frontend"), name="static")
