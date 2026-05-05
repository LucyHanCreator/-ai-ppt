import type { PptOutline } from "@/lib/types";

export type StyleProfileKey =
  | "yoga"
  | "kids_education"
  | "real_estate"
  | "training"
  | "beauty"
  | "short_video"
  | "business"
  | "personal_ip";

export type StyleProfile = {
  shape: "rounded" | "playful" | "sharp" | "clean";
  spacing: "wide" | "loose" | "structured" | "balanced";
  fontWeight: "light" | "bold" | "medium" | "regular";
  imageStyle: string;
  colors?: "bright" | "dark_gold" | "soft" | "professional";
};

export const styleProfiles: Record<StyleProfileKey, StyleProfile> = {
  yoga: {
    shape: "rounded",
    spacing: "wide",
    fontWeight: "light",
    imageStyle: "soft natural calm wellness",
    colors: "soft"
  },
  kids_education: {
    shape: "playful",
    spacing: "loose",
    fontWeight: "bold",
    imageStyle: "cartoon bright happy children learning",
    colors: "bright"
  },
  real_estate: {
    shape: "sharp",
    spacing: "structured",
    fontWeight: "medium",
    imageStyle: "luxury real estate architecture premium",
    colors: "dark_gold"
  },
  training: {
    shape: "clean",
    spacing: "balanced",
    fontWeight: "regular",
    imageStyle: "professional training workshop",
    colors: "professional"
  },
  beauty: {
    shape: "rounded",
    spacing: "wide",
    fontWeight: "regular",
    imageStyle: "soft light skincare beauty salon",
    colors: "soft"
  },
  short_video: {
    shape: "clean",
    spacing: "balanced",
    fontWeight: "bold",
    imageStyle: "dynamic content creator neon social media",
    colors: "professional"
  },
  business: {
    shape: "sharp",
    spacing: "structured",
    fontWeight: "medium",
    imageStyle: "business meeting professional team",
    colors: "dark_gold"
  },
  personal_ip: {
    shape: "clean",
    spacing: "balanced",
    fontWeight: "medium",
    imageStyle: "personal branding founder portrait natural light",
    colors: "professional"
  }
};

function getCourseIndustry(outline: PptOutline) {
  const diagnosis = outline.expertDiagnosis;

  if (diagnosis && typeof diagnosis === "object" && "courseIndustry" in diagnosis) {
    return String(diagnosis.courseIndustry || "");
  }

  return "";
}

function getSelectedPreset(outline: PptOutline) {
  return outline.stylePreset && outline.stylePreset !== "auto" ? outline.stylePreset : "";
}

function containsAny(text: string, words: string[]) {
  return words.some((word) => text.toLowerCase().includes(word.toLowerCase()));
}

export function getStyleProfileKey(outline: PptOutline): StyleProfileKey {
  const selectedPreset = getSelectedPreset(outline);

  if (selectedPreset === "business") return "business";
  if (selectedPreset === "luxury") return "real_estate";
  if (selectedPreset === "wellness") return "yoga";
  if (selectedPreset === "dynamic") return "short_video";
  if (selectedPreset === "playful") return "kids_education";

  const industry = getCourseIndustry(outline);
  const text = [outline.title, outline.subtitle, outline.audience, outline.coreMessage]
    .filter(Boolean)
    .join(" ");

  if (containsAny(text, ["儿童", "少儿", "孩子", "小朋友", "kids", "children", "age<12", "age < 12"])) return "kids_education";
  if (containsAny(text, ["房地产", "房产", "楼盘", "置业", "real estate"])) return "real_estate";
  if (industry === "yoga_fitness") return "yoga";
  if (industry === "beauty") return "beauty";
  if (industry === "short_video") return "short_video";
  if (industry === "personal_ip") return "personal_ip";
  if (industry === "business_sales") return "business";
  return "training";
}

export function getStyleProfile(outline: PptOutline) {
  return styleProfiles[getStyleProfileKey(outline)];
}
