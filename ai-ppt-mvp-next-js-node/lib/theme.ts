import type { ColorPalette, PptOutline, StylePreset } from "@/lib/types";

export type Palette = {
  label: string;
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  highlight: string;
};

export type Theme = Palette & {
  text: string;
  imageStyle: string;
};

export const palettes: Record<Exclude<StylePreset, "auto">, Record<ColorPalette, Palette>> = {
  business: {
    navy_gold: palette("Navy Gold", "#F3F5F8", "#FDFDFB", "#0B1F3A", "#E8EDF5", "#D4AF37", "#111827", "#5B6676", "#D8DEE8", "#B8872D"),
    graphite_blue: palette("Graphite Blue", "#F4F6F9", "#FFFDFC", "#273142", "#DDE6F7", "#2F80ED", "#111827", "#5B6472", "#D7DDE7", "#00A6D6"),
    executive_grey: palette("Executive Grey", "#F3F4F6", "#FDFDFB", "#374151", "#E7EAEE", "#B88746", "#111827", "#6B7280", "#D9DEE7", "#4B5563"),
    black_white: palette("Black White", "#F4F4F2", "#FAFAF7", "#0A0A0A", "#E2E2DE", "#C9A227", "#111111", "#666666", "#D7D7D1", "#8C6A00"),
    deep_green: palette("Deep Green", "#F2F7F3", "#FBFFFC", "#0F3D2E", "#DBEADE", "#C07A32", "#12221A", "#607368", "#D4E5DA", "#2FA66A"),
    champagne_gold: emptyPalette("Champagne Gold"),
    cream_rose: emptyPalette("Cream Rose"),
    black_gold: emptyPalette("Black Gold"),
    pearl_white: emptyPalette("Pearl White"),
    mocha_brown: emptyPalette("Mocha Brown"),
    sage_green: emptyPalette("Sage Green"),
    soft_mint: emptyPalette("Soft Mint"),
    warm_beige: emptyPalette("Warm Beige"),
    natural_clay: emptyPalette("Natural Clay"),
    calm_blue: emptyPalette("Calm Blue"),
    electric_blue: emptyPalette("Electric Blue"),
    neon_purple: emptyPalette("Neon Purple"),
    dark_tech: emptyPalette("Dark Tech"),
    orange_energy: emptyPalette("Orange Energy"),
    cyber_green: emptyPalette("Cyber Green"),
    candy_pastel: emptyPalette("Candy Pastel"),
    kids_bright: emptyPalette("Kids Bright"),
    sky_yellow: emptyPalette("Sky Yellow"),
    peach_mint: emptyPalette("Peach Mint"),
    cartoon_blue: emptyPalette("Cartoon Blue")
  },
  luxury: {
    champagne_gold: palette("Champagne Gold", "#FBF6EA", "#FFFDF7", "#6E5434", "#F2E5D0", "#C89B3C", "#2B2418", "#7A6B55", "#E7D5B8", "#8A6A2A"),
    cream_rose: palette("Cream Rose", "#FFF4F1", "#FFFDFC", "#68413F", "#F2DCD6", "#B7797C", "#332625", "#7C6663", "#EBD0C9", "#C58C8E"),
    black_gold: palette("Black Gold", "#0F0D0A", "#1B1711", "#080706", "#2F2719", "#D4AF37", "#FFFFFF", "#D7C6A4", "#3A2F1D", "#F5E6B8"),
    pearl_white: palette("Pearl White", "#F7F3EA", "#FFFDF8", "#3B352B", "#EEE7DA", "#A88B4A", "#25211A", "#746C60", "#DED3C0", "#B99B54"),
    mocha_brown: palette("Mocha Brown", "#F4ECE3", "#FFFDF9", "#5A3E32", "#E7D3C3", "#A66A45", "#2A1C17", "#7D675C", "#DDC5B4", "#C48A55"),
    navy_gold: emptyPalette("Navy Gold"),
    graphite_blue: emptyPalette("Graphite Blue"),
    executive_grey: emptyPalette("Executive Grey"),
    black_white: emptyPalette("Black White"),
    deep_green: emptyPalette("Deep Green"),
    sage_green: emptyPalette("Sage Green"),
    soft_mint: emptyPalette("Soft Mint"),
    warm_beige: emptyPalette("Warm Beige"),
    natural_clay: emptyPalette("Natural Clay"),
    calm_blue: emptyPalette("Calm Blue"),
    electric_blue: emptyPalette("Electric Blue"),
    neon_purple: emptyPalette("Neon Purple"),
    dark_tech: emptyPalette("Dark Tech"),
    orange_energy: emptyPalette("Orange Energy"),
    cyber_green: emptyPalette("Cyber Green"),
    candy_pastel: emptyPalette("Candy Pastel"),
    kids_bright: emptyPalette("Kids Bright"),
    sky_yellow: emptyPalette("Sky Yellow"),
    peach_mint: emptyPalette("Peach Mint"),
    cartoon_blue: emptyPalette("Cartoon Blue")
  },
  wellness: {
    sage_green: palette("Sage Green", "#F3FAF5", "#FFFDFC", "#2F3E34", "#DDEEE3", "#7BAE7F", "#2F3E34", "#617267", "#CFE3D5", "#4F8F59"),
    soft_mint: palette("Soft Mint", "#F0FCF6", "#FFFDFC", "#243B31", "#DDF7EC", "#43A77C", "#243B31", "#5E756A", "#CBEFDF", "#2A8F68"),
    warm_beige: palette("Warm Beige", "#FBF4E8", "#FFFDF7", "#3A3025", "#F0E2CF", "#B68A52", "#3A3025", "#756758", "#E0CCB2", "#8F6A3F"),
    natural_clay: palette("Natural Clay", "#F7EFE8", "#FFFDF9", "#4C3328", "#EAD8CA", "#C06A45", "#362820", "#7A6255", "#DFC6B6", "#8F5B42"),
    calm_blue: palette("Calm Blue", "#EFF7FC", "#FFFDFC", "#243746", "#DCEEF8", "#5E9EC7", "#243746", "#617383", "#CDE4F1", "#3F83AC"),
    navy_gold: emptyPalette("Navy Gold"),
    graphite_blue: emptyPalette("Graphite Blue"),
    executive_grey: emptyPalette("Executive Grey"),
    black_white: emptyPalette("Black White"),
    deep_green: emptyPalette("Deep Green"),
    champagne_gold: emptyPalette("Champagne Gold"),
    cream_rose: emptyPalette("Cream Rose"),
    black_gold: emptyPalette("Black Gold"),
    pearl_white: emptyPalette("Pearl White"),
    mocha_brown: emptyPalette("Mocha Brown"),
    electric_blue: emptyPalette("Electric Blue"),
    neon_purple: emptyPalette("Neon Purple"),
    dark_tech: emptyPalette("Dark Tech"),
    orange_energy: emptyPalette("Orange Energy"),
    cyber_green: emptyPalette("Cyber Green"),
    candy_pastel: emptyPalette("Candy Pastel"),
    kids_bright: emptyPalette("Kids Bright"),
    sky_yellow: emptyPalette("Sky Yellow"),
    peach_mint: emptyPalette("Peach Mint"),
    cartoon_blue: emptyPalette("Cartoon Blue")
  },
  dynamic: {
    electric_blue: palette("Electric Blue", "#090D1A", "#111A33", "#0B1F3A", "#172B55", "#5C6BFF", "#FFFFFF", "#C9D2FF", "#23304A", "#00D4FF"),
    neon_purple: palette("Neon Purple", "#110A1F", "#1C1233", "#140B2D", "#2A164D", "#F472B6", "#FFFFFF", "#DCCBFF", "#33234F", "#C084FC"),
    dark_tech: palette("Dark Tech", "#080B12", "#111827", "#030712", "#1E293B", "#38BDF8", "#FFFFFF", "#CBD5E1", "#263244", "#7DD3FC"),
    orange_energy: palette("Orange Energy", "#130D08", "#24160C", "#1C1208", "#3A2414", "#FF7A1A", "#FFFFFF", "#FFD7B0", "#4A2B15", "#FFD166"),
    cyber_green: palette("Cyber Green", "#07130F", "#0D211A", "#03100C", "#17382D", "#00D084", "#FFFFFF", "#B9F7DC", "#1A3B31", "#A3FF12"),
    navy_gold: emptyPalette("Navy Gold"),
    graphite_blue: emptyPalette("Graphite Blue"),
    executive_grey: emptyPalette("Executive Grey"),
    black_white: emptyPalette("Black White"),
    deep_green: emptyPalette("Deep Green"),
    champagne_gold: emptyPalette("Champagne Gold"),
    cream_rose: emptyPalette("Cream Rose"),
    black_gold: emptyPalette("Black Gold"),
    pearl_white: emptyPalette("Pearl White"),
    mocha_brown: emptyPalette("Mocha Brown"),
    sage_green: emptyPalette("Sage Green"),
    soft_mint: emptyPalette("Soft Mint"),
    warm_beige: emptyPalette("Warm Beige"),
    natural_clay: emptyPalette("Natural Clay"),
    calm_blue: emptyPalette("Calm Blue"),
    candy_pastel: emptyPalette("Candy Pastel"),
    kids_bright: emptyPalette("Kids Bright"),
    sky_yellow: emptyPalette("Sky Yellow"),
    peach_mint: emptyPalette("Peach Mint"),
    cartoon_blue: emptyPalette("Cartoon Blue")
  },
  playful: {
    candy_pastel: palette("Candy Pastel", "#FFF7E9", "#FFFDFC", "#553C7A", "#FFE1EC", "#FF7A59", "#24304A", "#5A6680", "#F4D9E4", "#4ECDC4"),
    kids_bright: palette("Kids Bright", "#FFF6D8", "#FFFDFC", "#253E8A", "#FFF3B0", "#FF7A59", "#24304A", "#5A6680", "#EEDC8F", "#4ECDC4"),
    sky_yellow: palette("Sky Yellow", "#EFF8FF", "#FFFDF8", "#1E2A44", "#DFF3FF", "#FBBF24", "#1E2A44", "#637088", "#C9E5F6", "#3B82F6"),
    peach_mint: palette("Peach Mint", "#FFF4EC", "#FFFDFC", "#28333F", "#FFD9C7", "#FF8A65", "#28333F", "#667085", "#EFCDBE", "#3ECF8E"),
    cartoon_blue: palette("Cartoon Blue", "#EDF7FF", "#FFFDFC", "#203047", "#BDE3FF", "#FFB703", "#203047", "#5F6E83", "#C8E4F8", "#3B82F6"),
    navy_gold: emptyPalette("Navy Gold"),
    graphite_blue: emptyPalette("Graphite Blue"),
    executive_grey: emptyPalette("Executive Grey"),
    black_white: emptyPalette("Black White"),
    deep_green: emptyPalette("Deep Green"),
    champagne_gold: emptyPalette("Champagne Gold"),
    cream_rose: emptyPalette("Cream Rose"),
    black_gold: emptyPalette("Black Gold"),
    pearl_white: emptyPalette("Pearl White"),
    mocha_brown: emptyPalette("Mocha Brown"),
    sage_green: emptyPalette("Sage Green"),
    soft_mint: emptyPalette("Soft Mint"),
    warm_beige: emptyPalette("Warm Beige"),
    natural_clay: emptyPalette("Natural Clay"),
    calm_blue: emptyPalette("Calm Blue"),
    electric_blue: emptyPalette("Electric Blue"),
    neon_purple: emptyPalette("Neon Purple"),
    dark_tech: emptyPalette("Dark Tech"),
    orange_energy: emptyPalette("Orange Energy"),
    cyber_green: emptyPalette("Cyber Green")
  }
};

export const paletteOptions = {
  business: ["navy_gold", "graphite_blue", "executive_grey", "black_white", "deep_green"],
  luxury: ["champagne_gold", "cream_rose", "black_gold", "pearl_white", "mocha_brown"],
  wellness: ["sage_green", "soft_mint", "warm_beige", "natural_clay", "calm_blue"],
  dynamic: ["electric_blue", "neon_purple", "dark_tech", "orange_energy", "cyber_green"],
  playful: ["candy_pastel", "kids_bright", "sky_yellow", "peach_mint", "cartoon_blue"]
} as const satisfies Record<Exclude<StylePreset, "auto">, readonly ColorPalette[]>;

export const themes = {
  beauty: withMeta(palettes.luxury.cream_rose, "beauty skincare soft light woman"),
  yoga_fitness: withMeta(palettes.wellness.sage_green, "yoga stretching calm natural light"),
  short_video: withMeta(palettes.dynamic.electric_blue, "content creator social media dynamic"),
  business_sales: withMeta(palettes.business.navy_gold, "business meeting professional team"),
  luxury: withMeta(palettes.luxury.champagne_gold, "luxury elegant premium soft beige gold"),
  wellness: withMeta(palettes.wellness.sage_green, "wellness calm natural light soft green"),
  dynamic: withMeta(palettes.dynamic.electric_blue, "dynamic high contrast creator neon motion"),
  playful: withMeta(palettes.playful.kids_bright, "playful bright cartoon learning rounded"),
  personal_ip: withMeta(palettes.business.black_white, "personal branding founder portrait natural light"),
  kids_education: withMeta(palettes.playful.kids_bright, "cartoon bright happy children learning"),
  real_estate: withMeta(palettes.luxury.black_gold, "luxury real estate architecture premium")
} as const;

export type ThemeKey = keyof typeof themes;

function palette(
  label: string,
  background: string,
  surface: string,
  primary: string,
  secondary: string,
  accent: string,
  textPrimary: string,
  textSecondary: string,
  border: string,
  highlight: string
): Palette {
  return { label, background, surface, primary, secondary, accent, textPrimary, textSecondary, border, highlight };
}

function emptyPalette(label: string): Palette {
  return palette(label, "#F4F6F8", "#FFFDFC", "#111827", "#E5E7EB", "#B8872D", "#111827", "#6B7280", "#D9DEE7", "#2F80ED");
}

function withMeta(theme: Palette, imageStyle: string): Theme {
  return {
    ...theme,
    text: theme.textPrimary,
    imageStyle
  };
}

function hasIndustry(value: unknown): value is { courseIndustry: string } {
  return Boolean(value && typeof value === "object" && "courseIndustry" in value);
}

function hasStylePreset(value: unknown): value is { stylePreset?: StylePreset; colorPalette?: ColorPalette } {
  return Boolean(value && typeof value === "object");
}

export function hex(value: string) {
  return value.replace("#", "");
}

function getPresetImageStyle(stylePreset: Exclude<StylePreset, "auto">) {
  const imageStyles: Record<Exclude<StylePreset, "auto">, string> = {
    business: "business meeting professional team",
    luxury: "luxury elegant premium soft light",
    wellness: "wellness calm natural light soft",
    dynamic: "dynamic high contrast creator motion",
    playful: "playful bright cartoon learning rounded"
  };
  return imageStyles[stylePreset];
}

function themeForPreset(stylePreset: Exclude<StylePreset, "auto">, colorPalette?: ColorPalette | null): Theme {
  const validPalettes = paletteOptions[stylePreset];
  const selected = colorPalette && validPalettes.some((item) => item === colorPalette) ? colorPalette : validPalettes[0];
  return withMeta(palettes[stylePreset][selected], getPresetImageStyle(stylePreset));
}

export function getTheme(stylePreset: StylePreset = "auto", colorPalette?: ColorPalette | null, fallbackKey: ThemeKey = "business_sales"): Theme {
  if (stylePreset && stylePreset !== "auto") {
    return themeForPreset(stylePreset, colorPalette);
  }

  return themes[fallbackKey];
}

export function getThemeKeyForOutline(outline: PptOutline): ThemeKey {
  const diagnosis = outline.expertDiagnosis;
  const industry = hasIndustry(diagnosis) ? diagnosis.courseIndustry : "";
  const stylePreset = hasStylePreset(outline) ? outline.stylePreset : "auto";
  const text = [outline.title, outline.subtitle, outline.audience, outline.coreMessage].join(" ").toLowerCase();

  if (stylePreset === "business") return "business_sales";
  if (stylePreset === "luxury") return "luxury";
  if (stylePreset === "wellness") return "wellness";
  if (stylePreset === "dynamic") return "dynamic";
  if (stylePreset === "playful") return "playful";
  if (text.includes("儿童") || text.includes("少儿") || text.includes("kids") || text.includes("children")) return "kids_education";
  if (text.includes("房地产") || text.includes("房产") || text.includes("real estate")) return "real_estate";
  if (industry === "beauty") return "beauty";
  if (industry === "yoga_fitness") return "yoga_fitness";
  if (industry === "short_video") return "short_video";
  if (industry === "personal_ip") return "personal_ip";
  return "business_sales";
}

export function getThemeForOutline(outline: PptOutline): Theme {
  const stylePreset = hasStylePreset(outline) ? outline.stylePreset : "auto";
  return getTheme(stylePreset, outline.colorPalette, getThemeKeyForOutline(outline));
}
