"""Deterministic, explainable recommendation engine for the Personal Stylist API."""
from __future__ import annotations

import os
import random
import re
from dataclasses import dataclass
from datetime import date
from hashlib import sha256
from typing import Any


@dataclass(frozen=True)
class Weather:
    city: str
    state: str
    temp_c: int
    condition: str
    bucket: str
    rain: bool
    season: str


def _seed(value: str) -> int:
    return int(sha256(value.encode("utf-8")).hexdigest()[:8], 16)


def get_weather(city: str, state: str = "") -> dict[str, Any]:
    """Return a stable simulated forecast without requiring a weather API key."""
    today = date.today()
    month = today.month
    season = "Summer" if 3 <= month <= 5 else "Monsoon" if 6 <= month <= 9 else "Winter"
    seed = _seed(f"{city.strip().lower()}|{state.strip().lower()}|{today.isoformat()}")
    if season == "Summer":
        temp_c = 30 + seed % 10
    elif season == "Monsoon":
        temp_c = 24 + seed % 7
    else:
        temp_c = 10 + seed % 9
    rain = (seed >> 3) % 100 < (55 if season == "Monsoon" else 12)
    condition = "Rainy" if rain else "Sunny" if temp_c >= 32 else "Cold & Clear" if temp_c <= 13 else "Cloudy" if seed % 5 == 0 else "Clear"
    bucket = "Hot" if temp_c >= 32 else "Warm" if temp_c >= 22 else "Mild" if temp_c >= 14 else "Cold"
    return Weather(city=city or "Your area", state=state, temp_c=temp_c, condition=condition, bucket=bucket, rain=rain, season=season).__dict__


def _score(item: dict[str, Any], style: str, weather: dict[str, Any]) -> float:
    styles = [str(value).lower() for value in item.get("style", [])]
    score = 3.0 if style.lower() in styles else 0.0
    season = weather.get("season", "All-season")
    score += 2.0 if "all-season" in item.get("season", []) or season in item.get("season", []) else 0.0
    warmth = item.get("warmth", 2)
    bucket = weather.get("bucket", "Mild")
    if bucket == "Hot":
        score += 2 if warmth <= 2 else -2
    elif bucket == "Cold":
        score += 2 if warmth >= 3 else -1
    if weather.get("rain", False) and "waterproof" in item.get("tags", []):
        score += 2
    return score


def recommend(profile: dict[str, Any], weather: dict[str, Any]) -> dict[str, Any]:
    """Create three actionable recommendations from profile and weather context."""
    style = profile.get("style_preference", "Casual")
    gender = profile.get("gender", "all")
    age = profile.get("age") or "your"
    temp = weather.get("temp_c") if weather.get("temp_c") is not None else weather.get("tempC", 24)
    bucket = weather.get("bucket") or ("Hot" if temp >= 32 else "Warm" if temp >= 22 else "Mild" if temp >= 14 else "Cold")
    city = weather.get("city") or profile.get("city") or "Your area"
    condition = weather.get("condition") or "Clear"
    vibe = "light layers" if bucket in {"Mild", "Warm"} else "breathable pieces" if bucket == "Hot" else "warm layers"
    occasion = profile.get("style_goal") or f"a {style.lower()} day"
    cards = [
        {"title": f"{style} {occasion}", "description": f"A {style.lower()} look tuned for {gender} styling and {temp}°C.", "tags": [style, bucket, gender.title() if gender else "Personalized"], "confidence": 92, "pieces": ["Base layer", "Elevated bottom", "Weather-ready shoes"]},
        {"title": "Weather-smart edit", "description": f"Keep the silhouette simple and reach for {vibe} in {city}.", "tags": [condition, f"{age} profile"], "confidence": 87, "pieces": ["Comfortable top", "Flexible layer", "Everyday accessories"]},
        {"title": "One-piece focus", "description": "A polished anchor piece keeps the outfit intentional with minimal effort.", "tags": ["Easy", style, "AI pick"], "confidence": 84, "pieces": ["Statement anchor", "Clean footwear", "Small finishing detail"]},
    ]
    return {"vibe": f"{condition} in {city}", "summary": f"Your {style.lower()} edit for {city}: {vibe} with room to move.", "recommendations": cards}


# ---------------------------------------------------------------------------
# Style chat — structured mood/occasion/outfit flow stays deterministic (it drives
# real closet picks in StylistEngine on the frontend); this covers the open-ended,
# conversational side of the chat: greetings, small talk, and style questions.
# It calls a real LLM when ANTHROPIC_API_KEY is configured, and otherwise falls back
# to a large, randomized phrase bank so replies stop feeling like the same fixed lines.
# ---------------------------------------------------------------------------
_STYLIST_SYSTEM_PROMPT = (
    "You are the in-app conversational stylist for 'Personal Stylist', a wardrobe app. "
    "Speak like a warm, sharp, opinionated friend who happens to be a stylist — never like a "
    "generic customer-support bot. Keep replies short (1-3 sentences), conversational, and "
    "specific to what the person actually asked. You do NOT pick outfits yourself in this "
    "message (the app's own recommendation engine does that from the user's real closet) — "
    "if they want an outfit, nudge them to give you a mood and an occasion. Never invent "
    "specific clothing items you haven't been told about."
)


def _call_llm(message: str, context: dict[str, Any], history: list[dict[str, str]]) -> str | None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return None
    try:
        import anthropic  # optional dependency — only needed if a key is configured
    except ImportError:
        return None
    try:
        client = anthropic.Anthropic(api_key=api_key)
        context_line = (
            f"Context: the user has {context.get('closet_count', 0)} items in their closet, "
            f"current mood is {context.get('mood') or 'not set'}, occasion is {context.get('occasion') or 'not set'}, "
            f"and it's {context.get('weather_temp', '?')}°C and {context.get('weather_condition', 'unknown')} in {context.get('city', 'their city')}."
        )
        msgs = [{"role": h["role"], "content": h["content"]} for h in history[-8:] if h.get("role") in ("user", "assistant")]
        msgs.append({"role": "user", "content": f"{context_line}\n\nUser says: {message}"})
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=200,
            system=_STYLIST_SYSTEM_PROMPT,
            messages=msgs,
        )
        text = "".join(block.text for block in response.content if getattr(block, "type", None) == "text").strip()
        return text or None
    except Exception:
        return None  # fall back to local phrasing rather than error out the chat


_GREETING_REPLIES = [
    "Hey! Good to see you. What's the vibe today?",
    "Hi there — ready to put a look together?",
    "Hello! Tell me the mood you're going for and I'll take it from here.",
    "Hey hey. What are we dressing you for today?",
    "Hi! I've got your closet loaded up — give me a mood whenever you're ready.",
]
_CLOSING_REPLIES = [
    "Glad I could help — enjoy your day! I'll be right here whenever you want to plan the next look.",
    "Sounds good. Come back anytime you need styling — have a great one!",
    "Noted, signing off for now. Your outfit's saved in the chat above if you want it later.",
    "Perfect, go be stylish. See you next time!",
    "Anytime! I'll keep your closet warmed up for next time.",
]
_THANKS_REPLIES = ["Anytime! That's what I'm here for.", "Of course — happy to help.", "You got it. Come back whenever you need another look."]
_HELP_REPLIES = [
    "Give me a mood (like Confident or Chill) and an occasion (like Work or Date) and I'll build a full outfit from your closet. Once you have a look, say something like \"change the shoes\" and I'll swap just that piece.",
    "Two things get you an outfit fast: a mood and an occasion. After that, ask me to swap any single piece and I'll rework just that slot.",
]
_KNOWLEDGE_BASE = [
    (r"\brain|monsoon|wet\b", [
        "For rain, I'd lean into waterproof or water-resistant pieces and darker colors that hide splashes — avoid suede and light fabrics that show water spots. Want me to build a rainy-day look?",
        "Monsoon rule of thumb: darker colors, nothing suede, and something you don't mind getting a little wet. Want a rain-ready outfit?",
    ]),
    (r"\bcold|winter|freezing|chilly\b", [
        "Layering is the move in the cold — a base layer, a warm mid layer like a sweater, and a structured outer piece. I'll bump up warmth automatically once you give me a mood and occasion.",
        "When it's cold, think in layers rather than one big warm piece — it's easier to adjust through the day. I'll factor the temperature in once you pick a mood.",
    ]),
    (r"\bhot|summer|humid\b", [
        "In the heat, breathable fabrics and lighter colors keep you cooler — linen, cotton, loose fits. I'll filter toward your lightest pieces automatically.",
        "Heat calls for airflow — loose fits, natural fabrics, lighter colors. I'll steer toward your breeziest pieces once we pick a look.",
    ]),
    (r"\bcolor|colour(s)? (go|match|pair)", [
        "As a rule of thumb: neutrals (black, white, beige, navy) pair with almost anything, and one bold color per outfit usually reads best. Want me to build something around a specific color?",
        "Easiest color trick: pick one hero color and keep everything else neutral around it. Tell me the color and I'll work with it.",
    ]),
    (r"\bwho are you\b|\bare you (a )?(real )?ai\b|\bare you human\b", [
        "I'm your in-app stylist — I read your closet, your mood, and today's weather to put outfits together. No generic suggestions, just what's actually in your wardrobe.",
        "Think of me as the stylist that only works with what's already in your closet — no shopping-list suggestions, ever.",
    ]),
    (r"\bformal|fancy|dress up|black tie\b", [
        "For anything formal, I'll reach for your most tailored, highest-formality pieces and keep the palette simple — think one statement item, not five. Tell me the occasion and I'll pull it together.",
        "Formal is mostly about restraint — one standout piece, everything else quiet and tailored. Give me the occasion and I'll build it.",
    ]),
    (r"\blayer|layering\b", [
        "Good layering starts thin-to-thick: a light base, a mid layer with some structure, then one outer piece that can come off. Want me to build a layered look?",
    ]),
    (r"\bpattern|print|mix(ing)? pattern", [
        "Mixing patterns works best when they share a color and differ in scale — a small check with a big stripe, say. When in doubt, keep one piece solid.",
    ]),
]


def _match_knowledge(message: str) -> str | None:
    text = message.lower()
    for pattern, replies in _KNOWLEDGE_BASE:
        if re.search(pattern, text):
            return random.choice(replies)
    return None


def chat_reply(message: str, context: dict[str, Any], history: list[dict[str, str]] | None = None) -> dict[str, Any]:
    """Return {"reply": str, "source": "llm" | "local"} for the open-ended side of the chat."""
    history = history or []
    llm_reply = _call_llm(message, context, history)
    if llm_reply:
        return {"reply": llm_reply, "source": "llm"}

    text = message.strip().lower()
    if re.search(r"\b(bye|goodbye|good ?night|that'?s all|that'?s it|done for (the day|now|today)|i'?m done|im done|nothing else|all set|no more( for)? now|see you|i'?m good|im good)\b", text):
        return {"reply": random.choice(_CLOSING_REPLIES), "source": "local"}
    if re.search(r"\bthank(s| you)\b", text):
        return {"reply": random.choice(_THANKS_REPLIES), "source": "local"}
    if re.search(r"\bhelp\b|\bwhat can you do\b", text):
        return {"reply": random.choice(_HELP_REPLIES), "source": "local"}
    if re.search(r"\b(hi|hello|hey|yo|sup|good morning|good afternoon|good evening)\b", text) and len(text.split()) <= 4:
        return {"reply": random.choice(_GREETING_REPLIES), "source": "local"}
    knowledge = _match_knowledge(text)
    if knowledge:
        return {"reply": knowledge, "source": "local"}

    closet_count = context.get("closet_count", 0)
    fallback_pool = [
        "Got it. Tell me a mood, an occasion, or say \"change the [item]\" and I'll adjust today's look — or ask me about layering, rain, color pairing, and I'll share a quick tip.",
        f"Noted. You've got {closet_count} pieces in your closet ready to go — give me a mood and an occasion and I'll build something from them." if closet_count else "Noted. Add a few pieces to your closet and give me a mood and an occasion, and I'll build a full look from them.",
        "I hear you. Whenever you're ready, throw me a mood and an occasion — or ask me anything about styling for weather or color.",
    ]
    return {"reply": random.choice(fallback_pool), "source": "local"}
