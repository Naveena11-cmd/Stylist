const { useState, useEffect, useMemo, useRef, useCallback } = React;

/* ============================== ICONS ============================== */
const Icon = ({ path, className = "w-5 h-5", strokeWidth = 1.4, viewBox = "0 0 24 24", style }) => (
  <svg viewBox={viewBox} className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{path}</svg>
);
const IconTop = (p) => <Icon {...p} path={<path d="M8 3 L5 6 L2 9 L5 11 L7 9 L7 21 L17 21 L17 9 L19 11 L22 9 L19 6 L16 3 Q12 6 8 3 Z" />} />;
const IconBottom = (p) => <Icon {...p} path={<path d="M6 3 H18 L19 21 L13 21 L12 10 L11 21 L5 21 Z" />} />;
const IconDress = (p) => <Icon {...p} path={<path d="M9 3 H15 L16 8 L20 21 H4 L8 8 Z M9 3 Q12 6 15 3" />} />;
const IconShoe = (p) => <Icon {...p} path={<path d="M3 17 Q3 13 7 12 L11 10 Q13 9 15 10 L20 13 Q22 14 22 17 L22 18 H3 Z M11 10 V6 M7 12 L7 8" />} />;
const IconJewelry = (p) => <Icon {...p} path={<path d="M12 8 A5 5 0 1 1 11.99 8 M9 3 L12 8 L15 3 M8 3 H16" />} />;
const IconBag = (p) => <Icon {...p} path={<path d="M5 9 H19 L18 21 H6 Z M8 9 V6 A4 4 0 0 1 16 6 V9" />} />;
const IconAccessory = (p) => <Icon {...p} path={<path d="M4 8 Q9 4 12 8 Q15 4 20 8 Q15 12 12 8 Q9 12 4 8 Z" />} />;
const IconSun = (p) => <Icon {...p} path={<g><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></g>} />;
const IconCloud = (p) => <Icon {...p} path={<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4.5 4.5 0 0 1 17 18Z" />} />;
const IconRain = (p) => <Icon {...p} path={<g><path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4.5 4.5 0 0 1 17 15Z" /><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" /></g>} />;
const IconSnow = (p) => <Icon {...p} path={<g><path d="M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4.5 4.5 0 0 1 17 15Z" /><path d="M12 17v5M9.5 19.5l5-2M9.5 17.5l5 2" /></g>} />;
const IconChevron = (p) => <Icon {...p} path={<path d="M9 6l6 6-6 6" />} />;
const IconChevronDown = (p) => <Icon {...p} path={<path d="M6 9l6 6 6-6" />} />;
const IconPlus = (p) => <Icon {...p} path={<path d="M12 5v14M5 12h14" />} />;
const IconClose = (p) => <Icon {...p} path={<path d="M6 6l12 12M18 6L6 18" />} />;
const IconHeart = (p) => <Icon {...p} path={<path d="M12 20s-7-4.35-9.5-8.8C.7 7.6 2.6 4 6.2 4c2 0 3.4 1 4.8 3 1.4-2 2.8-3 4.8-3 3.6 0 5.5 3.6 3.7 7.2C19 15.65 12 20 12 20Z" />} />;
const IconChat = (p) => <Icon {...p} path={<path d="M4 5h16v11H8l-4 4V5Z" />} />;
const IconCheck = (p) => <Icon {...p} path={<path d="M5 13l4 4L19 7" />} />;
const IconRefresh = (p) => <Icon {...p} path={<path d="M4 4v5h5M20 20v-5h-5M4.6 15a8 8 0 0 0 13.8 3.2M19.4 9A8 8 0 0 0 5.6 5.8" />} />;
const IconSwap = (p) => <Icon {...p} path={<path d="M7 7h11l-3-3M17 17H6l3 3" />} />;
const IconTrash = (p) => <Icon {...p} path={<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />} />;
const IconUser = (p) => <Icon {...p} path={<g><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></g>} />;
const IconMenu = (p) => <Icon {...p} path={<path d="M4 7h16M4 12h16M4 17h16" />} />;
const IconSend = (p) => <Icon {...p} path={<path d="M4 12l16-8-6 16-2.5-6L4 12Z" />} />;
const IconMapPin = (p) => <Icon {...p} path={<g><path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.2" /></g>} />;
const IconUpload = (p) => <Icon {...p} path={<path d="M12 16V4M7 9l5-5 5 5M4 19h16" />} />;
const IconArrowRight = (p) => <Icon {...p} path={<path d="M4 12h16M13 5l7 7-7 7" />} />;
const IconHanger = (p) => <Icon {...p} path={<path d="M12 3a2 2 0 0 1 2 2c0 .9-.6 1.6-1.4 1.9L12 7v1.3l8.4 5.2c.9.6 1.4 1.5 1.4 2.5 0 1.7-1.3 3-3 3H5.2c-1.7 0-3-1.3-3-3 0-1 .5-1.9 1.4-2.5L12 8.3V7l-.6-.1A2 2 0 0 1 10 5a2 2 0 0 1 2-2Z" />} />;
const IconSparkle = (p) => <Icon {...p} path={<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z" />} />;

const CATEGORY_ICON = { Tops: IconTop, Bottoms: IconBottom, Dresses: IconDress, Shoes: IconShoe, Jewelry: IconJewelry, Bags: IconBag, Accessories: IconAccessory };

/* ============================== DATA ============================== */
const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Shoes", "Jewelry", "Bags", "Accessories"];

const MOODS = [
  { id: "Casual", tags: ["casual", "relaxed", "easy"] },
  { id: "Confident", tags: ["bold", "structured", "statement"] },
  { id: "Elegant", tags: ["elegant", "tailored", "refined"] },
  { id: "Chill", tags: ["relaxed", "soft", "easy"] },
  { id: "Energetic", tags: ["sporty", "dynamic", "bold"] },
  { id: "Romantic", tags: ["soft", "flowy", "feminine"] },
  { id: "Minimal", tags: ["minimal", "clean", "simple"] },
  { id: "Edgy", tags: ["edgy", "structured", "bold"] },
  { id: "Professional", tags: ["tailored", "structured", "polished"] },
];
const MOOD_HELP = ["Something effortless", "Keep it comfortable", "Make it bold", "Surprise me"];
const MOOD_HELP_MAP = {
  "Something effortless": "Chill",
  "Keep it comfortable": "Casual",
  "Make it bold": "Confident",
  "Surprise me": null,
};

const OCCASIONS = [
  { id: "College", formality: 2 },
  { id: "Work", formality: 4 },
  { id: "Date", formality: 3 },
  { id: "Party", formality: 3 },
  { id: "Dinner", formality: 4 },
  { id: "Travel", formality: 2 },
  { id: "Wedding", formality: 5 },
  { id: "Casual", formality: 1 },
];

const CLOTHING_TYPES = ["Any", "Dress", "Top + Bottom", "Shirt", "Skirt", "Jeans", "Trousers"];
const COLORS = ["Any", "Black", "White", "Maroon", "Beige", "Navy", "Denim", "Grey", "Olive", "Pink", "Cream", "Brown", "Gold", "Silver", "Mustard", "Green"];
const PATTERNS = ["Any", "Solid", "Striped", "Floral", "Checked", "Printed", "Polka Dot", "Textured"];
const STYLES = ["Any", "Casual", "Elegant", "Minimal", "Edgy", "Sporty", "Romantic", "Tailored", "Bold"];
const FITS = ["Any", "Relaxed", "Fitted", "Oversized", "Tailored", "Regular"];
const SEASONS = ["Summer", "Monsoon", "Winter", "All-season"];

const COLOR_HEX = {
  black: "#141214", white: "#F3F0EC", maroon: "#7A1128", red: "#8C1A2B", beige: "#D9CEBD",
  navy: "#232A3B", denim: "#3E5670", grey: "#8C8880", gray: "#8C8880", olive: "#5B5C42",
  pink: "#C79098", cream: "#EFE7D8", brown: "#5C4230", gold: "#AD8A46", silver: "#B7B3AC",
  mustard: "#B08A34", green: "#465A45", blue: "#3E5670", ivory: "#EFE9DC", tan: "#B79A73",
};
const colorToHex = (c) => COLOR_HEX[(c || "").toLowerCase().trim()] || "#8C8880";

/* Seed closet — representative wardrobe so the engine has real material to work with */
let _uidc = 0;
const uid = (p = "it") => `${p}_${Date.now().toString(36)}_${(_uidc++).toString(36)}`;

const seedItem = (o) => ({ id: uid(), image: null, tags: [], fit: "Regular", pattern: "Solid", ...o });

const SEED_CLOSET = [
  seedItem({ name: "White Poplin Shirt", category: "Tops", color: "White", pattern: "Solid", style: ["Minimal", "Tailored", "Casual"], season: ["All-season"], fit: "Regular", formality: 3, warmth: 2, tags: ["full-sleeve"] }),
  seedItem({ name: "Black Ribbed Tank", category: "Tops", color: "Black", pattern: "Solid", style: ["Minimal", "Edgy", "Bold"], season: ["Summer", "All-season"], fit: "Fitted", formality: 1, warmth: 1, tags: ["sleeveless"] }),
  seedItem({ name: "Maroon Silk Blouse", category: "Tops", color: "Maroon", pattern: "Solid", style: ["Elegant", "Romantic"], season: ["All-season"], fit: "Regular", formality: 4, warmth: 2, tags: ["full-sleeve"] }),
  seedItem({ name: "Ivory Knit Sweater", category: "Tops", color: "Cream", pattern: "Textured", style: ["Minimal", "Casual", "Tailored"], season: ["Winter"], fit: "Relaxed", formality: 2, warmth: 4, tags: ["full-sleeve", "layer"] }),
  seedItem({ name: "Grey Oversized Tee", category: "Tops", color: "Grey", pattern: "Solid", style: ["Casual", "Sporty"], season: ["Summer", "All-season"], fit: "Oversized", formality: 1, warmth: 1, tags: ["short-sleeve"] }),
  seedItem({ name: "Beige Linen Shirt", category: "Tops", color: "Beige", pattern: "Solid", style: ["Casual", "Minimal", "Tailored"], season: ["Summer"], fit: "Relaxed", formality: 2, warmth: 1, tags: ["short-sleeve"] }),
  seedItem({ name: "Black Structured Blazer", category: "Tops", color: "Black", pattern: "Solid", style: ["Professional", "Tailored", "Bold"], season: ["All-season"], fit: "Tailored", formality: 5, warmth: 3, tags: ["full-sleeve", "layer"] }),

  seedItem({ name: "Straight Black Trousers", category: "Bottoms", color: "Black", pattern: "Solid", style: ["Tailored", "Minimal", "Professional"], season: ["All-season"], fit: "Tailored", formality: 4, warmth: 3 }),
  seedItem({ name: "Light Wash Denim Jeans", category: "Bottoms", color: "Denim", pattern: "Solid", style: ["Casual", "Bold"], season: ["All-season"], fit: "Regular", formality: 1, warmth: 2 }),
  seedItem({ name: "Maroon Midi Skirt", category: "Bottoms", color: "Maroon", pattern: "Solid", style: ["Elegant", "Romantic", "Bold"], season: ["All-season"], fit: "Fitted", formality: 3, warmth: 2 }),
  seedItem({ name: "White Linen Trousers", category: "Bottoms", color: "White", pattern: "Solid", style: ["Minimal", "Elegant", "Casual"], season: ["Summer"], fit: "Relaxed", formality: 3, warmth: 1 }),
  seedItem({ name: "Black Bike Shorts", category: "Bottoms", color: "Black", pattern: "Solid", style: ["Sporty", "Edgy"], season: ["Summer", "All-season"], fit: "Fitted", formality: 1, warmth: 1 }),
  seedItem({ name: "Olive Cargo Pants", category: "Bottoms", color: "Olive", pattern: "Solid", style: ["Casual", "Edgy", "Bold"], season: ["All-season"], fit: "Relaxed", formality: 1, warmth: 2 }),

  seedItem({ name: "Black Slip Dress", category: "Dresses", color: "Black", pattern: "Solid", style: ["Elegant", "Bold", "Minimal"], season: ["All-season"], fit: "Fitted", formality: 4, warmth: 1, tags: ["sleeveless"] }),
  seedItem({ name: "Maroon Wrap Dress", category: "Dresses", color: "Maroon", pattern: "Solid", style: ["Elegant", "Romantic", "Professional"], season: ["All-season"], fit: "Fitted", formality: 4, warmth: 2, tags: ["full-sleeve"] }),
  seedItem({ name: "White Cotton Sundress", category: "Dresses", color: "White", pattern: "Floral", style: ["Romantic", "Casual", "Minimal"], season: ["Summer"], fit: "Relaxed", formality: 2, warmth: 1, tags: ["sleeveless"] }),
  seedItem({ name: "Black Turtleneck Dress", category: "Dresses", color: "Black", pattern: "Solid", style: ["Minimal", "Edgy", "Elegant"], season: ["Winter"], fit: "Fitted", formality: 3, warmth: 4, tags: ["full-sleeve"] }),

  seedItem({ name: "White Leather Sneakers", category: "Shoes", color: "White", pattern: "Solid", style: ["Casual", "Minimal", "Sporty"], season: ["All-season"], fit: "Regular", formality: 1, warmth: 2, tags: ["closed-toe"] }),
  seedItem({ name: "Black Ankle Boots", category: "Shoes", color: "Black", pattern: "Solid", style: ["Edgy", "Bold", "Tailored"], season: ["Winter", "Monsoon"], fit: "Regular", formality: 3, warmth: 3, tags: ["closed-toe", "waterproof"] }),
  seedItem({ name: "Maroon Block Heels", category: "Shoes", color: "Maroon", pattern: "Solid", style: ["Elegant", "Bold", "Romantic"], season: ["All-season"], fit: "Regular", formality: 4, warmth: 1, tags: ["closed-toe"] }),
  seedItem({ name: "Black Strappy Sandals", category: "Shoes", color: "Black", pattern: "Solid", style: ["Elegant", "Bold"], season: ["Summer"], fit: "Regular", formality: 3, warmth: 1, tags: ["open-toe"] }),
  seedItem({ name: "Tan Woven Flats", category: "Shoes", color: "Brown", pattern: "Textured", style: ["Casual", "Minimal"], season: ["Summer", "All-season"], fit: "Regular", formality: 2, warmth: 1, tags: ["closed-toe"] }),
  seedItem({ name: "Black Chelsea Boots", category: "Shoes", color: "Black", pattern: "Solid", style: ["Professional", "Tailored", "Edgy"], season: ["Winter", "Monsoon"], fit: "Regular", formality: 4, warmth: 3, tags: ["closed-toe", "waterproof"] }),

  seedItem({ name: "Gold Hoop Earrings", category: "Jewelry", color: "Gold", pattern: "Solid", style: ["Bold", "Casual", "Elegant"], season: ["All-season"], formality: 2, warmth: 0 }),
  seedItem({ name: "Delicate Pearl Studs", category: "Jewelry", color: "Silver", pattern: "Solid", style: ["Minimal", "Elegant", "Professional"], season: ["All-season"], formality: 4, warmth: 0 }),
  seedItem({ name: "Layered Gold Necklace", category: "Jewelry", color: "Gold", pattern: "Solid", style: ["Bold", "Elegant", "Romantic"], season: ["All-season"], formality: 3, warmth: 0 }),
  seedItem({ name: "Silver Cuff Bracelet", category: "Jewelry", color: "Silver", pattern: "Solid", style: ["Edgy", "Minimal"], season: ["All-season"], formality: 2, warmth: 0 }),

  seedItem({ name: "Black Structured Tote", category: "Bags", color: "Black", pattern: "Solid", style: ["Professional", "Minimal", "Tailored"], season: ["All-season"], formality: 4, warmth: 0 }),
  seedItem({ name: "Maroon Crossbody Bag", category: "Bags", color: "Maroon", pattern: "Solid", style: ["Elegant", "Bold", "Casual"], season: ["All-season"], formality: 2, warmth: 0 }),
  seedItem({ name: "Woven Straw Tote", category: "Bags", color: "Beige", pattern: "Textured", style: ["Casual", "Romantic"], season: ["Summer"], formality: 1, warmth: 0 }),
  seedItem({ name: "Black Mini Shoulder Bag", category: "Bags", color: "Black", pattern: "Solid", style: ["Edgy", "Bold", "Elegant"], season: ["All-season"], formality: 3, warmth: 0 }),

  seedItem({ name: "Black Wool Scarf", category: "Accessories", color: "Black", pattern: "Solid", style: ["Minimal", "Tailored"], season: ["Winter"], formality: 2, warmth: 3, tags: ["layer"] }),
  seedItem({ name: "Tortoise Sunglasses", category: "Accessories", color: "Brown", pattern: "Solid", style: ["Casual", "Bold"], season: ["Summer", "All-season"], formality: 1, warmth: 0 }),
  seedItem({ name: "Slim Leather Belt", category: "Accessories", color: "Black", pattern: "Solid", style: ["Tailored", "Minimal", "Professional"], season: ["All-season"], formality: 2, warmth: 0 }),
  seedItem({ name: "Maroon Beanie", category: "Accessories", color: "Maroon", pattern: "Solid", style: ["Casual", "Bold"], season: ["Winter"], formality: 1, warmth: 3, tags: ["layer"] }),
];

/* ============================== WEATHER (mock forecast engine; swap for a live API later) ============================== */
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}
function seasonForDate(d) {
  const m = d.getMonth() + 1;
  if (m >= 3 && m <= 5) return "Summer";
  if (m >= 6 && m <= 9) return "Monsoon";
  if (m >= 10 || m <= 2) return "Winter";
  return "All-season";
}
const WeatherService = {
  getForecast(city, date) {
    const key = `${(city || "").toLowerCase().trim()}|${date.toDateString()}`;
    const h = hashStr(key);
    const season = seasonForDate(date);
    let base;
    if (season === "Summer") base = 30 + (h % 10);
    else if (season === "Monsoon") base = 24 + (h % 7);
    else if (season === "Winter") base = 10 + (h % 9);
    else base = 20 + (h % 8);
    const tempC = base;
    const rainRoll = (h >> 3) % 100;
    const rain = season === "Monsoon" ? rainRoll < 55 : rainRoll < 12;
    let condition = rain ? "Rainy" : tempC >= 32 ? "Sunny" : tempC <= 13 ? "Cold & Clear" : (h % 5 === 0 ? "Cloudy" : "Clear");
    let bucket = tempC >= 32 ? "Hot" : tempC >= 22 ? "Warm" : tempC >= 14 ? "Mild" : "Cold";
    return { city: city || "Your area", date, tempC, condition, bucket, rain, season };
  },
};
const WeatherIconFor = (w) => {
  if (!w) return IconSun;
  if (w.rain) return IconRain;
  if (w.bucket === "Cold") return IconSnow;
  if (w.condition === "Cloudy") return IconCloud;
  return IconSun;
};

/* ============================== STYLIST ENGINE ============================== */
const MOOD_MAP = Object.fromEntries(MOODS.map((m) => [m.id, m.tags]));
const OCC_MAP = Object.fromEntries(OCCASIONS.map((o) => [o.id, o.formality]));

function seasonalBonus(item, weather) {
  if (!item.season) return 0;
  if (item.season.includes("All-season")) return 1;
  if (item.season.includes(weather.season)) return 2;
  return 0;
}

function weatherScore(item, weather, category) {
  let s = 0;
  const warmth = item.warmth || 0;
  if (weather.bucket === "Hot") {
    if (warmth <= 2) s += 3; else if (warmth >= 4) s -= 4;
    if ((item.tags || []).includes("sleeveless") || (item.tags || []).includes("short-sleeve")) s += 1;
    if ((item.tags || []).includes("full-sleeve") && category === "Tops") s -= 1.5;
  } else if (weather.bucket === "Cold") {
    if (warmth >= 3) s += 3; else if (warmth <= 1) s -= 2;
    if ((item.tags || []).includes("layer")) s += 2;
    if ((item.tags || []).includes("full-sleeve")) s += 1;
  } else if (weather.bucket === "Warm") {
    if (warmth <= 3) s += 1.5;
  } else {
    if (warmth >= 2) s += 1;
  }
  if (weather.rain && category === "Shoes") {
    if ((item.tags || []).includes("waterproof") || (item.tags || []).includes("closed-toe")) s += 4;
    if ((item.tags || []).includes("open-toe")) s -= 5;
  }
  if (weather.rain && category === "Bags") s += 0.4;
  return s;
}

function filterMatchScore(item, filters, category) {
  let s = 0;
  if (!filters) return s;
  if (filters.color && filters.color !== "Any" && (item.color || "").toLowerCase() === filters.color.toLowerCase()) s += 5;
  if (filters.pattern && filters.pattern !== "Any" && (item.pattern || "").toLowerCase() === filters.pattern.toLowerCase()) s += 5;
  if (filters.style && filters.style !== "Any" && (item.style || []).map((x) => x.toLowerCase()).includes(filters.style.toLowerCase())) s += 5;
  if (filters.fit && filters.fit !== "Any" && (item.fit || "").toLowerCase() === filters.fit.toLowerCase()) s += 4;
  return s;
}

function scoreItem(item, { mood, occasion, weather, filters, category }) {
  let s = 0;
  const moodTags = mood ? MOOD_MAP[mood] || [] : [];
  const styleOverlap = (item.style || []).filter((t) => moodTags.map((x) => x.toLowerCase()).includes(t.toLowerCase())).length;
  s += styleOverlap * 3;
  if (occasion) {
    const target = OCC_MAP[occasion] ?? 3;
    s += Math.max(0, 3 - Math.abs((item.formality ?? 3) - target));
  }
  s += seasonalBonus(item, weather);
  s += weatherScore(item, weather, category);
  s += filterMatchScore(item, filters, category);
  s += Math.random() * 0.8;
  return s;
}

function rankItems(closet, category, ctx) {
  return closet
    .filter((i) => i.category === category)
    .map((i) => ({ item: i, score: scoreItem(i, { ...ctx, category }) }))
    .sort((a, b) => b.score - a.score);
}

function pickFrom(ranked, excludeId, poolSize = 3) {
  const pool = ranked.filter((r) => r.item.id !== excludeId).slice(0, poolSize);
  if (pool.length === 0) return null;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return pick.item;
}

function decideSilhouette(filters, occasion, closet) {
  const type = filters && filters.clothing !== "Any" ? filters.clothing : null;
  if (type === "Dress") return "dress";
  if (type === "Top + Bottom" || type === "Shirt" || type === "Skirt" || type === "Jeans" || type === "Trousers") return "separates";
  const dressLean = ["Wedding", "Dinner", "Party", "Date"].includes(occasion);
  const hasDresses = closet.some((i) => i.category === "Dresses");
  if (dressLean && hasDresses && Math.random() < 0.6) return "dress";
  return "separates";
}

function buildExplanation({ mood, occasion, weather, picks }) {
  const bits = [];
  if (mood) bits.push(`${mood.toLowerCase()} mood`);
  if (occasion) bits.push(`${occasion.toLowerCase()} plans`);
  const weatherBit = weather.rain
    ? `rain expected near ${weather.tempC}°C`
    : weather.bucket === "Hot"
    ? `a warm ${weather.tempC}°C`
    : weather.bucket === "Cold"
    ? `a cool ${weather.tempC}°C`
    : `a mild ${weather.tempC}°C`;
  let lead = `Built around your ${bits.join(" and ") || "day"}, with ${weatherBit} outside.`;
  const notes = [];
  const top = picks.top || picks.dress;
  if (top) notes.push(`the ${top.name.toLowerCase()} carries the ${mood ? mood.toLowerCase() : "tone"} you're after`);
  if (picks.shoes) {
    if (weather.rain && (picks.shoes.tags || []).includes("closed-toe")) notes.push(`${picks.shoes.name.toLowerCase()} keep your feet covered if it rains`);
    else if (weather.bucket === "Hot" && (picks.shoes.warmth || 0) <= 2) notes.push(`${picks.shoes.name.toLowerCase()} stay breathable in the heat`);
    else notes.push(`${picks.shoes.name.toLowerCase()} ground the look`);
  }
  if (picks.bag) notes.push(`finished with the ${picks.bag.name.toLowerCase()}`);
  return `${lead} ${notes.length ? notes.join(", ") + "." : ""}`.trim();
}

const StylistEngine = {
  generate(closet, { mood, occasion, weather, filters }) {
    const ctx = { mood, occasion, weather, filters };
    const silhouette = decideSilhouette(filters, occasion, closet);
    const picks = {};
    if (silhouette === "dress" && closet.some((i) => i.category === "Dresses")) {
      const ranked = rankItems(closet, "Dresses", ctx);
      picks.dress = pickFrom(ranked, null, 3);
    } else {
      const rt = rankItems(closet, "Tops", ctx);
      const rb = rankItems(closet, "Bottoms", ctx);
      picks.top = pickFrom(rt, null, 3);
      picks.bottom = pickFrom(rb, null, 3);
    }
    picks.shoes = pickFrom(rankItems(closet, "Shoes", ctx), null, 3);
    picks.jewelry = pickFrom(rankItems(closet, "Jewelry", ctx), null, 4);
    picks.bag = pickFrom(rankItems(closet, "Bags", ctx), null, 3);
    const wantsAccessory = OCC_MAP[occasion] >= 3 || Math.random() < 0.35;
    if (wantsAccessory) picks.accessory = pickFrom(rankItems(closet, "Accessories", ctx), null, 3);
    const why = buildExplanation({ mood, occasion, weather, picks });
    return { picks, why, mood, occasion, weather, filters, id: uid("outfit") };
  },
  regenerateSlot(outfit, slot, closet) {
    const ctx = { mood: outfit.mood, occasion: outfit.occasion, weather: outfit.weather, filters: outfit.filters };
    const categoryBySlot = { top: "Tops", bottom: "Bottoms", dress: "Dresses", shoes: "Shoes", jewelry: "Jewelry", bag: "Bags", accessory: "Accessories" };
    const cat = categoryBySlot[slot];
    const ranked = rankItems(closet, cat, ctx);
    const current = outfit.picks[slot];
    const next = pickFrom(ranked, current ? current.id : null, 4);
    const newPicks = { ...outfit.picks, [slot]: next || current };
    return { ...outfit, picks: newPicks, why: buildExplanation({ mood: outfit.mood, occasion: outfit.occasion, weather: outfit.weather, picks: newPicks }), id: uid("outfit") };
  },
};

/* ============================== SHARED UI ============================== */
function ItemVisual({ item, className = "" }) {
  if (!item) {
    return (
      <div className={`flex items-center justify-center bg-surface border hairline ${className}`}>
        <span className="text-faint text-xs">Not in closet yet</span>
      </div>
    );
  }
  const CatIcon = CATEGORY_ICON[item.category] || IconTop;
  if (item.image) {
    return (
      <div className={`overflow-hidden ${className}`} style={{ background: colorToHex(item.color) + "22" }}>
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ background: colorToHex(item.color) + "1f" }}>
      <CatIcon className="w-10 h-10" strokeWidth={1.1} style={{ color: colorToHex(item.color) }} />
      <div className="absolute bottom-2 left-2 right-2 h-[2px]" style={{ background: colorToHex(item.color) }} />
    </div>
  );
}

function Chip({ active, onClick, children, className = "", color }) {
  return (
    <button
      type="button"
      data-active={active ? "true" : "false"}
      onClick={onClick}
      style={active && color ? { background: color, borderColor: color, color: "#fff" } : undefined}
      className={`chip px-4 py-2 text-sm rounded-full text-ink whitespace-nowrap ${className}`}
    >
      {children}
    </button>
  );
}

const MOOD_PALETTE = ["var(--maroon)", "var(--coral)", "var(--sun)", "var(--sky)", "var(--lilac)", "var(--mint)"];
const MOOD_COLOR = Object.fromEntries(MOODS.map((m, i) => [m.id, MOOD_PALETTE[i % MOOD_PALETTE.length]]));

function SectionLabel({ children }) {
  return <p className="font-display text-xs tracking-wide text-soft mb-3">{children}</p>;
}

function WeatherBadge({ weather, compact }) {
  if (!weather) return null;
  const WIcon = WeatherIconFor(weather);
  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "border hairline px-4 py-3"}`}>
      <WIcon className="w-5 h-5 text-maroon" strokeWidth={1.3} />
      <div className="leading-tight">
        <div className="text-sm">{weather.tempC}°C · {weather.condition}</div>
        {!compact && <div className="text-xs text-faint">{weather.city}</div>}
      </div>
    </div>
  );
}

function Logo({ className = "", subtitle = false }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display font-semibold tracking-tight text-lg">
        STYL<span className="italic font-normal text-maroon">ist</span>
      </span>
      {subtitle && <span className="text-[9px] tracking-[0.22em] text-faint mt-1">YOUR AI STYLIST</span>}
    </span>
  );
}

/* ============================== NAV ============================== */
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "closet", label: "My Closet" },
  { id: "outfit", label: "Today's Outfit" },
  { id: "canvas", label: "Canvas" },
  { id: "chat", label: "Style Chat" },
];

function GetStyledButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-maroon text-bg pl-5 pr-4 py-2.5 text-xs font-semibold tracking-[0.08em] rounded-full hover:bg-maroon-deep transition-colors ${className}`}
    >
      GET STYLED <IconArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
    </button>
  );
}

function NavBar({ page, setPage, user, onLogin, onSignup, onLogout, authed }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky z-40 bg-bg/95 backdrop-blur border-b hairline" style={{ top: 0, paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <button onClick={() => authed && setPage("home")} className="shrink-0">
          <Logo subtitle />
        </button>
        {authed && (
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.filter((n) => n.id !== "canvas").map((n) => (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                className={`text-sm tracking-wide pb-1 border-b transition-colors ${page === n.id ? "text-ink border-maroon" : "text-soft border-transparent hover:text-ink"}`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        )}
        <div className="hidden md:flex items-center gap-5">
          {authed ? (
            <>
              <button onClick={() => setPage("profile")} className={`inline-flex items-center gap-2 text-sm ${page === "profile" ? "text-maroon" : "text-soft hover:text-ink"}`}>
                <IconUser className="w-5 h-5" strokeWidth={1.3} /> Profile
              </button>
              <button onClick={onLogout} className="text-xs text-faint hover:text-maroon">Log out</button>
              <GetStyledButton onClick={() => setPage("outfit")} />
            </>
          ) : (
            <>
              <button onClick={onLogin} className="text-sm text-soft hover:text-maroon">Log in</button>
              <GetStyledButton onClick={onSignup} />
            </>
          )}
        </div>
        {authed && (
          <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <IconClose className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        )}
        {!authed && (
          <button onClick={onSignup} className="md:hidden bg-maroon text-bg px-4 py-2 text-xs rounded-full">Get styled</button>
        )}
      </div>
      {open && authed && (
        <div className="md:hidden border-t hairline bg-bg px-5 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.id}
              onClick={() => { setPage(n.id); setOpen(false); }}
              className={`text-left py-3 text-base border-b hairline ${page === n.id ? "text-maroon" : "text-ink"}`}
            >
              {n.label}
            </button>
          ))}
          <button onClick={() => { setPage("profile"); setOpen(false); }} className={`text-left py-3 text-base border-b hairline ${page === "profile" ? "text-maroon" : "text-ink"}`}>Profile</button>
          <button onClick={onLogout} className="text-left py-3 text-base text-maroon">Log out</button>
        </div>
      )}
    </header>
  );
}

/* ============================== LANDING (logged-out gate) ============================== */
/* A little collage mixing real behind-the-scenes styling photos with tilted, color-swatched
   "closet cards" built from the app's own icon set — keeps the hero playful and grounded. */
function HeroCollage() {
  const iconCards = [
    { Icon: IconBag, color: "var(--sun)", rot: -4, top: "42%", left: "2%", size: "w-24 h-28", delay: "float-fast" },
    { Icon: IconJewelry, color: "var(--mint)", rot: -6, top: "70%", left: "24%", size: "w-24 h-24", delay: "float-med" },
  ];
  const photoCards = [
    { src: "/static/assets/styling-panel-2.jpg", rot: -7, top: "2%", left: "38%", size: "w-28 h-40", delay: "float-slow" },
    { src: "/static/assets/styling-panel-3.jpg", rot: 5, top: "46%", left: "56%", size: "w-28 h-36", delay: "float-slow" },
  ];
  return (
    <div className="relative h-[420px] md:h-[520px] w-full">
      <div className="blob-shape" style={{ width: 220, height: 220, top: "6%", right: "4%", background: "var(--sun)" }} />
      <div className="blob-shape" style={{ width: 180, height: 180, bottom: "8%", left: "0%", background: "var(--sky)" }} />
      <div className="blob-shape" style={{ width: 140, height: 140, top: "40%", right: "18%", background: "var(--coral)" }} />
      {["10%", "30%", "62%", "78%", "18%"].map((left, i) => (
        <span key={i} className="confetti-dot" style={{ width: 8 + (i % 3) * 4, height: 8 + (i % 3) * 4, left, top: `${8 + i * 16}%`, background: [ "var(--maroon)", "var(--sun)", "var(--sky)", "var(--coral)", "var(--lilac)" ][i] }} />
      ))}
      {iconCards.map(({ Icon, color, rot, top, left, size, delay }, i) => (
        <div key={`icon-${i}`} className={`${delay} absolute ${size} border hairline bg-surface shadow-sm flex items-center justify-center`} style={{ top, left, "--r": `${rot}deg`, transform: `rotate(${rot}deg)`, boxShadow: "0 18px 34px -18px rgba(18,16,18,0.28)" }}>
          <div className="absolute inset-0" style={{ background: `${color}22` }} />
          <Icon className="w-10 h-10 md:w-12 md:h-12 relative" strokeWidth={1.1} style={{ color }} />
        </div>
      ))}
      {photoCards.map(({ src, rot, top, left, size, delay }, i) => (
        <div key={`photo-${i}`} className={`${delay} absolute ${size} border hairline bg-surface overflow-hidden`} style={{ top, left, "--r": `${rot}deg`, transform: `rotate(${rot}deg)`, boxShadow: "0 18px 34px -18px rgba(18,16,18,0.32)" }}>
          <img src={src} alt="Real styling session" className="w-full h-full object-cover grayscale" />
        </div>
      ))}
    </div>
  );
}

function Landing({ onGetStarted, onLogin }) {
  return (
    <div className="landing-glow">
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-14 md:pt-24 pb-16 md:pb-24 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="text-center md:text-left">
          <p className="font-display text-xs tracking-wide text-maroon mb-5">Personal Stylist · AI-powered ✦</p>
          <h1 className="font-display text-[13vw] leading-[0.95] md:text-6xl md:leading-[1.02] font-semibold text-ink">
            Dress for<br /><span className="italic font-normal">your mood.</span>
          </h1>
          <p className="mt-6 text-soft text-base md:text-lg max-w-md mx-auto md:mx-0">
            A wardrobe-aware AI stylist that reads your mood, your calendar, and the weather — then builds today's outfit from pieces you already own.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button onClick={onGetStarted} className="bg-ink text-bg px-8 py-3.5 text-sm tracking-wide hover:bg-maroon transition-colors">
              Create your style profile
            </button>
            <button onClick={onLogin} className="text-sm text-ink border-b hairline-strong pb-0.5 hover:border-maroon">
              I already have an account
            </button>
          </div>
          <p className="mt-6 text-xs text-faint">Free to use · sign up takes under a minute · your closet starts empty, just how you left it</p>
        </div>
        <HeroCollage />
      </section>

      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-16 md:pb-24">
        <div className="glass-card p-6 md:p-10 text-left grid md:grid-cols-3 gap-8 md:gap-10">
          {[
            { icon: IconUser, title: "Tell us your style", body: "Gender, birthday, city, and the style language you gravitate toward — takes under a minute.", color: "var(--coral)" },
            { icon: IconSun, title: "We read the room", body: "Live weather and mood get factored into every recommendation, automatically.", color: "var(--sun)" },
            { icon: IconHeart, title: "Outfits from your closet", body: "Every suggestion is built only from pieces you actually own — never a shopping list.", color: "var(--sky)" },
          ].map((f, i) => (
            <div key={i}>
              <div className="swatch-badge mb-4" style={{ background: `${f.color}26` }}>
                <f.icon className="w-6 h-6" strokeWidth={1.3} style={{ color: f.color }} />
              </div>
              <h3 className="font-display text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-soft leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ============================== HOME ============================== */
const LAYER_TIP = { Hot: "Breathable fabrics", Warm: "Light layers", Mild: "Light layers", Cold: "Warm layers" };

/* Today's Edit — a handful of themed picks, each generated live from the user's real closet via
   StylistEngine, so a new/empty closet naturally shows the "not in closet yet" placeholder state
   instead of any fabricated photos. */
const EDIT_THEMES = [
  { title: "Casual Comfort", mood: "Casual", occasion: "Travel", blurb: "Light, comfortable and perfect for today's weather." },
  { title: "Minimal Chic", mood: "Minimal", occasion: "Work", blurb: "A clean, timeless look that always works." },
  { title: "Going Out", mood: "Confident", occasion: "Party", blurb: "Elevated, stylish and made to turn heads." },
  { title: "College Ready", mood: "Energetic", occasion: "College", blurb: "Effortless, practical and still put together." },
];

function TodaysEditCard({ theme, closet, weather, setPage }) {
  const outfit = useMemo(
    () => StylistEngine.generate(closet, { mood: theme.mood, occasion: theme.occasion, weather, filters: {} }),
    [closet.length, theme.mood, theme.occasion, weather.bucket]
  );
  const thumbs = Object.values(outfit.picks).filter(Boolean).slice(0, 4);
  const cells = thumbs.length ? thumbs : [null, null, null];
  return (
    <div className="bg-surface border hairline rounded-2xl p-4 md:p-5 flex gap-4 tilt-card">
      <div className="grid grid-cols-2 gap-1.5 w-2/5 shrink-0 self-start">
        {cells.slice(0, 4).map((item, i) => (
          <ItemVisual key={i} item={item} className="aspect-square rounded-lg" />
        ))}
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <h3 className="font-display text-lg leading-tight">{theme.title}</h3>
        <p className="text-xs font-semibold text-ink mt-3">Why this works?</p>
        <p className="text-sm text-soft leading-relaxed mt-1">{theme.blurb}</p>
        <button onClick={() => setPage("outfit")} aria-label={`Style ${theme.title}`} className="mt-auto self-end w-9 h-9 rounded-full border hairline-strong flex items-center justify-center hover:border-maroon hover:text-maroon transition-colors">
          <IconArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <Logo />
          <span className="text-sm text-soft">Style a <span className="font-display italic text-maroon">happier</span> you.</span>
        </div>
        <p className="text-xs tracking-[0.15em] text-faint uppercase">Clothes &middot; Confidence &middot; Everyday</p>
      </div>
    </footer>
  );
}

function Home({ setPage, closet, weather, aiRecommendations }) {
  const closetCount = closet.length;
  const layerTip = weather.rain ? "Waterproof pieces" : LAYER_TIP[weather.bucket] || "Light layers";
  const WIcon = WeatherIconFor(weather);
  return (
    <div>
      <section className="w-full grid md:grid-cols-2 items-stretch">
        <div className="fade-in flex flex-col justify-center pl-5 md:pl-10 lg:pl-16 xl:pl-24 pr-5 md:pr-10 py-14 md:py-20">
          <p className="font-display text-xs tracking-[0.2em] text-maroon mb-5 leading-relaxed">GET DRESSED.<br />FEEL LIKE YOURSELF.</p>
          <h1 className="font-display text-[13vw] leading-[0.95] md:text-6xl md:leading-[1.02] font-semibold text-ink">
            Dress for<br />your <span className="italic font-normal text-maroon">mood.</span>
          </h1>
          <p className="mt-6 text-soft text-base md:text-lg max-w-sm">
            Your AI stylist for everyday outfits, built around your wardrobe, mood and weather.
          </p>
          <div className="mt-9">
            <GetStyledButton onClick={() => setPage("outfit")} className="!py-3.5 !pl-7 !pr-5 !text-sm" />
          </div>
          <div className="mt-11 flex items-center gap-5 flex-wrap">
            {weather && (
              <div className="flex items-center gap-2.5">
                <WIcon className="w-6 h-6 text-ink" strokeWidth={1.2} />
                <div className="leading-tight">
                  <div className="text-sm font-medium">{weather.city.toUpperCase()} &middot; {weather.tempC}&deg;C</div>
                  <div className="text-xs text-faint">{weather.condition}</div>
                </div>
              </div>
            )}
            <span className="w-px h-9 bg-[var(--border)]" />
            <div className="flex items-center gap-2.5">
              <IconHanger className="w-6 h-6 text-ink" strokeWidth={1.2} />
              <div className="leading-tight">
                <div className="text-sm font-medium">{closetCount.toLocaleString()}</div>
                <div className="text-xs text-faint">pieces in your closet</div>
              </div>
            </div>
            <span className="w-px h-9 bg-[var(--border)]" />
            <div className="flex items-center gap-2.5">
              <IconSparkle className="w-6 h-6 text-maroon" strokeWidth={1.2} />
              <div className="leading-tight">
                <div className="text-sm font-medium text-maroon">{layerTip}</div>
                <div className="text-xs text-faint">recommended</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[360px] md:min-h-[620px] overflow-hidden md:overflow-visible">
          <img src="/static/assets/personal-styling-work.jpg" alt="Behind the scenes of a real styling session" className="absolute inset-0 w-full h-full object-cover grayscale-[0.15] sepia-[0.12]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          <p className="font-hand hidden lg:block absolute  bg-[#EFE9DC] top-[10%] left-[-8%] -rotate-3 text-2xl text-bg/95 leading-snug drop-shadow">same outfit<br />different mood <span style={{ color: "var(--coral)" }}>&hearts;</span></p>
          <div className="hidden md:block absolute -top-4 -right-4 lg:right-2 w-28 rotate-6 bg-bg p-2 pb-3 shadow-xl border hairline">
            <img src="/static/assets/styling-panel-3.jpg" alt="" className="w-full h-32 object-cover grayscale" />
          </div>

          <span className="absolute bottom-5 right-5 md:right-8 text-right text-[10px] tracking-[0.18em] text-bg/90 uppercase leading-relaxed">A more<br />stylish you<br />&mdash; always</span>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <SectionLabel>Curated for you</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl">Today's Edit</h2>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <p className="text-sm text-soft">Your mood: <span className="text-maroon italic font-medium">Casual &middot; Effortless</span></p>
              <button onClick={() => setPage("outfit")} className="inline-flex items-center gap-1.5 text-sm border-b hairline-strong pb-0.5 hover:border-maroon hover:text-maroon transition-colors">
                See more <IconArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EDIT_THEMES.map((theme) => (
              <TodaysEditCard key={theme.title} theme={theme} closet={closet} weather={weather} setPage={setPage} />
            ))}
          </div>
        </div>
      </section>

          {aiRecommendations && <section className="recommendation-band"><div className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16"><div className="flex flex-wrap items-end justify-between gap-4 mb-7"><div><SectionLabel>AI edit for today</SectionLabel><h2 className="font-display text-3xl md:text-4xl">{aiRecommendations.vibe}</h2><p className="text-soft mt-2 max-w-xl">{aiRecommendations.summary}</p></div><span className="floating-badge">Personalized match</span></div><div className="grid md:grid-cols-3 gap-4">{aiRecommendations.recommendations.map((item) => <article key={item.title} className="recommendation-card"><div className="flex justify-between gap-4"><span className="text-xs text-maroon">AI MATCH</span><strong className="font-display text-lg">{item.confidence}%</strong></div><h3 className="font-display text-xl mt-8">{item.title}</h3><p className="text-sm text-soft mt-2 leading-relaxed">{item.description}</p><div className="flex flex-wrap gap-2 mt-5">{item.tags.map((tag) => <span key={tag} className="mini-tag">{tag}</span>)}</div></article>)}</div></div></section>}

      <section className="border-t hairline">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-20">
          <SectionLabel>How it works</SectionLabel>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: IconTop, title: "Your closet, catalogued", body: "Add what you actually own — tops, bottoms, dresses, shoes, jewelry, bags, accessories.", color: "var(--coral)" },
              { icon: IconSun, title: "Mood, occasion, weather", body: "Tell us how you feel and where you're headed. We read the forecast so you don't have to.", color: "var(--sun)" },
              { icon: IconHeart, title: "An outfit, explained", body: "Get a complete look pulled only from your wardrobe, with a reason it works today.", color: "var(--sky)" },
            ].map((f, i) => (
              <div key={i} className="border-t hairline-strong pt-5 tilt-card">
                <div className="swatch-badge mb-4" style={{ background: `${f.color}26` }}>
                  <f.icon className="w-6 h-6" strokeWidth={1.3} style={{ color: f.color }} />
                </div>
                <h3 className="font-display text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-soft leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t hairline bg-surface">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight">
              Today's outfit is <span className="italic text-maroon">already in your closet.</span>
            </h2>
            <p className="mt-4 text-soft max-w-md">We never suggest anything you don't own. Every recommendation is built from pieces already hanging in your wardrobe.</p>
            <button onClick={() => setPage("outfit")} className="mt-7 inline-flex items-center gap-2 border hairline-strong px-6 py-3 text-sm hover:border-maroon hover:text-maroon transition-colors">
              Style me for today <IconChevron className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Tops", "Shoes", "Bags"].map((c, i) => {
              const items = closet.filter((i) => i.category === c).slice(0, 1);
              const CatIcon = CATEGORY_ICON[c];
              const accent = ["var(--coral)", "var(--sky)", "var(--sun)"][i];
              return (
                <div key={c} className="aspect-[3/4] border hairline bg-bg flex flex-col items-center justify-center gap-2 tilt-card" style={!items[0] ? { borderStyle: "dashed" } : undefined}>
                  {items[0] ? <ItemVisual item={items[0]} className="w-full h-full" /> : (
                    <>
                      <CatIcon className="w-8 h-8" strokeWidth={1} style={{ color: accent }} />
                      <span className="text-[10px] text-faint">{c}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================== CLOSET ============================== */
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-soft mb-1.5">{label}</span>
      {children}
    </label>
  );
}
const selectCls = "w-full border hairline-strong px-3 py-2.5 text-sm bg-bg focus:border-maroon";
const inputCls = "w-full border hairline-strong px-3 py-2.5 text-sm bg-bg focus:border-maroon";

function AddItemModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    name: "", category: "Tops", color: "Black", pattern: "Solid",
    style: [], season: ["All-season"], fit: "Regular", formality: 3, warmth: 2, image: null,
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [aiHint, setAiHint] = useState(null); // { category, confidence, colors: [{name,hex,percent}] } | { failed: true } | null
  const fileRef = useRef(null);

  const toggleArr = (field, val) => {
    setForm((f) => {
      const has = f[field].includes(val);
      return { ...f, [field]: has ? f[field].filter((x) => x !== val) : [...f[field], val] };
    });
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setForm((f) => ({ ...f, image: dataUrl }));
      setAiHint(null);
      setAnalyzing(true);
      // Auto-tag the photo: local PyTorch category classifier + OpenCV/KMeans dominant colors
      // (see backend/vision_engine.py). Best-effort only — if the backend is unreachable we
      // just leave the category/color fields as they were, no disruptive error.
      try {
        const [classified, colorResult] = await Promise.all([
          apiRequest("/api/vision/classify", { method: "POST", body: JSON.stringify({ image: dataUrl }) }),
          apiRequest("/api/vision/colors", { method: "POST", body: JSON.stringify({ image: dataUrl }) }),
        ]);
        const topColor = colorResult.colors && colorResult.colors[0];
        setForm((f) => ({
          ...f,
          category: CATEGORIES.includes(classified.category) ? classified.category : f.category,
          color: topColor && COLORS.includes(topColor.name) ? topColor.name : f.color,
        }));
        setAiHint({ category: classified.category, confidence: classified.confidence, colors: colorResult.colors || [] });
      } catch (err) {
        setAiHint({ failed: true });
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const canSave = form.name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="relative bg-bg w-full md:max-w-xl md:mx-4 max-h-[92vh] overflow-y-auto border hairline-strong">
        <div className="sticky top-0 bg-bg border-b hairline px-6 py-4 flex items-center justify-between">
          <h3 className="font-display text-lg">{initial ? "Edit item" : "Add to closet"}</h3>
          <button onClick={onClose}><IconClose className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex gap-4 items-start">
            <div className="relative w-24 h-28 border hairline flex items-center justify-center shrink-0 overflow-hidden" style={{ background: colorToHex(form.color) + "1f" }}>
              {form.image ? <img src={form.image} className="w-full h-full object-cover" /> : React.createElement(CATEGORY_ICON[form.category], { className: "w-8 h-8", strokeWidth: 1.1, style: { color: colorToHex(form.color) } })}
              {analyzing && (
                <div className="absolute inset-0 bg-ink/55 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-bg/40 border-t-bg rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <button onClick={() => fileRef.current && fileRef.current.click()} className="inline-flex items-center gap-2 border hairline-strong px-4 py-2 text-sm hover:border-maroon">
                <IconUpload className="w-4 h-4" /> Upload photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              <p className="text-xs text-faint mt-2">Optional — without one we'll show a clean placeholder in your item's color.</p>
              {analyzing && <p className="text-xs text-maroon mt-2 flex items-center gap-1.5"><IconSparkle className="w-3.5 h-3.5" strokeWidth={1.3} /> Reading the photo — detecting category &amp; color&hellip;</p>}
              {aiHint && !aiHint.failed && (
               <div className="mt-2.5">
  {/* Added items-start, leading-relaxed, and shrink-0 on the icon */}
  <p className="text-xs text-maroon flex items-start gap-1.5 leading-relaxed">
    <IconSparkle className="w-3.5 h-3.5 shrink-0 mt-0.5" strokeWidth={1.3} />
    <span>
      AI detected <strong className="font-medium">{aiHint.category}</strong> &middot; {Math.round(aiHint.confidence * 100)}% confident — fields below are filled in, change anything that's off.
    </span>
  </p>

  {aiHint.colors.length > 0 && (
    <div className="flex items-center gap-1.5 mt-2">
      <span className="text-xs text-faint mr-0.5 shrink-0">Detected colors:</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {aiHint.colors.map((c, i) => (
          <button
            key={i}
            type="button"
            title={`${c.name} — ${c.percent}%`}
            onClick={() => COLORS.includes(c.name) && setForm((f) => ({ ...f, color: c.name }))}
            className="w-5 h-5 rounded-full border hairline-strong shrink-0"
            style={{ background: c.hex }}
          />
        ))}
      </div>
    </div>
  )}
</div>
              )}
              {aiHint && aiHint.failed && <p className="text-xs text-faint mt-2">Couldn't auto-detect this time — set category and color manually below.</p>}
            </div>
          </div>

          <Field label="Item name">
            <input className={inputCls} placeholder="e.g. White Poplin Shirt" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select className={selectCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Color">
              <select className={selectCls} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
                {COLORS.filter((c) => c !== "Any").map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Pattern">
              <select className={selectCls} value={form.pattern} onChange={(e) => setForm({ ...form, pattern: e.target.value })}>
                {PATTERNS.filter((c) => c !== "Any").map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Fit">
              <select className={selectCls} value={form.fit} onChange={(e) => setForm({ ...form, fit: e.target.value })}>
                {FITS.filter((c) => c !== "Any").map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Style — pick what fits (used to match your mood)">
            <div className="flex flex-wrap gap-2">
              {STYLES.filter((s) => s !== "Any").map((s) => (
                <Chip key={s} active={form.style.includes(s)} onClick={() => toggleArr("style", s)}>{s}</Chip>
              ))}
            </div>
          </Field>

          <Field label="Season">
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <Chip key={s} active={form.season.includes(s)} onClick={() => toggleArr("season", s)}>{s}</Chip>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={`Formality (${form.formality}/5)`}>
              <input type="range" min="1" max="5" value={form.formality} onChange={(e) => setForm({ ...form, formality: Number(e.target.value) })} className="w-full accent-maroon" />
            </Field>
            <Field label={`Warmth (${form.warmth}/5)`}>
              <input type="range" min="0" max="5" value={form.warmth} onChange={(e) => setForm({ ...form, warmth: Number(e.target.value) })} className="w-full accent-maroon" />
            </Field>
          </div>
        </div>
        <div className="sticky bottom-0 bg-bg border-t hairline px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm text-soft hover:text-ink">Cancel</button>
          <button
            disabled={!canSave}
            onClick={() => canSave && onSave({ ...form, id: form.id || uid(), tags: form.tags || [] })}
            className="bg-ink text-bg px-6 py-2.5 text-sm disabled:opacity-40 hover:bg-maroon transition-colors"
          >
            {initial ? "Save changes" : "Add item"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ClosetPage({ closet, setCloset }) {
  const [activeCat, setActiveCat] = useState("All");
  const [modal, setModal] = useState(null); // null | 'new' | item
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = activeCat === "All" ? closet : closet.filter((i) => i.category === activeCat);

  const saveItem = (item) => {
    setCloset((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      return exists ? prev.map((p) => (p.id === item.id ? item : p)) : [item, ...prev];
    });
    setModal(null);
  };

  const removeItem = (id) => {
    setCloset((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-display text-xs tracking-wide text-maroon mb-2">My Closet</p>
          <h1 className="font-display text-3xl md:text-4xl">Every piece you own<span className="italic text-maroon">.</span></h1>
        </div>
        <button onClick={() => setModal("new")} className="inline-flex items-center gap-2 bg-ink text-bg px-5 py-3 text-sm hover:bg-maroon transition-colors">
          <IconPlus className="w-4 h-4" /> Add item
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 wrap-container">
        <Chip active={activeCat === "All"} onClick={() => setActiveCat("All")}>All ({closet.length})</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(c)}>
            {c} ({closet.filter((i) => i.category === c).length})
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="relative border hairline border-dashed py-24 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="blob-shape" style={{ width: 160, height: 160, top: "-40px", left: "-40px", background: "var(--sun)", opacity: 0.25 }} />
          <div className="blob-shape" style={{ width: 140, height: 140, bottom: "-40px", right: "-30px", background: "var(--sky)", opacity: 0.25 }} />
          <div className="relative swatch-badge mb-5" style={{ width: "3.5rem", height: "3.5rem", background: "color-mix(in srgb, var(--coral) 20%, transparent)" }}>
            <IconTop className="w-7 h-7" strokeWidth={1.1} style={{ color: "var(--coral)" }} />
          </div>
          <p className="relative text-soft mb-1">{activeCat === "All" ? "Your closet is empty — let's fix that." : "Nothing here yet. Add a piece to start building this category."}</p>
          <p className="relative text-xs text-faint mb-5 max-w-xs">Every outfit the stylist builds comes only from what you add here, so this is where it all starts.</p>
          <button onClick={() => setModal("new")} className="relative inline-flex items-center gap-2 bg-ink text-bg px-5 py-2.5 text-sm hover:bg-maroon transition-colors">
            <IconPlus className="w-4 h-4" /> Add your first item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="group border hairline hover:border-maroon transition-colors">
              <div className="relative">
                <ItemVisual item={item} className="w-full aspect-[3/4]" />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal(item)} className="bg-bg/90 border hairline w-7 h-7 flex items-center justify-center hover:border-maroon" aria-label="Edit">
                    <IconChevronDown className="w-3.5 h-3.5 rotate-[135deg]" />
                  </button>
                  <button onClick={() => setConfirmDelete(item.id)} className="bg-bg/90 border hairline w-7 h-7 flex items-center justify-center hover:border-maroon" aria-label="Delete">
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm leading-tight">{item.name}</p>
                <p className="text-xs text-faint mt-1">{item.color} · {item.pattern}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <AddItemModal
          initial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveItem}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-bg border hairline-strong p-6 max-w-sm w-full">
            <p className="text-sm mb-5">Remove this item from your closet? This can't be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm text-soft hover:text-ink">Cancel</button>
              <button onClick={() => removeItem(confirmDelete)} className="bg-maroon text-white px-5 py-2 text-sm hover:bg-maroon-deep">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== OUTFIT RESULT CARD ============================== */
function slotOrder(picks) {
  const order = [];
  if (picks.dress) order.push(["dress", "Dress", picks.dress]);
  else {
    if (picks.top) order.push(["top", "Top", picks.top]);
    if (picks.bottom) order.push(["bottom", "Bottom", picks.bottom]);
  }
  if (picks.shoes) order.push(["shoes", "Shoes", picks.shoes]);
  if (picks.jewelry) order.push(["jewelry", "Jewelry", picks.jewelry]);
  if (picks.bag) order.push(["bag", "Bag", picks.bag]);
  if (picks.accessory) order.push(["accessory", "Accessory", picks.accessory]);
  return order;
}

function OutfitCard({ outfit, closet, onRegenerateSlot, onTryAnother, onSave, onWear, saved }) {
  const slots = slotOrder(outfit.picks);
  return (
    <div className="border hairline-strong fade-in">
      <div className="border-b hairline px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="text-sm"><span className="text-faint">Mood</span> &nbsp;{outfit.mood || "Open"}</span>
        <span className="text-sm"><span className="text-faint">Occasion</span> &nbsp;{outfit.occasion || "Any"}</span>
        <span className="ml-auto"><WeatherBadge weather={outfit.weather} compact /></span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[var(--border)]">
        {slots.map(([slotKey, label, item]) => (
          <div key={slotKey} className="bg-bg p-4 group relative">
            <ItemVisual item={item} className="w-full aspect-[3/4] mb-3" />
            <p className="text-xs text-faint mb-0.5">{label}</p>
            <p className="text-sm leading-tight pr-6">{item ? item.name : "—"}</p>
            <button
              onClick={() => onRegenerateSlot(slotKey)}
              className="absolute top-6 right-6 w-7 h-7 flex items-center justify-center border hairline bg-bg hover:border-maroon hover:text-maroon opacity-0 group-hover:opacity-100 transition-opacity"
              title={`Change ${label.toLowerCase()}`}
            >
              <IconSwap className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="px-6 py-5 border-t hairline">
        <p className="font-display text-xs tracking-wide text-maroon mb-2">Why this works</p>
        <p className="text-sm text-soft leading-relaxed">{outfit.why}</p>
      </div>

      <div className="px-6 py-5 border-t hairline flex flex-wrap gap-3">
        <button onClick={onWear} className="bg-ink text-bg px-5 py-2.5 text-sm hover:bg-maroon transition-colors">Wear This</button>
        <button onClick={onTryAnother} className="border hairline-strong px-5 py-2.5 text-sm hover:border-maroon hover:text-maroon inline-flex items-center gap-2">
          <IconRefresh className="w-4 h-4" /> Try Another
        </button>
        <button onClick={() => onRegenerateSlot(null)} className="border hairline-strong px-5 py-2.5 text-sm hover:border-maroon hover:text-maroon">Change One Item</button>
        <button onClick={onSave} className="ml-auto border hairline-strong px-5 py-2.5 text-sm hover:border-maroon hover:text-maroon inline-flex items-center gap-2">
          <IconHeart className={`w-4 h-4 ${saved ? "text-maroon" : ""}`} strokeWidth={saved ? 0 : 1.4} style={saved ? { fill: "var(--maroon)" } : {}} />
          {saved ? "Saved" : "Save Outfit"}
        </button>
      </div>
    </div>
  );
}

/* ============================== TODAY'S OUTFIT ============================== */
function OutfitPage({ closet, profile, savedOutfits, setSavedOutfits, toast }) {
  const [step, setStep] = useState(closet.length < 5 ? "empty" : "mood");
  const [mood, setMood] = useState(null);
  const [occasion, setOccasion] = useState(null);
  const [filters, setFilters] = useState({ clothing: "Any", color: "Any", pattern: "Any", style: "Any", fit: "Any" });
  const [showFilters, setShowFilters] = useState(false);
  const [outfit, setOutfit] = useState(null);
  const [wornMsg, setWornMsg] = useState(false);
  const weather = useMemo(() => WeatherService.getForecast(profile.city, new Date()), [profile.city]);

  const generate = () => {
    const result = StylistEngine.generate(closet, { mood, occasion, weather, filters });
    setOutfit(result);
    setStep("result");
  };

  const isSaved = outfit && savedOutfits.some((o) => o.picks && JSON.stringify(o.picks) === JSON.stringify(outfit.picks));

  const regenerateSlot = (slotKey) => {
    if (!outfit) return;
    if (slotKey === null) {
      const slots = slotOrder(outfit.picks).map((s) => s[0]);
      const random = slots[Math.floor(Math.random() * slots.length)];
      setOutfit(StylistEngine.regenerateSlot(outfit, random, closet));
    } else {
      setOutfit(StylistEngine.regenerateSlot(outfit, slotKey, closet));
    }
  };

  const tryAnother = () => setOutfit(StylistEngine.generate(closet, { mood, occasion, weather, filters }));

  const saveOutfit = () => {
    if (!outfit) return;
    setSavedOutfits((prev) => [outfit, ...prev]);
    toast("Outfit saved to your Profile");
  };

  const wearOutfit = () => {
    setWornMsg(true);
    setTimeout(() => setWornMsg(false), 2600);
  };

  if (step === "empty") {
    return (
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-20 text-center">
        <IconDress className="w-12 h-12 text-maroon mx-auto mb-5" strokeWidth={0.9} />
        <h1 className="font-display text-3xl mb-3">Add a few pieces first<span className="italic text-maroon">.</span></h1>
        <p className="text-soft mb-8">We build every outfit from your actual closet — add at least a handful of items so today's look has something to work with.</p>
        <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("ps-nav", { detail: "closet" })); }} className="bg-ink text-bg px-6 py-3 text-sm hover:bg-maroon transition-colors">
          Go to My Closet
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <p className="font-display text-xs tracking-wide text-maroon mb-2">Today's Outfit</p>
      <h1 className="font-display text-3xl md:text-4xl mb-8">Let's get you dressed<span className="italic text-maroon">.</span></h1>

      {step !== "result" && (
        <div className="mb-8 flex items-center gap-4 text-xs text-faint">
          <WeatherBadge weather={weather} />
          <span>Forecast auto-applied to your outfit</span>
        </div>
      )}

      {step === "mood" && (
        <div className="fade-in">
          <SectionLabel>Step 1 — What's your mood?</SectionLabel>
          <div className="flex flex-wrap gap-2.5 mb-6">
            {MOODS.map((m) => (
              <Chip key={m.id} active={mood === m.id} onClick={() => setMood(m.id)} color={MOOD_COLOR[m.id]}>{m.id}</Chip>
            ))}
          </div>
          <p className="text-xs text-faint mb-2.5">Not sure? Try one of these instead —</p>
          <div className="flex flex-wrap gap-2.5 mb-9">
            {MOOD_HELP.map((h) => (
              <Chip key={h} active={false} onClick={() => setMood(MOOD_HELP_MAP[h] || MOODS[Math.floor(Math.random() * MOODS.length)].id)}>
                {h}
              </Chip>
            ))}
          </div>
          <button disabled={!mood} onClick={() => setStep("occasion")} className="bg-ink text-bg px-6 py-3 text-sm disabled:opacity-30 hover:bg-maroon transition-colors">
            Continue
          </button>
        </div>
      )}

      {step === "occasion" && (
        <div className="fade-in">
          <SectionLabel>Step 2 — What's the occasion?</SectionLabel>
          <div className="flex flex-wrap gap-2.5 mb-9">
            {OCCASIONS.map((o) => (
              <Chip key={o.id} active={occasion === o.id} onClick={() => setOccasion(o.id)}>{o.id}</Chip>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("mood")} className="border hairline-strong px-6 py-3 text-sm hover:border-maroon">Back</button>
            <button disabled={!occasion} onClick={() => setStep("filters")} className="bg-ink text-bg px-6 py-3 text-sm disabled:opacity-30 hover:bg-maroon transition-colors">Continue</button>
          </div>
        </div>
      )}

      {step === "filters" && (
        <div className="fade-in">
          <SectionLabel>Step 3 — Refine it (optional)</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-5 mb-9 max-w-xl">
            {[
              ["clothing", "Clothing", CLOTHING_TYPES],
              ["color", "Color", COLORS],
              ["pattern", "Pattern", PATTERNS],
              ["style", "Style", STYLES],
              ["fit", "Fit", FITS],
            ].map(([key, label, opts]) => (
              <Field key={key} label={label}>
                <select className={selectCls} value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("occasion")} className="border hairline-strong px-6 py-3 text-sm hover:border-maroon">Back</button>
            <button onClick={generate} className="bg-ink text-bg px-6 py-3 text-sm hover:bg-maroon transition-colors">Style me</button>
          </div>
        </div>
      )}

      {step === "result" && outfit && (
        <div>
          {wornMsg && (
            <div className="mb-5 border border-maroon bg-maroon/5 px-5 py-3 text-sm flex items-center gap-2 fade-in">
              <IconCheck className="w-4 h-4 text-maroon" /> Marked as worn today. Hope it's a good one.
            </div>
          )}
          <OutfitCard
            outfit={outfit}
            closet={closet}
            onRegenerateSlot={regenerateSlot}
            onTryAnother={tryAnother}
            onSave={saveOutfit}
            onWear={wearOutfit}
            saved={isSaved}
          />
          <button onClick={() => { setStep("mood"); setOutfit(null); }} className="mt-6 text-sm text-soft hover:text-maroon">
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================== STYLE CHAT ============================== */
const SLOT_KEYWORDS = {
  shoes: ["shoe", "shoes", "sneaker", "sneakers", "heel", "heels", "boot", "boots", "sandal", "sandals", "flats"],
  top: ["top", "shirt", "blouse", "sweater", "tee", "tshirt", "t-shirt", "blazer"],
  bottom: ["bottom", "pant", "pants", "jean", "jeans", "trouser", "trousers", "skirt", "shorts"],
  dress: ["dress"],
  jewelry: ["jewelry", "jewellery", "earring", "earrings", "necklace", "bracelet"],
  bag: ["bag", "bags", "purse", "tote", "clutch"],
  accessory: ["accessory", "accessories", "scarf", "belt", "sunglasses", "hat", "beanie"],
};
const MOOD_KEYWORDS = Object.fromEntries(MOODS.map((m) => [m.id, [m.id.toLowerCase(), ...m.tags]]));
const OCC_KEYWORDS = Object.fromEntries(OCCASIONS.map((o) => [o.id, [o.id.toLowerCase()]]));
const CLOSING_PATTERN = /\b(bye|goodbye|good ?night|thanks?( you)?|that'?s all|that'?s it|done for (the day|now|today)|i'?m done|im done|nothing else|all set|no more( for)? now|see you|that'?ll be all|i'?m good|im good|catch you later)\b/i;
const GREETING_PATTERN = /\b(hi|hello|hey|yo|sup|good morning|good afternoon|good evening)\b/i;
const GREETING_REPLIES = [
  "Hey! Good to see you. What's the vibe today?",
  "Hi there — ready to put a look together?",
  "Hello! Tell me the mood you're going for and I'll take it from here.",
  "Hey hey. What are we dressing you for today?",
  "Hi! I've got your closet loaded up — give me a mood whenever you're ready.",
];
// A small knowledge base so the chat can field general style questions, not just mood/occasion —
// each entry has a few phrasings so the same question doesn't get the exact same reply twice in a row.
const KNOWLEDGE_BASE = [
  { pattern: /\brain|monsoon|wet\b/i, replies: [
    "For rain, I'd lean into waterproof or water-resistant pieces and darker colors that hide splashes — avoid suede and light fabrics that show water spots. Want me to build a rainy-day look?",
    "Monsoon rule of thumb: darker colors, nothing suede, and something you don't mind getting a little wet. Want a rain-ready outfit?",
  ] },
  { pattern: /\bcold|winter|freezing|chilly\b/i, replies: [
    "Layering is the move in the cold — a base layer, a warm mid layer like a sweater, and a structured outer piece. I'll bump up warmth automatically once you give me a mood and occasion.",
    "When it's cold, think in layers rather than one big warm piece — easier to adjust through the day. I'll factor the temperature in once you pick a mood.",
  ] },
  { pattern: /\bhot|summer|humid\b/i, replies: [
    "In the heat, breathable fabrics and lighter colors keep you cooler — linen, cotton, loose fits. I'll filter toward your lightest pieces automatically.",
    "Heat calls for airflow — loose fits, natural fabrics, lighter colors. I'll steer toward your breeziest pieces once we pick a look.",
  ] },
  { pattern: /\bcolor|colour(s)? (go|match|pair)/i, replies: [
    "As a rule of thumb: neutrals (black, white, beige, navy) pair with almost anything, and one bold color per outfit usually reads best. Want me to build something around a specific color?",
    "Easiest color trick: pick one hero color and keep everything else neutral around it. Tell me the color and I'll work with it.",
  ] },
  { pattern: /\bwho are you\b|\bare you (a )?(real )?ai\b|\bare you human\b/i, replies: [
    "I'm your in-app stylist — I read your closet, your mood, and today's weather to put outfits together. No generic suggestions, just what's actually in your wardrobe.",
    "Think of me as the stylist that only works with what's already in your closet — no shopping-list suggestions, ever.",
  ] },
  { pattern: /\bthank(s| you)\b/i, replies: ["Anytime! That's what I'm here for.", "Of course — happy to help.", "You got it. Come back whenever you need another look."] },
  { pattern: /\bhelp\b|\bwhat can you do\b/i, replies: [
    "Give me a mood (like Confident or Chill) and an occasion (like Work or Date) and I'll build a full outfit from your closet. Once you have a look, just say things like \"change the shoes\" and I'll swap just that piece.",
    "Two things get you an outfit fast: a mood and an occasion. After that, ask me to swap any single piece and I'll rework just that slot.",
  ] },
  { pattern: /\bformal|fancy|dress up|black tie\b/i, replies: [
    "For anything formal, I'll reach for your most tailored, highest-formality pieces and keep the palette simple — think one statement item, not five. Tell me the occasion and I'll pull it together.",
    "Formal is mostly about restraint — one standout piece, everything else quiet and tailored. Give me the occasion and I'll build it.",
  ] },
  { pattern: /\blayer|layering\b/i, replies: ["Good layering starts thin-to-thick: a light base, a mid layer with some structure, then one outer piece that can come off. Want me to build a layered look?"] },
  { pattern: /\bpattern|print|mix(ing)? pattern/i, replies: ["Mixing patterns works best when they share a color and differ in scale — a small check with a big stripe, say. When in doubt, keep one piece solid."] },
];
function findKnowledgeReply(text) {
  const hit = KNOWLEDGE_BASE.find((k) => k.pattern.test(text));
  return hit ? hit.replies[Math.floor(Math.random() * hit.replies.length)] : null;
}
const CLOSING_REPLIES = [
  "Glad I could help — enjoy your day! I'll be right here whenever you want to plan the next look.",
  "Sounds good. Come back anytime you need styling — have a great one!",
  "Noted, signing off for now. Your outfit's saved in the chat above if you want it later.",
  "Perfect, go be stylish. See you next time!",
  "Anytime! I'll keep your closet warmed up for next time.",
];
function isClosingText(text) {
  return CLOSING_PATTERN.test(text.trim());
}

function findSlotInText(text) {
  const t = text.toLowerCase();
  for (const [slot, words] of Object.entries(SLOT_KEYWORDS)) {
    if (words.some((w) => t.includes(w))) return slot;
  }
  return null;
}
function findMoodInText(text) {
  const t = text.toLowerCase();
  for (const [mood, words] of Object.entries(MOOD_KEYWORDS)) {
    if (words.some((w) => t.includes(w))) return mood;
  }
  return null;
}
function findOccasionInText(text) {
  const t = text.toLowerCase();
  for (const [occ, words] of Object.entries(OCC_KEYWORDS)) {
    if (words.some((w) => t.includes(w))) return occ;
  }
  return null;
}

function outfitSummaryLine(picks) {
  const parts = [];
  if (picks.dress) parts.push(`your ${picks.dress.name.toLowerCase()}`);
  else {
    if (picks.top) parts.push(`your ${picks.top.name.toLowerCase()}`);
    if (picks.bottom) parts.push(picks.bottom.name.toLowerCase());
  }
  if (picks.shoes) parts.push(picks.shoes.name.toLowerCase());
  if (picks.jewelry) parts.push(picks.jewelry.name.toLowerCase());
  if (picks.bag) parts.push(picks.bag.name.toLowerCase());
  if (picks.accessory) parts.push(picks.accessory.name.toLowerCase());
  if (parts.length === 0) return "I couldn't find enough pieces in your closet for this yet.";
  return `Try ${parts.join(" + ")}.`;
}

function MiniOutfitStrip({ picks }) {
  const slots = slotOrder(picks);
  return (
    <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar wrap-container">
      {slots.map(([key, label, item]) => (
        <div key={key} className="shrink-0 w-16">
          <ItemVisual item={item} className="w-16 h-20" />
          <p className="text-[10px] text-faint mt-1 leading-tight truncate">{label}</p>
        </div>
      ))}
    </div>
  );
}

function ChatBubble({ msg, onQuickReply, closet }) {
  const isBot = msg.from === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] md:max-w-[70%] ${isBot ? "" : "text-right"}`}>
        <div className={`px-4 py-3 text-sm leading-relaxed ${isBot ? "bg-surface border hairline" : "bg-ink text-bg"}`}>
          {msg.text}
          {msg.outfit && <MiniOutfitStrip picks={msg.outfit.picks} />}
        </div>
        {msg.quickReplies && (
          <div className="flex flex-wrap gap-2 mt-2.5 justify-start">
            {msg.quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => onQuickReply(qr)}
                className="chip px-3.5 py-1.5 text-xs rounded-full text-ink hover:text-white transition-colors"
                style={MOOD_COLOR[qr] ? { "--hover-color": MOOD_COLOR[qr] } : undefined}
                onMouseEnter={(e) => { if (MOOD_COLOR[qr]) { e.currentTarget.style.background = MOOD_COLOR[qr]; e.currentTarget.style.borderColor = MOOD_COLOR[qr]; } }}
                onMouseLeave={(e) => { if (MOOD_COLOR[qr]) { e.currentTarget.style.background = ""; e.currentTarget.style.borderColor = ""; } }}
              >
                {qr}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== CANVAS (drag-and-drop outfit board) ============================== */
const CATEGORY_TO_SLOT = { Tops: "top", Bottoms: "bottom", Dresses: "dress", Shoes: "shoes", Jewelry: "jewelry", Bags: "bag", Accessories: "accessory" };

function CanvasPage({ closet, savedOutfits, setSavedOutfits, toast }) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const [placed, setPlaced] = useLocalState("ps_canvas_v1", []); // [{ uid, itemId, x, y }]
  const canvasRef = useRef(null);
  const dragItemId = useRef(null);
  const dragExistingUid = useRef(null);

  const itemsByCategory = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((c) => { map[c] = closet.filter((i) => i.category === c); });
    return map;
  }, [closet]);
  const findItem = (id) => closet.find((i) => i.id === id);

  const dropAt = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left - 44, 4), Math.max(rect.width - 92, 4));
    const y = Math.min(Math.max(clientY - rect.top - 54, 4), Math.max(rect.height - 108, 4));
    if (dragExistingUid.current) {
      const movedUid = dragExistingUid.current;
      setPlaced((prev) => prev.map((p) => (p.uid === movedUid ? { ...p, x, y } : p)));
      dragExistingUid.current = null;
      return;
    }
    if (dragItemId.current) {
      setPlaced((prev) => [...prev, { uid: uid("cv"), itemId: dragItemId.current, x, y }]);
      dragItemId.current = null;
    }
  };

  const onDropCanvas = (e) => { e.preventDefault(); dropAt(e.clientX, e.clientY); };
  const removePlaced = (uidv) => setPlaced((prev) => prev.filter((p) => p.uid !== uidv));
  const clearBoard = () => setPlaced([]);

  const saveBoard = () => {
    if (placed.length === 0) { toast("Drag a few pieces onto the board first."); return; }
    const picks = {};
    placed.forEach((p) => {
      const item = findItem(p.itemId);
      if (!item) return;
      const slot = CATEGORY_TO_SLOT[item.category];
      if (slot) picks[slot] = item;
    });
    const entry = { id: uid("board"), mood: "Custom", occasion: "Your build", picks, why: "Built by hand on the style canvas — every piece chosen by you." };
    setSavedOutfits((prev) => [entry, ...prev]);
    toast("Saved to your outfits.");
  };

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <p className="font-display text-xs tracking-wide text-maroon mb-2">Canvas</p>
      <h1 className="font-display text-3xl md:text-4xl mb-3">Build it yourself<span className="italic text-maroon">.</span></h1>
      <p className="text-sm text-soft max-w-xl mb-8">Drag pieces from your closet onto the board below and arrange a look exactly how you picture it — reposition anything, remove what doesn't work.</p>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6 md:gap-8">
        <div>
          <div className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar lg:overflow-visible mb-4 lg:mb-0 lg:border-l lg:hairline">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`text-left px-3 py-2 text-sm whitespace-nowrap border-b lg:border-b-0 lg:border-l-2 lg:-ml-px transition-colors ${activeCat === c ? "text-maroon border-maroon" : "text-soft border-transparent hover:text-ink"}`}
              >
                {c} <span className="text-faint text-xs">({itemsByCategory[c].length})</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 mt-4 lg:mt-6">
            {itemsByCategory[activeCat].length === 0 && <p className="text-xs text-faint col-span-full">No pieces in this category yet — add some in My Closet.</p>}
            {itemsByCategory[activeCat].map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => { dragItemId.current = item.id; dragExistingUid.current = null; }}
                onDragEnd={() => { dragItemId.current = null; }}
                className="canvas-item cursor-grab"
                title="Drag onto the board"
              >
                <ItemVisual item={item} className="w-full aspect-[3/4]" />
                <p className="text-[10px] text-faint mt-1 truncate">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            ref={canvasRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropCanvas}
            className="relative border-2 border-dashed hairline-strong bg-surface canvas-grid min-h-[420px] md:min-h-[560px]"
          >
            {placed.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6 text-center">
                <p className="text-sm text-faint">Drag pieces here from the left to start building your look</p>
              </div>
            )}
            {placed.map((p) => {
              const item = findItem(p.itemId);
              if (!item) return null;
              return (
                <div
                  key={p.uid}
                  draggable
                  onDragStart={() => { dragExistingUid.current = p.uid; dragItemId.current = null; }}
                  onDragEnd={() => { dragExistingUid.current = null; }}
                  style={{ left: p.x, top: p.y, width: 88 }}
                  className="canvas-item absolute group"
                >
                  <ItemVisual item={item} className="w-full aspect-[3/4] border hairline bg-bg" />
                  <button
                    onClick={() => removePlaced(p.uid)}
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-ink text-bg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove"
                  >
                    <IconClose className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={saveBoard} className="bg-ink text-bg px-5 py-2.5 text-sm hover:bg-maroon transition-colors">Save This Look</button>
            <button onClick={clearBoard} className="border hairline-strong px-5 py-2.5 text-sm hover:border-maroon hover:text-maroon">Clear Board</button>
            <span className="text-xs text-faint self-center ml-auto">{placed.length} piece{placed.length === 1 ? "" : "s"} placed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPage({ closet, profile }) {
  const weather = useMemo(() => WeatherService.getForecast(profile.city, new Date()), [profile.city]);
  const [messages, setMessages] = useState(() => ([
    { id: uid("m"), from: "bot", text: "Hi — I'm your stylist. What's the vibe today?", quickReplies: MOODS.slice(0, 6).map((m) => m.id) },
  ]));
  const [ctx, setCtx] = useState({ mood: null, occasion: null });
  const [stage, setStage] = useState("mood"); // mood -> occasion -> ready
  const [input, setInput] = useState("");
  const [lastOutfit, setLastOutfit] = useState(null);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current && endRef.current.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const pushBot = (text, extra = {}) => setMessages((m) => [...m, { id: uid("m"), from: "bot", text, ...extra }]);
  const pushUser = (text) => setMessages((m) => [...m, { id: uid("m"), from: "user", text }]);

  // Shows a brief "typing…" beat before the bot's reply lands — reads far more like a live conversation
  // than messages popping in instantly. Delay scales a little with reply length, plus jitter.
  const botSay = (text, extra = {}, delay) => {
    const thinkTime = delay ?? Math.min(1400, 450 + text.length * 9 + Math.random() * 250);
    setTyping(true);
    setTimeout(() => { setTyping(false); pushBot(text, extra); }, thinkTime);
  };

  const weatherLine = () => `It's about ${weather.tempC}°C and ${weather.condition.toLowerCase()} in ${weather.city} — I'll factor that in.`;

  const generateAndAnnounce = (mood, occasion) => {
    const outfit = StylistEngine.generate(closet, { mood, occasion, weather, filters: { clothing: "Any", color: "Any", pattern: "Any", style: "Any", fit: "Any" } });
    setLastOutfit(outfit);
    botSay(outfitSummaryLine(outfit.picks), { outfit });
    setTimeout(() => botSay("Want to swap anything? Just say \"change the shoes\" or similar — or tell me a new mood or occasion."), 900);
  };

  const handleMood = (moodRaw) => {
    const mood = MOODS.some((m) => m.id === moodRaw) ? moodRaw : findMoodInText(moodRaw) || MOODS[Math.floor(Math.random() * MOODS.length)].id;
    pushUser(moodRaw);
    setCtx((c) => ({ ...c, mood }));
    botSay(weatherLine(), {}, 500);
    setTimeout(() => {
      botSay("Where are you headed?", { quickReplies: OCCASIONS.map((o) => o.id) });
      setStage("occasion");
    }, 950);
  };

  const handleOccasion = (occRaw) => {
    const occasion = OCCASIONS.some((o) => o.id === occRaw) ? occRaw : findOccasionInText(occRaw) || "Casual";
    pushUser(occRaw);
    setCtx((c) => {
      const next = { ...c, occasion };
      setTimeout(() => generateAndAnnounce(next.mood, next.occasion), 400);
      return next;
    });
    setStage("ready");
  };

  const handleFreeform = async (text) => {
    pushUser(text);
    if (isClosingText(text)) {
      botSay(CLOSING_REPLIES[Math.floor(Math.random() * CLOSING_REPLIES.length)]);
      return;
    }
    if (GREETING_PATTERN.test(text) && text.trim().split(/\s+/).length <= 4) {
      botSay(GREETING_REPLIES[Math.floor(Math.random() * GREETING_REPLIES.length)]);
      return;
    }
    const slot = findSlotInText(text);
    if (slot && lastOutfit) {
      const categoryPresent = lastOutfit.picks[slot] !== undefined;
      if (!categoryPresent && slot !== "dress" && slot !== "top" && slot !== "bottom") {
        botSay("That piece isn't part of today's outfit yet — want me to add one from your closet?");
        return;
      }
      setTimeout(() => {
        const updated = StylistEngine.regenerateSlot(lastOutfit, slot, closet);
        setLastOutfit(updated);
        botSay(`Updated — ${outfitSummaryLine(updated.picks)}`, { outfit: updated });
      }, 300);
      return;
    }
    const mood = findMoodInText(text);
    const occasion = findOccasionInText(text);
    if (mood || occasion) {
      const nextCtx = { mood: mood || ctx.mood, occasion: occasion || ctx.occasion };
      setCtx(nextCtx);
      setTimeout(() => generateAndAnnounce(nextCtx.mood, nextCtx.occasion), 300);
      return;
    }

    // Anything more open-ended goes to the backend, which uses a real LLM if the operator has
    // configured one, or a large randomized phrase bank otherwise — either way it beats a single
    // fixed line. If the API isn't reachable, fall back to the local knowledge base so chat still
    // works fully offline.
    setTyping(true);
    try {
      const data = await apiRequest("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8).map((m) => ({ role: m.from === "bot" ? "assistant" : "user", content: m.text })),
          mood: ctx.mood, occasion: ctx.occasion, closet_count: closet.length,
          city: weather.city, weather_temp: weather.tempC, weather_condition: weather.condition,
        }),
      });
      setTyping(false);
      pushBot(data.reply);
    } catch (err) {
      setTyping(false);
      const knowledgeReply = findKnowledgeReply(text);
      const generic = [
        "Got it. Tell me a mood, an occasion, or say \"change the [item]\" and I'll adjust today's look — or ask me about layering, rain, color pairing, and I'll share a quick tip.",
        closet.length ? `Noted. You've got ${closet.length} pieces in your closet ready to go — give me a mood and an occasion and I'll build something from them.` : "Noted. Add a few pieces to your closet and give me a mood and an occasion, and I'll build a full look from them.",
        "I hear you. Whenever you're ready, throw me a mood and an occasion — or ask me anything about styling for weather or color.",
      ];
      botSay(knowledgeReply || generic[Math.floor(Math.random() * generic.length)]);
    }
  };

  const onQuickReply = (val) => {
    if (stage === "mood") handleMood(val);
    else if (stage === "occasion") handleOccasion(val);
    else handleFreeform(val);
  };

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    if (isClosingText(text)) {
      pushUser(text);
      botSay(CLOSING_REPLIES[Math.floor(Math.random() * CLOSING_REPLIES.length)]);
      return;
    }
    if (stage === "mood") handleMood(text);
    else if (stage === "occasion") handleOccasion(text);
    else handleFreeform(text);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-8 md:py-10 flex flex-col" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <div className="mb-6">
        <p className="font-display text-xs tracking-wide text-maroon mb-2">Style Chat</p>
        <h1 className="font-display text-2xl md:text-3xl">Talk it through<span className="italic text-maroon">.</span></h1>
      </div>
      <div className="flex-1 space-y-4 pb-6 overflow-y-auto no-scrollbar">
        {messages.map((m) => <ChatBubble key={m.id} msg={m} onQuickReply={onQuickReply} closet={closet} />)}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-surface border hairline px-4 py-3.5 inline-flex items-center gap-1.5"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="sticky bottom-0 bg-bg pt-3 border-t hairline flex items-center gap-2" style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={stage === "ready" ? "Try \"change the shoes\"…" : "Type your answer…"}
          className="flex-1 border hairline-strong px-4 py-3 text-sm focus:border-maroon"
        />
        <button onClick={onSend} className="w-11 h-11 flex items-center justify-center bg-ink text-bg hover:bg-maroon transition-colors shrink-0" aria-label="Send">
          <IconSend className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================== PROFILE ============================== */
function ProfilePage({ profile, setProfile, savedOutfits, setSavedOutfits, closet, theme, setTheme }) {
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);

  const save = () => setProfile({ ...profile, name, city });

  const removeSaved = (id) => setSavedOutfits((prev) => prev.filter((o) => o.id !== id));

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <p className="font-display text-xs tracking-wide text-maroon mb-2">Profile</p>
      <h1 className="font-display text-3xl md:text-4xl mb-10">Your details<span className="italic text-maroon">.</span></h1>

      <div className="grid md:grid-cols-2 gap-10 mb-14">
        <div className="space-y-5">
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </Field>
          <Field label="Location — used for weather-matched styling">
            <div className="relative">
              <IconMapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
              <input className={inputCls + " pl-9"} value={city} onChange={(e) => setCity(e.target.value)} placeholder="City, country" />
            </div>
          </Field>
          <button onClick={save} className="bg-ink text-bg px-5 py-2.5 text-sm hover:bg-maroon transition-colors">Save</button>
        </div>

        <div>
          <SectionLabel>Appearance</SectionLabel>
          <div className="flex gap-2.5">
            {["light", "dark"].map((t) => (
              <Chip key={t} active={theme === t} onClick={() => setTheme(t)}>{t === "light" ? "Light" : "Dark"}</Chip>
            ))}
          </div>
          <div className="mt-8 border hairline p-5">
            <p className="text-sm text-soft leading-relaxed">
              Your closet currently holds <span className="text-ink">{closet.length}</span> pieces across {CATEGORIES.filter((c) => closet.some((i) => i.category === c)).length} categories.
            </p>
          </div>
        </div>
      </div>

      <SectionLabel>Saved outfits ({savedOutfits.length})</SectionLabel>
      {savedOutfits.length === 0 ? (
        <div className="border hairline py-16 text-center">
          <p className="text-soft text-sm">Outfits you save from Today's Outfit will show up here.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedOutfits.map((o) => (
            <div key={o.id} className="border hairline p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-faint">{o.mood} · {o.occasion}</p>
                <button onClick={() => removeSaved(o.id)} className="text-faint hover:text-maroon"><IconTrash className="w-4 h-4" /></button>
              </div>
              <MiniOutfitStrip picks={o.picks} />
              <p className="text-xs text-soft mt-3 leading-relaxed line-clamp-3">{o.why}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== TOAST ============================== */
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ink text-bg px-5 py-3 text-sm fade-in flex items-center gap-2">
      <IconCheck className="w-4 h-4 text-maroon" /> {message}
    </div>
  );
}

const API_BASE = window.location.protocol === "file:" ? "http://127.0.0.1:8000" : "";
async function apiRequest(path, options = {}) {
  // Attach the session token (if we have one) so the backend can tie the request to the logged-in user.
  const token = (() => {
    try { return JSON.parse(localStorage.getItem("ps_user_v1") || "null")?.token || null; } catch (e) { return null; }
  })();
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) };
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || "The stylist service is unavailable.");
  return response.json();
}

function AuthModal({ mode, setMode, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await apiRequest(`/api/auth/${mode}`, { method: "POST", body: JSON.stringify(form) });
      onSuccess(data);
    } catch (err) { setError(err.message); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-5" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form onSubmit={submit} className="relative w-full max-w-md bg-bg border hairline p-7 md:p-9 fade-in overflow-hidden">
        <div className="blob-shape" style={{ width: 130, height: 130, top: "-50px", right: "-50px", background: mode === "login" ? "var(--sky)" : "var(--coral)", opacity: 0.3 }} />
        <div className="relative flex items-start justify-between mb-7"><div><p className="text-xs text-maroon mb-2">Your wardrobe, smarter ✦</p><h2 className="font-display text-3xl">{mode === "login" ? "Welcome back." : "Make it personal."}</h2></div><button type="button" onClick={onClose} aria-label="Close"><IconClose /></button></div>
        {mode === "register" && <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border-b hairline-strong py-2" placeholder="Your name" /></Field>}
        <div className="mt-4"><Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border-b hairline-strong py-2" placeholder="you@example.com" /></Field></div>
        <div className="mt-4"><Field label="Password"><input required type="password" minLength="4" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border-b hairline-strong py-2" placeholder="At least 4 characters" /></Field></div>
        {error && <p className="text-sm text-maroon mt-4">{error}</p>}
        <button className="w-full mt-7 bg-ink text-bg py-3 hover:bg-maroon transition-colors">{mode === "login" ? "Log in" : "Create account"}</button>
        <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="w-full mt-4 text-sm text-soft hover:text-maroon">{mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}</button>
      </form>
    </div>
  );
}

function OnboardingModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({ gender: "", birthday: "", city: profile.city || "", state: profile.state || "", style_preference: "Casual", style_goal: "" });
  const styles = ["Casual", "Formal", "Minimalist", "Streetwear", "Ethnic", "Vintage"];
  const submit = (event) => { event.preventDefault(); onSave({ ...form, age: form.birthday ? Math.floor((Date.now() - new Date(form.birthday).getTime()) / 31557600000) : null }); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-5 overflow-y-auto py-8">
      <form onSubmit={submit} className="relative w-full max-w-2xl bg-bg border hairline p-7 md:p-10 fade-in overflow-hidden">
        <div className="blob-shape" style={{ width: 160, height: 160, top: "-60px", right: "-60px", background: "var(--sun)", opacity: 0.35 }} />
        <div className="blob-shape" style={{ width: 110, height: 110, bottom: "-40px", left: "-30px", background: "var(--sky)", opacity: 0.3 }} />
        <div className="relative flex justify-between items-start mb-8"><div><p className="text-xs text-maroon mb-2">A quick style briefing ✦</p><h2 className="font-display text-3xl md:text-4xl">Let’s make it yours.</h2><p className="text-sm text-soft mt-2">A few details help the recommendation engine understand your point of view.</p></div><button type="button" onClick={onClose} aria-label="Close"><IconClose /></button></div>
        <div className="grid md:grid-cols-2 gap-5"><Field label="Gender"><select required value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full border-b hairline-strong py-2"><option value="">Select</option><option>Woman</option><option>Man</option><option>Non-binary</option><option>Prefer not to say</option></select></Field><Field label="Birthday"><input required type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} className="w-full border-b hairline-strong py-2" /></Field><Field label="City"><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border-b hairline-strong py-2" placeholder="Austin" /></Field><Field label="State / region"><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full border-b hairline-strong py-2" placeholder="Texas" /></Field></div>
        <div className="mt-7"><span className="block text-xs text-soft mb-3">Your style language</span><div className="flex flex-wrap gap-2">{styles.map((style) => <Chip key={style} active={form.style_preference === style} onClick={() => setForm({ ...form, style_preference: style })}>{style}</Chip>)}</div></div>
        <div className="mt-7"><Field label="Optional style goal"><textarea value={form.style_goal} onChange={(e) => setForm({ ...form, style_goal: e.target.value })} className="w-full border hairline-strong p-3 min-h-20" placeholder="e.g. feel more polished at work" /></Field></div>
        <button className="w-full mt-8 bg-ink text-bg py-3.5 hover:bg-maroon transition-colors">Build my style profile</button>
      </form>
    </div>
  );
}

/* ============================== APP ROOT ============================== */
function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {}
  }, [key, state]);
  return [state, setState];
}

/* Per-account closet: keyed by the logged-in user's email so a fresh signup always starts
   empty (no clothing photos until the user adds their own) and a returning user's closet
   loads back in exactly as they left it, every time they log in. */
function useUserCloset(user) {
  const [closet, setClosetState] = useState([]);
  const closetKey = user ? `ps_closet_v1_${user.email}` : null;

  useEffect(() => {
    if (!closetKey) { setClosetState([]); return; }
    try {
      const raw = localStorage.getItem(closetKey);
      setClosetState(raw ? JSON.parse(raw) : []); // new account → no key yet → empty closet, no seed photos
    } catch (e) { setClosetState([]); }
  }, [closetKey]);

  const setCloset = useCallback((next) => {
    setClosetState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      if (closetKey) { try { localStorage.setItem(closetKey, JSON.stringify(value)); } catch (e) {} }
      return value;
    });
  }, [closetKey]);

  return [closet, setCloset];
}

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useLocalState("ps_user_v1", null);
  const [closet, setCloset] = useUserCloset(user);
  const [savedOutfits, setSavedOutfits] = useLocalState("ps_saved_outfits_v1", []);
  const [profile, setProfile] = useLocalState("ps_profile_v1", { name: "", city: "Ahmedabad", state: "Gujarat" });
  const [theme, setTheme] = useLocalState("ps_theme_v1", "light");
  const [toastMsg, setToastMsg] = useState("");
  const [authMode, setAuthMode] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handler = (e) => setPage(e.detail);
    window.addEventListener("ps-nav", handler);
    return () => window.removeEventListener("ps-nav", handler);
  }, []);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2400);
  }, []);

  const weather = useMemo(() => WeatherService.getForecast(profile.city, new Date()), [profile.city]);

  useEffect(() => {
    if (!user || !profile.city || !profile.gender) { setAiRecommendations(null); return; }
    apiRequest("/api/recommendations", { method: "POST", body: JSON.stringify({ profile, weather }) })
      .then(setAiRecommendations)
      .catch(() => setAiRecommendations(null));
  }, [user, profile, weather]);

  const handleAuth = (data) => {
    // Keep the session token alongside the user so apiRequest can authenticate future calls.
    setUser({ ...data.user, token: data.token });
    setAuthMode(null);
    if (data.user.profile) setProfile({ ...data.user.profile, name: data.user.name });
    else setShowOnboarding(true);
  };
  const saveOnboarding = async (nextProfile) => {
    setProfile({ ...nextProfile, name: user?.name || profile.name });
    setUser({ ...user, profile: nextProfile });
    setShowOnboarding(false);
    try { await apiRequest("/api/profile", { method: "POST", body: JSON.stringify(nextProfile) }); toast("Your style profile is ready."); }
    catch (err) { toast("Saved locally. Connect the API to sync it."); }
  };
  const logout = () => { setUser(null); localStorage.removeItem("ps_user_v1"); setPage("home"); };

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const authed = !!user;

  return (
    <div>
      <NavBar
        page={page}
        setPage={setPage}
        user={user}
        authed={authed}
        onLogin={() => setAuthMode("login")}
        onSignup={() => setAuthMode("register")}
        onLogout={logout}
      />

      {!authed && <Landing onGetStarted={() => setAuthMode("register")} onLogin={() => setAuthMode("login")} />}

      {authed && (
        <>
          {page === "home" && <Home setPage={setPage} closet={closet} weather={weather} aiRecommendations={aiRecommendations} />}
          {page === "closet" && <ClosetPage closet={closet} setCloset={setCloset} />}
          {page === "outfit" && <OutfitPage closet={closet} profile={profile} savedOutfits={savedOutfits} setSavedOutfits={setSavedOutfits} toast={toast} />}
          {page === "canvas" && <CanvasPage closet={closet} savedOutfits={savedOutfits} setSavedOutfits={setSavedOutfits} toast={toast} />}
          {page === "chat" && <ChatPage closet={closet} profile={profile} />}
          {page === "profile" && (
            <ProfilePage profile={profile} setProfile={setProfile} savedOutfits={savedOutfits} setSavedOutfits={setSavedOutfits} closet={closet} theme={theme} setTheme={setTheme} />
          )}
        </>
      )}

      {authed && <Footer />}

      <Toast message={toastMsg} />
      {authMode && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setAuthMode(null)} onSuccess={handleAuth} />}
      {showOnboarding && <OnboardingModal profile={profile} onSave={saveOnboarding} onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
