import { layouts, layoutsByType, type DesignLayout, type LayoutType } from "@/lib/layouts";
import type { PptOutline, PptSlide, StylePreset } from "@/lib/types";

export type ContentType = "cover" | "process" | "steps" | "comparison" | "image" | "statement" | "data" | "quote";

type ResolvedStyle = Exclude<StylePreset, "auto">;

export const layoutTypes = [
  "heroCover",
  "splitTextImage",
  "threeColumn",
  "timeline",
  "stepCards",
  "bigStatement",
  "imageHighlight",
  "dataGrid",
  "quoteHighlight",
  "comparison"
] as const satisfies readonly DesignLayout[];

export const styleLayouts: Record<ResolvedStyle, DesignLayout[]> = {
  business: ["threeColumn", "timeline", "dataGrid", "comparison"],
  luxury: ["heroCover", "imageHighlight", "bigStatement"],
  wellness: ["splitTextImage", "quoteHighlight", "stepCards"],
  dynamic: ["timeline", "stepCards", "bigStatement"],
  playful: ["threeColumn", "stepCards", "imageHighlight"]
};

const contentLayoutCandidates: Record<ContentType, DesignLayout[]> = {
  cover: ["heroCover"],
  process: ["timeline", "stepCards", "splitTextImage"],
  steps: ["stepCards", "timeline", "threeColumn"],
  comparison: ["comparison", "bigStatement", "dataGrid"],
  image: ["imageHighlight", "splitTextImage", "heroCover"],
  statement: ["bigStatement", "quoteHighlight", "imageHighlight"],
  data: ["dataGrid", "threeColumn", "comparison"],
  quote: ["quoteHighlight", "bigStatement", "splitTextImage"]
};

const legacyBlockLayoutPools: Record<string, DesignLayout[]> = {
  problem: ["problem_impact", "impact_stack", "compare_transformation"],
  steps: ["flow_zigzag", "timeline_roadmap", "path_stairs", "agenda_steps", "sop_vertical", "z_story"],
  benefits: ["outcome_big_number", "result_triptych", "layered_focus", "quote_highlight", "closing_focus"],
  cases: ["case_split", "case_metric_board", "visual_focus", "proof_wall"],
  methods: ["method_cards", "method_formula", "framework_grid", "strategy_map"],
  compare: ["compare_transformation", "pricing_anchor", "problem_impact"],
  list: ["decision_list", "agenda_steps", "framework_grid", "closing_focus"],
  framework: ["framework_grid", "layered_pyramid", "hero_left_text_right_image", "hero_center", "strategy_map"]
};

const fallbackByTemplateType: Record<LayoutType, DesignLayout[]> = layoutsByType;
const allLayouts = Object.keys(layouts) as DesignLayout[];

function hashString(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRandom(seed: number) {
  let value = seed || 1;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function unique(items: DesignLayout[]) {
  return Array.from(new Set(items));
}

function resolveStylePreset(outline: PptOutline): ResolvedStyle {
  if (outline.stylePreset && outline.stylePreset !== "auto") return outline.stylePreset;

  const industry = JSON.stringify({
    title: outline.title,
    audience: outline.audience,
    research: outline.industryResearch,
    diagnosis: outline.expertDiagnosis
  }).toLowerCase();

  if (industry.includes("yoga") || industry.includes("fitness") || industry.includes("wellness") || industry.includes("瑜伽") || industry.includes("普拉提")) return "wellness";
  if (industry.includes("beauty") || industry.includes("skincare") || industry.includes("美业") || industry.includes("美容")) return "luxury";
  if (industry.includes("short_video") || industry.includes("短视频") || industry.includes("抖音") || industry.includes("tiktok")) return "dynamic";
  if (industry.includes("kids") || industry.includes("children") || industry.includes("儿童") || industry.includes("少儿")) return "playful";

  return "business";
}

function contentTypeForSlide(slide: PptSlide, index: number): ContentType {
  if (index === 0 || slide.layoutType === "cover") return "cover";
  if (["timeline", "sop", "agenda"].includes(slide.layoutType)) return "process";
  if (["method", "three_engines"].includes(slide.layoutType)) return "steps";
  if (["before_after", "pricing", "problem_matrix"].includes(slide.layoutType)) return "comparison";
  if (["case"].includes(slide.layoutType) || slide.imageRequired) return "image";
  if (["goal", "closing"].includes(slide.layoutType)) return "statement";
  if (slide.coreContent.length >= 5) return "data";
  if (slide.keyMessage.length > 0) return "quote";
  return "data";
}

function legacyBlockForSlide(slide: PptSlide): keyof typeof legacyBlockLayoutPools {
  const map: Record<string, keyof typeof legacyBlockLayoutPools> = {
    agenda: "steps",
    goal: "benefits",
    problem_matrix: "problem",
    before_after: "compare",
    three_engines: "methods",
    timeline: "steps",
    method: "methods",
    case: "cases",
    sop: "steps",
    pricing: "compare",
    closing: "benefits"
  };
  return map[slide.layoutType] || "framework";
}

function candidatesFor(contentType: ContentType, style: ResolvedStyle, slide: PptSlide): DesignLayout[] {
  if (contentType === "cover") return ["heroCover"];

  const stylePool = styleLayouts[style];
  const contentPool = contentLayoutCandidates[contentType];
  const styleMatches = contentPool.filter((layout) => stylePool.includes(layout));
  const mixed = styleMatches.length >= 2 ? styleMatches : [...styleMatches, ...stylePool, ...contentPool];
  const legacy = legacyBlockLayoutPools[legacyBlockForSlide(slide)] || [];
  return unique([...mixed, ...legacy]);
}

function chooseLayout(
  candidates: DesignLayout[],
  previous: DesignLayout | undefined,
  nextUsed: Set<DesignLayout>,
  random: () => number
): DesignLayout {
  const fresh = candidates.filter((layout) => layout !== previous && !nextUsed.has(layout));
  if (fresh.length > 0) return shuffle(fresh, random)[0];

  const nonAdjacent = candidates.filter((layout) => layout !== previous);
  if (nonAdjacent.length > 0) return shuffle(nonAdjacent, random)[0];

  return candidates[0] || "dataGrid";
}

function fallbackDiversityPool(style: ResolvedStyle) {
  return unique([...styleLayouts[style], ...layoutTypes, ...allLayouts]);
}

function enforceMinimumDiversity(plan: DesignLayout[], style: ResolvedStyle, random: () => number) {
  if (plan.length < 3) return plan;

  const next = [...plan];
  const diversityPool = shuffle(fallbackDiversityPool(style).filter((layout) => layout !== "heroCover"), random);
  let uniqueCount = new Set(next).size;

  for (let index = 1; index < next.length && uniqueCount < 3; index += 1) {
    const replacement = diversityPool.find((layout) => layout !== next[index - 1] && layout !== next[index + 1] && !next.includes(layout));
    if (replacement) {
      next[index] = replacement;
      uniqueCount = new Set(next).size;
    }
  }

  return next;
}

export function pickLayout(contentType: ContentType, outline: PptOutline, slide: PptSlide, previous?: DesignLayout, used = new Set<DesignLayout>()): DesignLayout {
  const style = resolveStylePreset(outline);
  const seed = hashString(`${outline.title}|${slide.slideTitle}|${contentType}|${Date.now()}`);
  const random = createRandom(seed);
  return chooseLayout(candidatesFor(contentType, style, slide), previous, used, random);
}

export function createLayoutPlan(slides: PptSlide[], outline: PptOutline) {
  const style = resolveStylePreset(outline);
  const seed = hashString(`${outline.title}|${outline.subtitle}|${slides.length}|${Date.now()}`);
  const random = createRandom(seed);
  const plan: DesignLayout[] = [];
  let used = new Set<DesignLayout>();

  for (let index = 0; index < slides.length; index += 1) {
    const slide = slides[index];
    const contentType = contentTypeForSlide(slide, index);
    const candidates = candidatesFor(contentType, style, slide);
    const layout = chooseLayout(candidates, plan.at(-1), used, random);
    plan.push(layout);
    used.add(layout);

    if (used.size >= Math.min(7, allLayouts.length)) {
      used = new Set<DesignLayout>([layout]);
    }
  }

  const diversified = enforceMinimumDiversity(plan, style, random);
  console.log(`Layout style=${style}; plan=${diversified.join(", ")}`);
  return diversified;
}
