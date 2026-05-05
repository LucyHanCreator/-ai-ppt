import pptxgen from "pptxgenjs";
import { type DesignLayout } from "@/lib/layouts";
import { createLayoutPlan } from "@/lib/layoutPicker";
import { getStyleProfile, type StyleProfile } from "@/lib/style-profiles";
import { getThemeForOutline, hex } from "@/lib/theme";
import type { PptOutline, PptSlide } from "@/lib/types";

const pageW = 13.333;
const pageH = 7.5;
const marginX = 0.65;
const marginTop = 0.45;
const marginBottom = 0.45;
const headerH = 1.35;
const footerH = 0.35;
const contentY = 2.3;
const footerY = pageH - marginBottom - footerH;

const FONT = "Arial";
let NAVY = "061A34";
let NAVY2 = "102B4D";
let NAVY3 = "1B3D63";
let GOLD = "D4AF37";
let GOLD2 = "E8D7A7";
let PAPER = "F4F0E8";
const WHITE = "FFFDFC";
let SOFT = "F8F5EE";
const RED_SOFT = "F4E7E2";
const RED = "A94A3A";
let MUTED = "5B6676";
let AUX = "7D8794";
let FOOTER = "A7AFBC";
let LINE = "DADFE8";
let ON_PRIMARY = "FFFFFF";
let ON_SECONDARY = "FFFFFF";
let THEME_IMAGE_STYLE = "business meeting professional team";
let TEXT_PRIMARY = "111111";
let TEXT_SECONDARY = "5B6676";
let HIGHLIGHT = "D4AF37";
let CURRENT_STYLE: StyleProfile = {
  shape: "clean",
  spacing: "balanced",
  fontWeight: "regular",
  imageStyle: "professional training workshop",
  colors: "professional"
};

type Pptx = ReturnType<typeof createPptx>;
type Slide = ReturnType<Pptx["addSlide"]>;

function createPptx() {
  return new pptxgen();
}

function isDarkColor(color: string) {
  const normalized = color.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 145;
}

function luminance(color: string) {
  const normalized = color.replace("#", "");
  const values = [0, 2, 4].map((start) => {
    const raw = Number.parseInt(normalized.slice(start, start + 2), 16) / 255;
    return raw <= 0.03928 ? raw / 12.92 : ((raw + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function contrastRatio(foreground: string, background: string) {
  const fg = luminance(foreground);
  const bg = luminance(background);
  const light = Math.max(fg, bg);
  const dark = Math.min(fg, bg);
  return (light + 0.05) / (dark + 0.05);
}

function readableText(textColor: string, backgroundColor: string) {
  if (contrastRatio(textColor, backgroundColor) >= 4.5) return hex(textColor);
  return contrastRatio("111111", backgroundColor) > contrastRatio("FFFFFF", backgroundColor) ? "111111" : "FFFFFF";
}

function applyTheme(outline: PptOutline) {
  const theme = getThemeForOutline(outline);
  const style = getStyleProfile(outline);
  CURRENT_STYLE = style;
  NAVY = hex(theme.primary);
  NAVY2 = hex(theme.secondary);
  NAVY3 = hex(theme.secondary);
  GOLD = hex(theme.accent);
  GOLD2 = hex(theme.highlight);
  PAPER = hex(theme.background);
  SOFT = hex(theme.surface);
  TEXT_PRIMARY = readableText(theme.textPrimary, theme.background);
  TEXT_SECONDARY = contrastRatio(theme.textSecondary, theme.background) >= 3 ? hex(theme.textSecondary) : TEXT_PRIMARY;
  HIGHLIGHT = hex(theme.accent);
  MUTED = TEXT_SECONDARY;
  AUX = TEXT_SECONDARY;
  FOOTER = TEXT_SECONDARY;
  LINE = hex(theme.border);
  ON_PRIMARY = isDarkColor(theme.primary) ? "FFFFFF" : TEXT_PRIMARY;
  ON_SECONDARY = isDarkColor(theme.secondary) ? "FFFFFF" : TEXT_PRIMARY;
  THEME_IMAGE_STYLE = `${theme.imageStyle} ${style.imageStyle}`;
}

function cjkLength(value: string) {
  return Array.from(value || "").reduce((sum, char) => sum + (/[\u4e00-\u9fff]/.test(char) ? 1 : 0.55), 0);
}

function cleanText(text: string) {
  return (text || "")
    .replace(/\r?\n|\r/g, "")
    .replace(/\s+/g, "")
    .replace(/\.{3,}/g, "")
    .replace(/[|]/g, "")
    .trim();
}

function truncateText(text: string, maxChars: number) {
  const chars = Array.from(cleanText(text));
  return chars.length > maxChars ? chars.slice(0, maxChars).join("") : chars.join("") || " ";
}

function getTitleFontSize(text: string) {
  const length = cjkLength(cleanText(text));
  if (length > 24) return 24;
  if (length > 18) return 28;
  if (length > 12) return 32;
  return 36;
}

function getBodyFontSize(text: string) {
  const length = cjkLength(cleanText(text));
  if (length > 24) return 10;
  if (length > 14) return 11;
  return 12;
}

function text(slide: Slide, value: string, options: pptxgen.TextPropsOptions) {
  slide.addText(cleanText(value) || " ", {
    fontFace: FONT,
    fit: "shrink",
    margin: 0.08,
    breakLine: false,
    valign: "middle",
    ...options
  });
}

function card(slide: Slide, x: number, y: number, w: number, h: number, fill = WHITE, line = LINE, radius = 0.14) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: radius,
    fill: { color: fill },
    line: { color: line, width: 1 }
  });
}

function dot(slide: Slide, x: number, y: number, size = 0.45, fill = GOLD, line = fill) {
  slide.addShape("ellipse", {
    x,
    y,
    w: size,
    h: size,
    fill: { color: fill },
    line: { color: line, width: 1 }
  });
}

function hline(slide: Slide, x: number, y: number, w: number, color = GOLD, width = 1) {
  slide.addShape("line", { x, y, w, h: 0, line: { color, width } });
}

function vline(slide: Slide, x: number, y: number, h: number, color = GOLD, width = 1) {
  slide.addShape("line", { x, y, w: 0, h, line: { color, width } });
}

function splitContent(value: string) {
  const normalized = cleanText(value);
  const separator = normalized.includes("\uFF1A") ? "\uFF1A" : normalized.includes(":") ? ":" : normalized.includes("->") ? "->" : "";

  if (!separator) {
    return {
      title: truncateText(normalized, 8),
      description: normalized.length > 8 ? truncateText(normalized.slice(8), 12) : ""
    };
  }

  const [head, ...tail] = normalized.split(separator);
  return {
    title: truncateText(head.trim(), 8),
    description: truncateText(tail.join(separator).trim(), 12)
  };
}

function imageQuery(item: PptSlide, variant = "") {
  const rawSource = item.imageSearchQuery || item.imageQuery || item.visualSuggestion || item.keyMessage;
  const source = /[\u4e00-\u9fff]/.test(rawSource) ? "" : rawSource;
  if (/yoga|pilates|wellness|stretching|meditation/i.test(rawSource)) {
    if (item.layoutType === "cover") return "yoga practice natural light";
    if (item.layoutType === "case") return "woman stretching yoga studio";
    if (item.layoutType === "method") return "pilates wellness training";
    if (variant === "after") return "healthy lifestyle yoga";
    return rawSource;
  }
  if (item.layoutType === "cover") return `${THEME_IMAGE_STYLE} course cover ${source}`;
  if (item.layoutType === "method") return `${THEME_IMAGE_STYLE} method workflow ${source}`;
  if (item.layoutType === "case") return `${THEME_IMAGE_STYLE} student case study ${source}`;
  if (item.layoutType === "closing") return `${THEME_IMAGE_STYLE} action success ${source}`;
  if (variant === "before") return `${THEME_IMAGE_STYLE} problem stress ${source}`;
  if (variant === "after") return `${THEME_IMAGE_STYLE} positive result ${source}`;
  return `${THEME_IMAGE_STYLE} ${source}`;
}

function imageSearchUrlFor(item: PptSlide, variant = "") {
  const query = item.imageSearchQuery || imageQuery(item, variant);
  return item.imageSearchUrl || `https://www.pexels.com/search/${encodeURIComponent(query.trim() || "business presentation")}/`;
}

function visualFallback(slide: Slide, label: string, x: number, y: number, w: number, h: number, linkUrl?: string) {
  card(slide, x, y, w, h, SOFT, LINE, 0.22);
  slide.addShape("rect", {
    x,
    y,
    w,
    h: Math.min(0.22, h),
    fill: { color: GOLD, transparency: 8 },
    line: { color: GOLD, transparency: 100 }
  });
  slide.addShape("ellipse", {
    x: x + w - 1.2,
    y: y + 0.2,
    w: 0.88,
    h: 0.88,
    fill: { color: GOLD, transparency: 18 },
    line: { color: GOLD, transparency: 100 }
  });
  slide.addShape("ellipse", {
    x: x + 0.25,
    y: y + h - 1.05,
    w: 0.7,
    h: 0.7,
    fill: { color: NAVY2, transparency: 22 },
    line: { color: NAVY2, transparency: 100 }
  });
  dot(slide, x + w / 2 - 0.32, y + h / 2 - 0.45, 0.64, GOLD, GOLD);
  text(slide, "VISUAL", {
    x: x + w / 2 - 0.48,
    y: y + h / 2 - 0.18,
    w: 0.96,
    h: 0.18,
    fontSize: 10,
    bold: true,
    color: textOn(GOLD),
    align: "center"
  });
  text(slide, `建议配图：${truncateText(label, 28)}`, {
    x: x + 0.24,
    y: y + h - 0.78,
    w: w - 0.48,
    h: 0.26,
    fontSize: 10,
    bold: false,
    color: TEXT_SECONDARY,
    align: "center"
  });
  text(slide, "点击查找图片", {
    x: x + w / 2 - 0.82,
    y: y + h - 0.42,
    w: 1.64,
    h: 0.18,
    fontSize: 10,
    bold: true,
    color: HIGHLIGHT,
    align: "center",
    hyperlink: linkUrl ? { url: linkUrl } : undefined
  } as pptxgen.TextPropsOptions);
}

async function imagePanel(slide: Slide, item: PptSlide, x: number, y: number, w: number, h: number, variant = "") {
  const label = item.imagePrompt || item.visualSuggestion || imageQuery(item, variant);
  visualFallback(slide, label, x, y, w, h, imageSearchUrlFor(item, variant));
}

function footer(slide: Slide, outline: PptOutline, page: number, total: number) {
  hline(slide, marginX, footerY, pageW - marginX * 2, LINE, 0.7);
  text(slide, truncateText(outline.title, 32), {
    x: marginX,
    y: footerY + 0.12,
    w: 5.2,
    h: 0.18,
    fontSize: 10,
    color: FOOTER
  });
  text(slide, `${String(page).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, {
    x: 11.7,
    y: footerY + 0.12,
    w: 0.95,
    h: 0.18,
    fontSize: 10,
    color: FOOTER,
    bold: true,
    align: "right"
  });
}

function titleStack(slide: Slide, item: PptSlide, dark = false) {
  text(slide, truncateText(item.sectionLabel.toUpperCase(), 10), {
    x: 0.75,
    y: 0.35,
    w: 3,
    h: 0.25,
    fontSize: 10,
    bold: true,
    color: dark ? GOLD2 : GOLD
  });
  text(slide, truncateText(item.slideTitle, 18), {
    x: 0.75,
    y: 0.75,
    w: 6.3,
    h: 0.76,
    fontSize: getTitleFontSize(item.slideTitle),
    bold: true,
    color: dark ? ON_PRIMARY : NAVY,
    align: "left"
  });
  hline(slide, 0.75, 1.58, 1.5, GOLD, 1.2);
  text(slide, truncateText(item.subtitle, 20), {
    x: 0.75,
    y: 1.75,
    w: 6.3,
    h: 0.35,
    fontSize: cjkLength(item.subtitle) > 14 ? 16 : 18,
    color: dark ? GOLD2 : MUTED
  });
}

function noteBlock(slide: Slide, item: PptSlide, x: number, y: number, w: number, h: number, dark = false) {
  text(slide, truncateText(item.expandedExplanation, 28), {
    x,
    y,
    w,
    h: h * 0.52,
    fontSize: getBodyFontSize(item.expandedExplanation),
    color: dark ? GOLD2 : AUX
  });
  text(slide, truncateText(item.decisionValue, 14), {
    x,
    y: y + h * 0.58,
    w,
    h: h * 0.38,
    fontSize: 12,
    color: dark ? ON_PRIMARY : MUTED,
    bold: true
  });
}

function safeNumberedCard(slide: Slide, index: number, value: string, x: number, y: number, w: number, h: number, active = false) {
  const content = splitContent(value);
  const showDescription = h >= 0.72 && w >= 1.7;
  card(slide, x, y, w, h, active ? NAVY : SOFT, active ? GOLD : LINE);
  dot(slide, x + 0.18, y + 0.09, 0.45, active ? GOLD : NAVY2, active ? GOLD : NAVY2);
  text(slide, `${index + 1}`.padStart(2, "0"), {
    x: x + 0.25,
    y: y + 0.22,
    w: 0.31,
    h: 0.1,
    fontSize: 9,
    bold: true,
    color: active ? textOn(GOLD) : ON_SECONDARY,
    align: "center"
  });
  text(slide, truncateText(content.title, 8), {
    x: x + 0.78,
    y: y + (showDescription ? 0.08 : 0.18),
    w: w - 0.95,
    h: showDescription ? 0.2 : h - 0.26,
    fontSize: showDescription ? 14 : 13,
    bold: true,
    color: active ? ON_PRIMARY : NAVY
  });
  if (showDescription) {
    text(slide, truncateText(content.description, 12), {
      x: x + 0.78,
      y: y + 0.33,
      w: w - 0.95,
      h: Math.max(0.18, h - 0.42),
      fontSize: 10,
      color: active ? ON_PRIMARY : MUTED
    });
  }
}

function safeLabelCard(slide: Slide, label: string, value: string, x: number, y: number, w: number, h: number, active = false) {
  const content = splitContent(value);
  const showDescription = h >= 0.72 && w >= 2.25;
  card(slide, x, y, w, h, active ? NAVY : NAVY2, active ? GOLD : LINE);
  text(slide, label, {
    x: x + 0.16,
    y: y + 0.1,
    w: 0.54,
    h: 0.16,
    fontSize: 10,
    bold: true,
    color: active ? GOLD : HIGHLIGHT
  });
  text(slide, truncateText(content.title, 8), {
    x: x + 0.72,
    y: y + (showDescription ? 0.1 : 0.18),
    w: w - 0.88,
    h: showDescription ? 0.22 : h - 0.3,
    fontSize: showDescription ? 14 : 13,
    bold: true,
    color: active ? ON_PRIMARY : textOn(NAVY2)
  });
  if (showDescription) {
    text(slide, truncateText(content.description, 12), {
      x: x + 0.72,
      y: y + 0.34,
      w: w - 0.88,
      h: Math.max(0.18, h - 0.44),
      fontSize: 10,
      color: active ? ON_PRIMARY : mutedOn(NAVY2)
    });
  }
}

async function renderCover(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, { ...item, slideTitle: truncateText(outline.title, 16), subtitle: item.subtitle || outline.subtitle });
  await imagePanel(slide, item, 8.15, contentY + 0.05, 2.85, 2.05);
  text(slide, truncateText(item.keyMessage, 18), {
    x: 0.75,
    y: 2.45,
    w: 6.1,
    h: 0.42,
    fontSize: 18,
    color: GOLD2,
    bold: true
  });
  item.coreContent.slice(0, 3).forEach((content, i) => {
    safeLabelCard(slide, `0${i + 1}`, content, 0.75, 3.28 + i * 0.62, 4.4, 0.48, i === 0);
  });
  noteBlock(slide, item, 0.75, 5.25, 5.2, 0.65, true);
  footer(slide, outline, page, total);
}

async function renderAgenda(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  item.coreContent.slice(0, 5).forEach((content, i) => {
    safeNumberedCard(slide, i, content, 0.85 + i * 2.42, contentY + 0.2, 1.9, 2.05, i === 0);
  });
  noteBlock(slide, item, 0.75, 5.35, 5.4, 0.8);
  footer(slide, outline, page, total);
}

async function renderGoal(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  dot(slide, 0.95, 2.65, 1.35, NAVY2, GOLD);
  text(slide, truncateText(item.keyMessage, 10), {
    x: 1.13,
    y: 3.08,
    w: 1,
    h: 0.28,
    fontSize: 15,
    bold: true,
    color: ON_SECONDARY,
    align: "center"
  });
  item.coreContent.slice(0, 4).forEach((content, i) => {
    safeLabelCard(slide, `0${i + 1}`, content, 3.0, contentY + 0.05 + i * 0.78, 3.55, 0.58, i === 0);
  });
  await imagePanel(slide, item, 7.75, contentY + 0.15, 3.05, 2.2);
  footer(slide, outline, page, total);
}

async function renderProblemMatrix(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  text(slide, truncateText(item.keyMessage, 18), {
    x: 0.75,
    y: 2.45,
    w: 3.35,
    h: 0.55,
    fontSize: 18,
    bold: true,
    color: GOLD
  });
  item.coreContent.slice(0, 3).forEach((content, i) => {
    safeNumberedCard(slide, i, content, 4.6, 2.05 + i * 0.87, 3.2, 0.62, i === 0);
  });
  visualFallback(slide, item.imagePrompt || item.visualSuggestion, 9.2, 1.95, 3.1, 3.8, imageSearchUrlFor(item));
  noteBlock(slide, item, 0.75, 5.1, 5.2, 0.9);
  footer(slide, outline, page, total);
}

async function renderBeforeAfter(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  card(slide, 0.85, contentY + 0.05, 4.25, 2.8, RED_SOFT, RED, 0.2);
  card(slide, 8.25, contentY + 0.05, 4.25, 2.8, WHITE, GOLD2, 0.2);
  card(slide, 5.65, 2.78, 1.4, 1.95, NAVY2, NAVY2, 0.24);
  text(slide, "TO", { x: 5.96, y: 3.52, w: 0.78, h: 0.25, fontSize: 18, bold: true, color: GOLD, align: "center" });
  text(slide, "BEFORE", { x: 1.08, y: 2.58, w: 1.3, h: 0.24, fontSize: 10, bold: true, color: RED });
  text(slide, "AFTER", { x: 8.48, y: 2.58, w: 1.3, h: 0.24, fontSize: 10, bold: true, color: GOLD });
  text(slide, item.coreContent.slice(0, 2).map((entry) => truncateText(entry, 18)).join("\n"), {
    x: 1.1,
    y: 3.05,
    w: 3.55,
    h: 1.2,
    fontSize: 16,
    bold: true,
    color: RED
  });
  text(slide, item.coreContent.slice(2, 4).map((entry) => truncateText(entry, 18)).join("\n"), {
    x: 8.5,
    y: 3.05,
    w: 3.55,
    h: 1.2,
    fontSize: 16,
    bold: true,
    color: NAVY
  });
  noteBlock(slide, item, 4.1, 5.45, 5.1, 0.75);
  footer(slide, outline, page, total);
}

async function renderThreeEngines(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  item.coreContent.slice(0, 3).forEach((content, i) => {
    const x = 0.9 + i * 4.08;
    const y = contentY + 0.25 + (i === 1 ? -0.18 : 0);
    const parsed = splitContent(content);
    card(slide, x, y, 3.15, 2.35, i === 1 ? NAVY2 : WHITE, i === 1 ? NAVY2 : LINE, 0.22);
    dot(slide, x + 1.12, y - 0.3, 0.8, i === 1 ? GOLD : NAVY2, GOLD);
    text(slide, `0${i + 1}`, {
      x: x + 1.3,
      y: y - 0.04,
      w: 0.28,
      h: 0.1,
      fontSize: 10,
      bold: true,
      color: i === 1 ? NAVY : ON_SECONDARY,
      align: "center"
    });
    text(slide, parsed.title, {
      x: x + 0.35,
      y: y + 0.7,
      w: 2.45,
      h: 0.38,
      fontSize: 17,
      bold: true,
      color: i === 1 ? ON_SECONDARY : NAVY,
      align: "center"
    });
    text(slide, parsed.description || " ", {
      x: x + 0.4,
      y: y + 1.23,
      w: 2.35,
      h: 0.52,
      fontSize: 12,
      color: i === 1 ? GOLD2 : MUTED,
      align: "center"
    });
  });
  noteBlock(slide, item, 0.9, 5.55, 5.6, 0.65);
  footer(slide, outline, page, total);
}

async function renderTimeline(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  hline(slide, 1.08, 3.38, 10.8, GOLD2, 2);
  item.coreContent.slice(0, 5).forEach((content, i) => {
    const x = 0.9 + i * 2.45;
    dot(slide, x + 0.62, 3.08, 0.58, i === 0 ? NAVY2 : GOLD, i === 0 ? NAVY2 : GOLD);
    text(slide, `${i + 1}`, {
      x: x + 0.82,
      y: 3.27,
      w: 0.18,
      h: 0.1,
      fontSize: 10,
      bold: true,
      color: i === 0 ? ON_SECONDARY : NAVY,
      align: "center"
    });
    safeNumberedCard(slide, i, content, x, 4.0, 1.78, 0.88, i === 0);
  });
  noteBlock(slide, item, 0.95, 5.55, 5.5, 0.65);
  footer(slide, outline, page, total);
}

async function renderMethod(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  await imagePanel(slide, item, 0.8, contentY + 0.1, 2.6, 2.1);
  item.coreContent.slice(0, 5).forEach((content, i) => {
    const x = 4.35 + (i % 2) * 3.75;
    const y = contentY + 0.05 + Math.floor(i / 2) * 0.95;
    safeLabelCard(slide, ["IDEA", "AIM", "OPS", "DATA", "DO"][i] || "STEP", content, x, y, 3.08, 0.7, i === 0);
  });
  noteBlock(slide, item, 4.35, 5.45, 5.2, 0.75);
  footer(slide, outline, page, total);
}

async function renderCase(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  await imagePanel(slide, item, 0.8, contentY + 0.1, 2.7, 2.2);
  const labels = ["BACK", "ISSUE", "ACTION", "RESULT", "COPY"];
  item.coreContent.slice(0, 5).forEach((content, i) => {
    const x = 4.6 + (i % 2) * 3.25;
    const y = contentY + 0.05 + Math.floor(i / 2) * 0.88;
    safeLabelCard(slide, labels[i] || `0${i + 1}`, content, x, y, 2.7, 0.66, i === 2);
  });
  noteBlock(slide, item, 4.6, 5.35, 5.05, 0.8);
  footer(slide, outline, page, total);
}

async function renderSop(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  vline(slide, 1.52, contentY + 0.08, 3.2, GOLD2, 2);
  item.coreContent.slice(0, 6).forEach((content, i) => {
    const y = contentY + i * 0.58;
    dot(slide, 1.3, y + 0.07, 0.45, i === 0 ? NAVY2 : GOLD, i === 0 ? NAVY2 : GOLD);
    safeNumberedCard(slide, i, content, 2.0, y, 4.0, 0.48, i === 0);
  });
  visualFallback(slide, item.imagePrompt || item.keyMessage, 7.55, contentY + 0.3, 2.7, 1.9, imageSearchUrlFor(item));
  noteBlock(slide, item, 7.1, 5.35, 4.0, 0.8);
  footer(slide, outline, page, total);
}

async function renderPricing(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  visualFallback(slide, item.imagePrompt || "VALUE", 0.8, 2.65, 1.6, 1.45, imageSearchUrlFor(item));
  item.coreContent.slice(0, 6).forEach((content, i) => {
    const x = 3.25 + (i % 2) * 4.25;
    const y = contentY + 0.02 + Math.floor(i / 2) * 0.88;
    safeLabelCard(slide, ["CORE", "GIFT", "TIME", "FIT", "LIMIT", "NO"][i] || "ITEM", content, x, y, 3.55, 0.64, false);
  });
  noteBlock(slide, item, 3.25, 5.4, 5.3, 0.78);
  footer(slide, outline, page, total);
}

async function renderClosing(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  slide.background = { color: PAPER };
  titleStack(slide, item);
  await imagePanel(slide, item, 8.1, contentY + 0.1, 2.85, 1.9);
  text(slide, truncateText(item.keyMessage, 18), {
    x: 0.75,
    y: 2.45,
    w: 5.8,
    h: 0.42,
    fontSize: 18,
    color: GOLD2,
    bold: true
  });
  item.coreContent.slice(0, 4).forEach((content, i) => {
    safeNumberedCard(slide, i, content, 7.35, 4.25 + i * 0.62, 4.25, 0.5, true);
  });
  noteBlock(slide, item, 0.75, 5.15, 5.4, 0.85, true);
  footer(slide, outline, page, total);
}

async function renderSlide(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  if (item.layoutType === "cover") await renderCover(slide, outline, item, page, total);
  else if (item.layoutType === "agenda") await renderAgenda(slide, outline, item, page, total);
  else if (item.layoutType === "goal") await renderGoal(slide, outline, item, page, total);
  else if (item.layoutType === "problem_matrix") await renderProblemMatrix(slide, outline, item, page, total);
  else if (item.layoutType === "before_after") await renderBeforeAfter(slide, outline, item, page, total);
  else if (item.layoutType === "three_engines") await renderThreeEngines(slide, outline, item, page, total);
  else if (item.layoutType === "timeline") await renderTimeline(slide, outline, item, page, total);
  else if (item.layoutType === "method") await renderMethod(slide, outline, item, page, total);
  else if (item.layoutType === "case") await renderCase(slide, outline, item, page, total);
  else if (item.layoutType === "sop") await renderSop(slide, outline, item, page, total);
  else if (item.layoutType === "pricing") await renderPricing(slide, outline, item, page, total);
  else await renderClosing(slide, outline, item, page, total);
}

function textOn(fill: string) {
  return isDarkColor(fill) ? "FFFFFF" : TEXT_PRIMARY;
}

function mutedOn(fill: string) {
  return isDarkColor(fill) ? "DDE3EF" : TEXT_SECONDARY;
}

function cardRadius() {
  if (CURRENT_STYLE.shape === "sharp") return 0.04;
  if (CURRENT_STYLE.shape === "playful") return 0.28;
  if (CURRENT_STYLE.shape === "rounded") return 0.22;
  return 0.14;
}

function isKidsStyle() {
  return CURRENT_STYLE.shape === "playful";
}

function fontBoost() {
  return isKidsStyle() ? 2 : 0;
}

function visualIcon(index: number) {
  const icons = isKidsStyle() ? ["*", "o", "+", "#", "!"] : ["UP", "O", "D", "->", "OK"];
  return icons[index % icons.length];
}

function glow(slide: Slide, x: number, y: number, w: number, h: number, color = GOLD) {
  slide.addShape("ellipse", {
    x,
    y,
    w,
    h,
    fill: { color, transparency: 82 },
    line: { color, transparency: 100 }
  });
}

function bigNumber(slide: Slide, value: string, x: number, y: number, w: number, h: number, dark = false) {
  text(slide, value, {
    x,
    y,
    w,
    h,
    fontSize: 54 + fontBoost(),
    bold: true,
    color: HIGHLIGHT,
    transparency: 72,
    align: "center"
  });
}

function addVisualSignature(slide: Slide, page: number, dark = false) {
  glow(slide, 9.2, 0.2, 3.5, 2.0, NAVY2);
  hline(slide, 0.75, 2.12, 1.1, HIGHLIGHT, 1.2);
  bigNumber(slide, String(page).padStart(2, "0"), 10.9, 0.45, 1.4, 0.7, dark);
}

function roleFill(role: "main" | "secondary" | "tertiary") {
  if (role === "main") return NAVY;
  if (role === "secondary") return NAVY2;
  return SOFT;
}

function designCard(slide: Slide, x: number, y: number, w: number, h: number, fill = WHITE, active = false) {
  const radius = cardRadius();
  const shadowColor = isDarkColor(PAPER) ? NAVY : LINE;
  slide.addShape("roundRect", {
    x: x + 0.04,
    y: y + 0.05,
    w,
    h,
    rectRadius: radius,
    fill: { color: shadowColor, transparency: 45 },
    line: { color: shadowColor, transparency: 100 }
  });
  card(slide, x, y, w, h, active ? NAVY : fill, active ? GOLD : LINE, radius);
  if (!active) {
    slide.addShape("rect", {
      x,
      y,
      w: 0.06,
      h,
      fill: { color: HIGHLIGHT },
      line: { color: HIGHLIGHT, transparency: 100 }
    });
  }
}

function badge(slide: Slide, label: string, x: number, y: number, color = GOLD, textColor = textOn(color)) {
  if (CURRENT_STYLE.shape === "sharp") {
    slide.addShape("rect", { x, y, w: 0.56, h: 0.34, fill: { color }, line: { color } });
  } else {
    dot(slide, x, y, 0.46, color, color);
  }
  text(slide, label, {
    x: x + 0.04,
    y: y + 0.11,
    w: 0.38,
    h: 0.1,
    fontSize: 8 + fontBoost(),
    bold: true,
    color: textColor,
    align: "center"
  });
}

function pill(slide: Slide, value: string, x: number, y: number, w: number, fill = SOFT) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h: 0.3,
    rectRadius: 0.15,
    fill: { color: fill },
    line: { color: fill }
  });
  text(slide, truncateText(value, 12), {
    x: x + 0.1,
    y: y + 0.08,
    w: w - 0.2,
    h: 0.1,
    fontSize: 9 + fontBoost(),
    bold: true,
    color: textOn(fill),
    align: "center"
  });
}

function pageBg(slide: Slide, dark = false) {
  slide.background = { color: dark ? PAPER : PAPER };
}

function headerV2(slide: Slide, item: PptSlide, centered = false, dark = false) {
  const titleColor = NAVY;
  const subColor = TEXT_SECONDARY;
  text(slide, truncateText(item.sectionLabel, 12), {
    x: centered ? 4.85 : 0.75,
    y: 0.38,
    w: centered ? 3.6 : 3.4,
    h: 0.28,
    fontSize: 10 + fontBoost(),
    bold: true,
    color: HIGHLIGHT,
    align: centered ? "center" : "left"
  });
  text(slide, truncateText(item.slideTitle, isKidsStyle() ? 14 : 18), {
    x: centered ? 2.15 : 0.75,
    y: centered ? 0.92 : 0.78,
    w: centered ? 9.0 : 6.7,
    h: centered ? 0.85 : 0.78,
    fontSize: Math.min(getTitleFontSize(item.slideTitle) + fontBoost(), 38),
    bold: CURRENT_STYLE.fontWeight !== "light",
    color: titleColor,
    align: centered ? "center" : "left"
  });
  text(slide, truncateText(item.subtitle, 24), {
    x: centered ? 2.5 : 0.75,
    y: centered ? 1.8 : 1.66,
    w: centered ? 8.3 : 6.5,
    h: 0.38,
    fontSize: 15 + fontBoost(),
    color: subColor,
    align: centered ? "center" : "left"
  });
}

function coreParts(value: string) {
  const parsed = splitContent(value);
  return {
    title: truncateText(parsed.title, isKidsStyle() ? 6 : 8),
    description: truncateText(parsed.description, isKidsStyle() ? 8 : 14)
  };
}

function renderContentCard(slide: Slide, value: string, index: number, x: number, y: number, w: number, h: number, active = false, role: "main" | "secondary" | "tertiary" = active ? "main" : "secondary") {
  const fill = roleFill(role);
  const fg = role === "main" ? ON_PRIMARY : role === "secondary" ? textOn(NAVY2) : TEXT_PRIMARY;
  const muted = role === "main" ? ON_PRIMARY : role === "secondary" ? mutedOn(NAVY2) : TEXT_SECONDARY;
  const parsed = coreParts(value);
  designCard(slide, x, y, w, h, fill, role === "main");
  if (role === "tertiary") {
    text(slide, visualIcon(index), { x: x + 0.18, y: y + 0.18, w: 0.35, h: 0.18, fontSize: 13 + fontBoost(), bold: true, color: HIGHLIGHT, align: "center" });
  } else {
    badge(slide, `${index + 1}`, x + 0.18, y + 0.18, role === "main" ? GOLD : HIGHLIGHT, textOn(role === "main" ? GOLD : HIGHLIGHT));
  }
  text(slide, parsed.title, {
    x: x + 0.78,
    y: y + 0.18,
    w: w - 1.0,
    h: 0.3,
    fontSize: (role === "main" ? 16 : 14) + fontBoost(),
    bold: true,
    color: fg
  });
  text(slide, parsed.description || truncateText(value, 12), {
    x: x + 0.78,
    y: y + 0.58,
    w: w - 1.0,
    h: Math.max(0.25, h - 0.74),
    fontSize: 10 + fontBoost(),
    color: muted
  });
}

function highlightQuote(slide: Slide, item: PptSlide, x: number, y: number, w: number, h: number, dark = false) {
  const fill = NAVY2;
  designCard(slide, x, y, w, h, fill, false);
  text(slide, truncateText(item.keyMessage, 22), {
    x: x + 0.35,
    y: y + 0.35,
    w: w - 0.7,
    h: 0.52,
    fontSize: 20 + fontBoost(),
    bold: true,
    color: textOn(fill),
    align: "center"
  });
  text(slide, truncateText(item.expandedExplanation, 32), {
    x: x + 0.5,
    y: y + 1.08,
    w: w - 1.0,
    h: 0.45,
    fontSize: 12 + fontBoost(),
    color: mutedOn(fill),
    align: "center"
  });
  pill(slide, item.decisionValue, x + w / 2 - 1.2, y + h - 0.55, 2.4, GOLD);
}

async function renderHeroLeft(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number, dark = false) {
  pageBg(slide, dark);
  addVisualSignature(slide, page, dark);
  headerV2(slide, item, false, dark);
  highlightQuote(slide, item, 0.75, 2.45, 4.8, 2.1, dark);
  item.coreContent.slice(0, isKidsStyle() ? 3 : 4).forEach((content, i) => {
    renderContentCard(slide, content, i, 0.85 + (i % 2) * 2.45, 4.85 + Math.floor(i / 2) * 0.72, 2.15, 0.58, i === 0 && !dark);
  });
  await imagePanel(slide, item, 7.55, 1.35, 4.25, 4.1);
  footer(slide, outline, page, total);
}

async function renderHeroCenter(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number, dark = false) {
  pageBg(slide, dark);
  addVisualSignature(slide, page, dark);
  await imagePanel(slide, item, 4.75, 2.25, 3.85, 2.05);
  headerV2(slide, item, true, dark);
  item.coreContent.slice(0, 3).forEach((content, i) => {
    const x = 1.35 + i * 3.75;
    renderContentCard(slide, content, i, x, 4.85, 2.85, 0.74, i === 1);
  });
  footer(slide, outline, page, total);
}

async function renderCoverBackground(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  pageBg(slide, true);
  card(slide, 0, 0, pageW, pageH, NAVY, NAVY, 0);
  glow(slide, 8.2, 0.8, 4.2, 2.4, GOLD);
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: pageW,
    h: pageH,
    fill: { color: NAVY, transparency: 70 },
    line: { color: NAVY, transparency: 100 }
  });
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 7.2,
    h: pageH,
    fill: { color: NAVY, transparency: 0 },
    line: { color: NAVY, transparency: 100 }
  });
  visualFallback(slide, item.imagePrompt || item.visualSuggestion || imageQuery(item), 7.7, 1.05, 4.0, 3.0, imageSearchUrlFor(item));
  titleStack(slide, { ...item, slideTitle: truncateText(outline.title, 18), subtitle: item.subtitle || outline.subtitle }, true);
  highlightQuote(slide, item, 0.85, 2.45, 4.85, 1.65, true);
  item.coreContent.slice(0, 3).forEach((content, i) => {
    renderContentCard(slide, content, i, 0.9 + i * 2.05, 4.72, 1.75, 0.7, i === 0, i === 0 ? "main" : "secondary");
  });
  footer(slide, outline, page, total);
}

async function renderMethodCardsWithImage(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  pageBg(slide);
  addVisualSignature(slide, page);
  headerV2(slide, item);
  await imagePanel(slide, item, 0.85, 2.35, 3.25, 2.35);
  const items = item.coreContent.slice(0, 5);
  renderContentCard(slide, items[0] || item.keyMessage, 0, 4.65, 2.35, 3.4, 1.35, true, "main");
  items.slice(1, 5).forEach((content, i) => {
    const coords = [
      [8.45, 2.35, 2.95, 0.82, "secondary"],
      [8.8, 3.45, 2.55, 0.72, "tertiary"],
      [4.85, 4.25, 2.95, 0.72, "tertiary"],
      [8.1, 4.55, 3.1, 0.7, "secondary"]
    ][i] as [number, number, number, number, "secondary" | "tertiary"];
    renderContentCard(slide, content, i + 1, coords[0], coords[1], coords[2], coords[3], false, coords[4]);
  });
  footer(slide, outline, page, total);
}

async function renderGrid(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number, count: 3 | 5) {
  pageBg(slide);
  addVisualSignature(slide, page);
  headerV2(slide, item);
  const items = item.coreContent.slice(0, count);
  if (count === 3) {
    renderContentCard(slide, items[0] || item.keyMessage, 0, 0.9, 2.55, 4.35, 2.35, true, "main");
    hline(slide, 5.25, 3.45, 1.0, HIGHLIGHT, 1.4);
    text(slide, "->", { x: 5.65, y: 3.28, w: 0.35, h: 0.2, fontSize: 18, bold: true, color: HIGHLIGHT, align: "center" });
    renderContentCard(slide, items[1] || item.keyMessage, 1, 6.25, 2.45, 2.85, 1.12, false, "secondary");
    renderContentCard(slide, items[2] || item.keyMessage, 2, 9.4, 3.75, 2.35, 0.86, false, "tertiary");
  } else {
    renderContentCard(slide, items[0] || item.keyMessage, 0, 0.85, 2.45, 3.75, 2.0, true, "main");
    hline(slide, 4.7, 3.1, 6.4, HIGHLIGHT, 1.2);
    items.slice(1, 5).forEach((content, i) => {
      const coords = [
        [5.15, 2.35, 2.2, 0.86],
        [8.15, 2.95, 2.45, 0.96],
        [5.75, 4.25, 2.65, 0.82],
        [9.2, 4.65, 2.1, 0.72]
      ][i];
      renderContentCard(slide, content, i + 1, coords[0], coords[1], coords[2], coords[3], false, i === 0 ? "secondary" : "tertiary");
    });
  }
  noteBlock(slide, item, 0.9, 5.35, 5.8, 0.68);
  footer(slide, outline, page, total);
}

async function renderCards(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number, count: 3 | 5) {
  pageBg(slide);
  addVisualSignature(slide, page);
  headerV2(slide, item);
  const items = item.coreContent.slice(0, count);
  if (count === 3) {
    renderContentCard(slide, items[0] || item.keyMessage, 0, 0.95, 2.55, 4.4, 2.15, true, "main");
    renderContentCard(slide, items[1] || item.keyMessage, 1, 6.1, 2.35, 3.0, 1.18, false, "secondary");
    renderContentCard(slide, items[2] || item.keyMessage, 2, 9.6, 4.05, 2.3, 0.82, false, "tertiary");
    vline(slide, 5.65, 2.75, 2.0, HIGHLIGHT, 1.2);
  } else {
    renderContentCard(slide, items[0] || item.keyMessage, 0, 0.95, 2.42, 4.0, 2.0, true, "main");
    renderContentCard(slide, items[1] || item.keyMessage, 1, 5.55, 2.35, 2.75, 1.0, false, "secondary");
    renderContentCard(slide, items[2] || item.keyMessage, 2, 8.75, 2.8, 2.55, 0.86, false, "tertiary");
    renderContentCard(slide, items[3] || item.keyMessage, 3, 5.55, 4.25, 2.55, 0.82, false, "tertiary");
    renderContentCard(slide, items[4] || item.keyMessage, 4, 8.55, 4.55, 2.95, 0.78, false, "secondary");
  }
  noteBlock(slide, item, 0.95, 5.5, 5.8, 0.62);
  footer(slide, outline, page, total);
}

async function renderTimelineV2(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  pageBg(slide);
  addVisualSignature(slide, page);
  headerV2(slide, item);
  hline(slide, 1.25, 3.35, 10.65, LINE, 2);
  item.coreContent.slice(0, 5).forEach((content, i) => {
    const x = 0.92 + i * 2.45;
    badge(slide, `${i + 1}`, x + 0.72, 3.12, i === 0 ? GOLD : NAVY2, i === 0 ? textOn(GOLD) : ON_SECONDARY);
    if (i < 4) text(slide, "->", { x: x + 2.0, y: 3.19, w: 0.28, h: 0.12, fontSize: 11, bold: true, color: HIGHLIGHT, align: "center" });
    renderContentCard(slide, content, i, x, 4.0 + (i % 2) * 0.16, i === 0 ? 2.05 : 1.7, i === 0 ? 0.98 : 0.76, i === 0, i === 0 ? "main" : i % 2 ? "secondary" : "tertiary");
  });
  footer(slide, outline, page, total);
}

async function renderComparisonV2(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  pageBg(slide);
  addVisualSignature(slide, page);
  headerV2(slide, item);
  designCard(slide, 0.9, 2.45, 4.25, 2.35, RED_SOFT);
  designCard(slide, 8.2, 2.45, 4.25, 2.35, SOFT);
  card(slide, 5.72, 2.95, 1.18, 1.18, GOLD, GOLD, 0.4);
  text(slide, "->", { x: 5.98, y: 3.3, w: 0.68, h: 0.24, fontSize: 18, bold: true, color: textOn(GOLD), align: "center" });
  text(slide, "Before", { x: 1.25, y: 2.75, w: 1.3, h: 0.22, fontSize: 11, bold: true, color: RED });
  text(slide, item.coreContent.slice(0, 2).map((entry) => truncateText(entry, 16)).join("\n"), { x: 1.25, y: 3.22, w: 3.3, h: 0.9, fontSize: 15 + fontBoost(), bold: true, color: RED });
  text(slide, "After", { x: 8.55, y: 2.75, w: 1.3, h: 0.22, fontSize: 11, bold: true, color: HIGHLIGHT });
  text(slide, item.coreContent.slice(2, 4).map((entry) => truncateText(entry, 16)).join("\n"), { x: 8.55, y: 3.22, w: 3.3, h: 0.9, fontSize: 15 + fontBoost(), bold: true, color: TEXT_PRIMARY });
  noteBlock(slide, item, 4.05, 5.35, 5.1, 0.72);
  footer(slide, outline, page, total);
}

async function renderVisualFocus(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  pageBg(slide);
  addVisualSignature(slide, page);
  headerV2(slide, item);
  await imagePanel(slide, item, 0.85, 2.15, 4.05, 3.2);
  highlightQuote(slide, item, 5.55, 2.3, 3.0, 1.55);
  item.coreContent.slice(0, 3).forEach((content, i) => renderContentCard(slide, content, i, 9.2, 2.25 + i * 0.96, 2.65, 0.72, i === 0));
  footer(slide, outline, page, total);
}

async function renderQuoteV2(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  const dark = CURRENT_STYLE.colors === "dark_gold";
  pageBg(slide, dark);
  addVisualSignature(slide, page, dark);
  headerV2(slide, item, false, dark);
  highlightQuote(slide, item, 2.05, 2.42, 6.45, 2.32, dark);
  item.coreContent.slice(0, 3).forEach((content, i) => renderContentCard(slide, content, i, 9.05, 2.25 + i * 0.92, 2.8, 0.7, i === 0));
  footer(slide, outline, page, total);
}

async function renderZStory(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  pageBg(slide);
  addVisualSignature(slide, page);
  headerV2(slide, item);
  const items = item.coreContent.slice(0, 5);
  renderContentCard(slide, items[0] || item.keyMessage, 0, 0.9, 2.35, 3.75, 1.55, true, "main");
  hline(slide, 4.65, 3.1, 2.1, HIGHLIGHT, 1.4);
  renderContentCard(slide, items[1] || item.keyMessage, 1, 6.75, 2.55, 2.65, 0.86, false, "secondary");
  vline(slide, 8.05, 3.4, 1.05, HIGHLIGHT, 1.1);
  renderContentCard(slide, items[2] || item.keyMessage, 2, 8.85, 4.1, 2.75, 0.9, false, "tertiary");
  renderContentCard(slide, items[3] || item.keyMessage, 3, 4.85, 4.55, 2.65, 0.72, false, "tertiary");
  renderContentCard(slide, items[4] || item.keyMessage, 4, 1.35, 4.95, 2.25, 0.64, false, "secondary");
  footer(slide, outline, page, total);
}

async function renderLayeredFocus(slide: Slide, outline: PptOutline, item: PptSlide, page: number, total: number) {
  pageBg(slide);
  addVisualSignature(slide, page);
  headerV2(slide, item);
  bigNumber(slide, String(page).padStart(2, "0"), 0.6, 2.15, 2.1, 1.0);
  await imagePanel(slide, item, 0.95, 2.65, 3.2, 2.45);
  highlightQuote(slide, item, 4.7, 2.35, 4.0, 1.75);
  item.coreContent.slice(0, 4).forEach((content, i) => {
    const coords = [
      [9.15, 2.35, 2.7, 0.82, "secondary"],
      [8.65, 3.45, 3.25, 0.76, "tertiary"],
      [9.35, 4.45, 2.35, 0.68, "tertiary"],
      [5.05, 4.65, 3.35, 0.62, "secondary"]
    ][i] as [number, number, number, number, "secondary" | "tertiary"];
    renderContentCard(slide, content, i, coords[0], coords[1], coords[2], coords[3], false, coords[4]);
  });
  footer(slide, outline, page, total);
}

async function renderDesignSlide(slide: Slide, outline: PptOutline, item: PptSlide, layout: DesignLayout, page: number, total: number) {
  const darkHero = CURRENT_STYLE.colors === "dark_gold" || item.layoutType === "closing";

  if (layout === "heroCover") return renderCoverBackground(slide, outline, item, page, total);
  if (layout === "splitTextImage") return renderHeroLeft(slide, outline, item, page, total, darkHero && item.layoutType !== "method");
  if (layout === "threeColumn") return renderCards(slide, outline, item, page, total, 3);
  if (layout === "timeline") return renderTimelineV2(slide, outline, item, page, total);
  if (layout === "stepCards") return renderZStory(slide, outline, item, page, total);
  if (layout === "bigStatement") return renderLayeredFocus(slide, outline, item, page, total);
  if (layout === "imageHighlight") return renderVisualFocus(slide, outline, item, page, total);
  if (layout === "dataGrid") return renderGrid(slide, outline, item, page, total, 5);
  if (layout === "quoteHighlight") return renderQuoteV2(slide, outline, item, page, total);
  if (layout === "comparison") return renderComparisonV2(slide, outline, item, page, total);
  if (item.layoutType === "cover") return renderCoverBackground(slide, outline, item, page, total);
  if (item.imageRequired && page <= 3) return renderVisualFocus(slide, outline, item, page, total);
  if (layout === "hero_left_text_right_image") return renderHeroLeft(slide, outline, item, page, total, darkHero && item.layoutType !== "method");
  if (layout === "hero_center") return renderHeroCenter(slide, outline, item, page, total, darkHero);
  if (layout === "flow_zigzag") return renderZStory(slide, outline, item, page, total);
  if (layout === "problem_impact") return renderComparisonV2(slide, outline, item, page, total);
  if (layout === "outcome_big_number") return renderLayeredFocus(slide, outline, item, page, total);
  if (layout === "method_cards") return renderMethodCardsWithImage(slide, outline, item, page, total);
  if (layout === "case_split") return renderVisualFocus(slide, outline, item, page, total);
  if (layout === "framework_grid") return renderGrid(slide, outline, item, page, total, 5);
  if (layout === "timeline_roadmap") return renderTimelineV2(slide, outline, item, page, total);
  if (layout === "compare_transformation") return renderComparisonV2(slide, outline, item, page, total);
  if (layout === "agenda_steps") return renderTimelineV2(slide, outline, item, page, total);
  if (layout === "visual_focus") return renderVisualFocus(slide, outline, item, page, total);
  if (layout === "z_story") return renderZStory(slide, outline, item, page, total);
  if (layout === "layered_focus") return renderLayeredFocus(slide, outline, item, page, total);
  if (layout === "path_stairs") return renderZStory(slide, outline, item, page, total);
  if (layout === "impact_stack") return renderLayeredFocus(slide, outline, item, page, total);
  if (layout === "result_triptych") return renderGrid(slide, outline, item, page, total, 3);
  if (layout === "method_formula") return renderZStory(slide, outline, item, page, total);
  if (layout === "case_metric_board") return renderVisualFocus(slide, outline, item, page, total);
  if (layout === "layered_pyramid") return renderCards(slide, outline, item, page, total, 3);
  if (layout === "decision_list") return renderCards(slide, outline, item, page, total, 5);
  if (layout === "closing_focus") return renderHeroCenter(slide, outline, item, page, total, true);
  if (layout === "pricing_anchor") return renderComparisonV2(slide, outline, item, page, total);
  if (layout === "proof_wall") return renderGrid(slide, outline, item, page, total, 5);
  if (layout === "strategy_map") return renderZStory(slide, outline, item, page, total);
  if (layout === "sop_vertical") return renderTimelineV2(slide, outline, item, page, total);
  return renderQuoteV2(slide, outline, item, page, total);
}

function withRequiredImages(slides: PptSlide[]) {
  let requiredCount = 0;
  return slides.map((slide, index) => {
    const shouldRequire =
      index === 0 ||
      slide.imageRequired ||
      ["case", "method", "before_after", "goal"].includes(slide.layoutType) ||
      (requiredCount < 3 && index < 6);
    const next = { ...slide, imageRequired: shouldRequire };
    if (shouldRequire) requiredCount += 1;
    return next;
  });
}

export async function buildPptx(outline: PptOutline): Promise<Buffer> {
  applyTheme(outline);

  const pptx = createPptx();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "AI PPT MVP";
  pptx.subject = outline.coreMessage;
  pptx.title = outline.title;
  pptx.company = "AI PPT MVP";
  pptx.theme = {
    headFontFace: FONT,
    bodyFontFace: FONT
  };

  const slides = withRequiredImages(outline.slides.slice(0, 11));
  const layoutPlan = createLayoutPlan(slides, outline);
  console.log(`PPT image requirement: cover=true, requiredSlides=${slides.filter((slide) => slide.imageRequired).length}`);
  for (let index = 0; index < slides.length; index += 1) {
    const slide = pptx.addSlide();
    await renderDesignSlide(slide, outline, slides[index], layoutPlan[index], index + 1, slides.length);
    slide.addNotes(slides[index].speakerNotes);
  }

  const data = await pptx.write({ outputType: "nodebuffer" });
  return Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer);
}

