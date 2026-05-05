export type LayoutType =
  | "flow"
  | "problem"
  | "outcome"
  | "method"
  | "case"
  | "framework"
  | "list"
  | "compare"
  | "timeline";

export type LayoutStructure = "grid" | "split" | "flow" | "zigzag" | "layered";
export type LayoutSize = "large" | "medium" | "small";
export type LayoutAlignment = "left" | "center" | "right" | "alternating";
export type LayoutSpacing = "tight" | "normal" | "loose";

export type LayoutTemplate = {
  name: string;
  type: LayoutType;
  structure: LayoutStructure;
  elements: string[];
  layoutRules: {
    cardSizes: LayoutSize[];
    alignment: LayoutAlignment;
    spacing: LayoutSpacing;
  };
  visualStyle: {
    useGradient: boolean;
    useConnector: boolean;
    useIcon: boolean;
    useBigNumber: boolean;
  };
  colorRules: {
    usePrimary: true;
    useSecondary: true;
    useAccent: true;
  };
};

function template(
  name: string,
  type: LayoutType,
  structure: LayoutStructure,
  elements: string[],
  cardSizes: LayoutSize[],
  alignment: LayoutAlignment,
  spacing: LayoutSpacing,
  visualStyle: LayoutTemplate["visualStyle"]
): LayoutTemplate {
  return {
    name,
    type,
    structure,
    elements,
    layoutRules: { cardSizes, alignment, spacing },
    visualStyle,
    colorRules: {
      usePrimary: true,
      useSecondary: true,
      useAccent: true
    }
  };
}

export const layouts = {
  heroCover: template(
    "Hero Cover",
    "framework",
    "split",
    ["backgroundImage", "headline", "overlay", "accentLine"],
    ["large", "medium", "small"],
    "left",
    "loose",
    { useGradient: true, useConnector: false, useIcon: false, useBigNumber: true }
  ),
  splitTextImage: template(
    "Split Text Image",
    "framework",
    "split",
    ["textStack", "largeImage", "miniCards"],
    ["large", "medium", "small"],
    "left",
    "loose",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: false }
  ),
  threeColumn: template(
    "Three Column",
    "framework",
    "layered",
    ["largeCard", "twoSupportCards", "accentBadges"],
    ["large", "medium", "small"],
    "alternating",
    "normal",
    { useGradient: false, useConnector: true, useIcon: true, useBigNumber: false }
  ),
  timeline: template(
    "Timeline",
    "timeline",
    "flow",
    ["dots", "connector", "stageCards"],
    ["medium", "small", "small"],
    "center",
    "loose",
    { useGradient: false, useConnector: true, useIcon: false, useBigNumber: true }
  ),
  stepCards: template(
    "Step Cards",
    "flow",
    "zigzag",
    ["stepCards", "connector", "numberBadges"],
    ["large", "medium", "small"],
    "alternating",
    "normal",
    { useGradient: false, useConnector: true, useIcon: true, useBigNumber: true }
  ),
  bigStatement: template(
    "Big Statement",
    "outcome",
    "layered",
    ["quote", "bigNumber", "supportCards"],
    ["large", "medium", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: false, useIcon: false, useBigNumber: true }
  ),
  imageHighlight: template(
    "Image Highlight",
    "case",
    "split",
    ["largeImage", "quote", "sideCards"],
    ["large", "medium", "small"],
    "left",
    "loose",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: false }
  ),
  dataGrid: template(
    "Data Grid",
    "framework",
    "grid",
    ["mainMetric", "unevenCards", "accentLine"],
    ["large", "medium", "small"],
    "alternating",
    "normal",
    { useGradient: false, useConnector: true, useIcon: true, useBigNumber: true }
  ),
  quoteHighlight: template(
    "Quote Highlight",
    "outcome",
    "layered",
    ["quote", "sideCards", "gradient"],
    ["large", "medium", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: false, useIcon: false, useBigNumber: true }
  ),
  comparison: template(
    "Comparison",
    "compare",
    "split",
    ["before", "after", "arrow", "divider"],
    ["large", "large", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: true, useIcon: false, useBigNumber: false }
  ),
  flow_zigzag: template(
    "Flow Zigzag",
    "flow",
    "zigzag",
    ["mainCard", "stepCards", "connector", "badge"],
    ["large", "medium", "small"],
    "alternating",
    "loose",
    { useGradient: true, useConnector: true, useIcon: true, useBigNumber: false }
  ),
  problem_impact: template(
    "Problem Impact",
    "problem",
    "split",
    ["problemBlock", "impactBlock", "divider", "badge"],
    ["large", "medium", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: true, useIcon: false, useBigNumber: true }
  ),
  outcome_big_number: template(
    "Outcome Big Number",
    "outcome",
    "layered",
    ["bigNumber", "resultCards", "highlight"],
    ["large", "medium", "small"],
    "left",
    "normal",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: true }
  ),
  method_cards: template(
    "Method Cards",
    "method",
    "layered",
    ["heroCard", "supportCards", "icon", "line"],
    ["large", "medium", "small"],
    "left",
    "normal",
    { useGradient: false, useConnector: true, useIcon: true, useBigNumber: false }
  ),
  case_split: template(
    "Case Split",
    "case",
    "split",
    ["image", "profileCard", "resultCards", "tag"],
    ["large", "medium", "small"],
    "left",
    "loose",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: false }
  ),
  framework_grid: template(
    "Framework Grid",
    "framework",
    "grid",
    ["mainCard", "subCards", "numberBadge", "connector"],
    ["large", "medium", "small"],
    "alternating",
    "normal",
    { useGradient: false, useConnector: true, useIcon: true, useBigNumber: true }
  ),
  timeline_roadmap: template(
    "Timeline Roadmap",
    "timeline",
    "flow",
    ["dots", "connector", "stageCards"],
    ["medium", "small", "small"],
    "center",
    "loose",
    { useGradient: false, useConnector: true, useIcon: false, useBigNumber: true }
  ),
  compare_transformation: template(
    "Compare Transformation",
    "compare",
    "split",
    ["before", "after", "arrow", "divider"],
    ["large", "large", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: true, useIcon: false, useBigNumber: false }
  ),
  hero_left_text_right_image: template(
    "Hero Left Text Right Image",
    "framework",
    "split",
    ["headline", "image", "miniCards"],
    ["large", "medium", "small"],
    "left",
    "loose",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: false }
  ),
  hero_center: template(
    "Hero Center",
    "framework",
    "layered",
    ["headline", "centerImage", "cards"],
    ["large", "medium", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: false, useIcon: false, useBigNumber: true }
  ),
  agenda_steps: template(
    "Agenda Steps",
    "list",
    "flow",
    ["numberedCards", "connector", "sectionTags"],
    ["medium", "small", "small"],
    "center",
    "normal",
    { useGradient: false, useConnector: true, useIcon: true, useBigNumber: true }
  ),
  visual_focus: template(
    "Visual Focus",
    "case",
    "split",
    ["largeImage", "quote", "sideCards"],
    ["large", "medium", "small"],
    "left",
    "loose",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: false }
  ),
  quote_highlight: template(
    "Quote Highlight",
    "outcome",
    "layered",
    ["quote", "sideCards", "gradient"],
    ["large", "medium", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: false, useIcon: false, useBigNumber: true }
  ),
  z_story: template(
    "Z Story",
    "flow",
    "zigzag",
    ["storyCards", "connector", "endPoint"],
    ["large", "medium", "small"],
    "alternating",
    "normal",
    { useGradient: false, useConnector: true, useIcon: true, useBigNumber: false }
  ),
  layered_focus: template(
    "Layered Focus",
    "outcome",
    "layered",
    ["bigNumber", "image", "quote", "cards"],
    ["large", "medium", "small"],
    "left",
    "loose",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: true }
  ),
  path_stairs: template(
    "Path Stairs",
    "flow",
    "zigzag",
    ["stairCards", "connector", "stepNumbers"],
    ["large", "medium", "small"],
    "alternating",
    "normal",
    { useGradient: false, useConnector: true, useIcon: false, useBigNumber: true }
  ),
  impact_stack: template(
    "Impact Stack",
    "problem",
    "layered",
    ["impactCard", "reasonCards", "bigNumber"],
    ["large", "medium", "small"],
    "left",
    "normal",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: true }
  ),
  result_triptych: template(
    "Result Triptych",
    "outcome",
    "grid",
    ["heroMetric", "resultCards", "accentLine"],
    ["large", "medium", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: true, useIcon: true, useBigNumber: true }
  ),
  method_formula: template(
    "Method Formula",
    "method",
    "flow",
    ["formula", "operator", "exampleCards"],
    ["large", "medium", "small"],
    "center",
    "normal",
    { useGradient: false, useConnector: true, useIcon: true, useBigNumber: false }
  ),
  case_metric_board: template(
    "Case Metric Board",
    "case",
    "split",
    ["image", "metric", "proofCards"],
    ["large", "medium", "small"],
    "left",
    "normal",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: true }
  ),
  layered_pyramid: template(
    "Layered Pyramid",
    "framework",
    "layered",
    ["foundation", "middleLayer", "topLayer"],
    ["large", "medium", "small"],
    "center",
    "normal",
    { useGradient: false, useConnector: true, useIcon: false, useBigNumber: true }
  ),
  decision_list: template(
    "Decision List",
    "list",
    "layered",
    ["heroDecision", "checkCards", "tag"],
    ["large", "medium", "small"],
    "left",
    "normal",
    { useGradient: true, useConnector: false, useIcon: true, useBigNumber: false }
  ),
  closing_focus: template(
    "Closing Focus",
    "outcome",
    "layered",
    ["bigCta", "pathCards", "gradient"],
    ["large", "medium", "small"],
    "center",
    "loose",
    { useGradient: true, useConnector: true, useIcon: true, useBigNumber: true }
  ),
  pricing_anchor: template(
    "Pricing Anchor",
    "compare",
    "split",
    ["valueAnchor", "benefitCards", "divider"],
    ["large", "medium", "small"],
    "center",
    "normal",
    { useGradient: true, useConnector: true, useIcon: false, useBigNumber: true }
  ),
  proof_wall: template(
    "Proof Wall",
    "case",
    "grid",
    ["proofImage", "proofCards", "badge"],
    ["large", "medium", "small"],
    "alternating",
    "normal",
    { useGradient: false, useConnector: false, useIcon: true, useBigNumber: true }
  ),
  strategy_map: template(
    "Strategy Map",
    "framework",
    "zigzag",
    ["mapNodes", "connector", "mainCard"],
    ["large", "medium", "small"],
    "alternating",
    "loose",
    { useGradient: true, useConnector: true, useIcon: true, useBigNumber: false }
  ),
  sop_vertical: template(
    "SOP Vertical",
    "timeline",
    "flow",
    ["verticalDots", "line", "stepCards"],
    ["medium", "small", "small"],
    "left",
    "normal",
    { useGradient: false, useConnector: true, useIcon: false, useBigNumber: true }
  )
} as const;

export type DesignLayout = keyof typeof layouts;

export const layoutsByType: Record<LayoutType, DesignLayout[]> = (Object.entries(layouts) as Array<[DesignLayout, LayoutTemplate]>).reduce(
  (acc, [key, value]) => {
    acc[value.type].push(key as DesignLayout);
    return acc;
  },
  {
    flow: [],
    problem: [],
    outcome: [],
    method: [],
    case: [],
    framework: [],
    list: [],
    compare: [],
    timeline: []
  } as Record<LayoutType, DesignLayout[]>
);
