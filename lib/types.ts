export type PptType = "investment" | "course" | "event";
export type StylePreset = "auto" | "business" | "luxury" | "wellness" | "dynamic" | "playful";
export type ColorPalette =
  | "navy_gold"
  | "graphite_blue"
  | "executive_grey"
  | "black_white"
  | "deep_green"
  | "champagne_gold"
  | "cream_rose"
  | "black_gold"
  | "pearl_white"
  | "mocha_brown"
  | "sage_green"
  | "soft_mint"
  | "warm_beige"
  | "natural_clay"
  | "calm_blue"
  | "electric_blue"
  | "neon_purple"
  | "dark_tech"
  | "orange_energy"
  | "cyber_green"
  | "candy_pastel"
  | "kids_bright"
  | "sky_yellow"
  | "peach_mint"
  | "cartoon_blue";
export type OutputLanguage = "zh" | "en" | "bilingual";
export type InputMode = "auto" | "standard" | "document";

export type LayoutType =
  | "cover"
  | "agenda"
  | "goal"
  | "problem_matrix"
  | "before_after"
  | "three_engines"
  | "timeline"
  | "method"
  | "case"
  | "sop"
  | "pricing"
  | "closing";

export type GeneratePptRequest = {
  pptType: PptType;
  inputMode?: InputMode;
  deepResearch?: boolean;
  stylePreset?: StylePreset;
  colorPalette?: ColorPalette;
  outputLanguage?: OutputLanguage;
  topic: string;
  audience: string;
  goal: string;
  tone: string;
  slideCount: number;
  requirements?: string;
  autoModeContext?: AutoModeContext;
  industryResearch?: IndustryResearch;
};

export type AutoModeContext = {
  pptType: PptType;
  industry: string;
  coreGoal: string;
  targetAudience: string;
  painPoints: string[];
  desirePoints: string[];
  trustBarriers: string[];
  sellingPoints: string[];
  courseFramework: string[];
  commercialLogic: string[];
  caseAngles: string[];
  solutionFramework: string[];
  visualKeywords: string[];
};

export type IndustryResearch = {
  pptType: PptType;
  industry: string;
  targetAudience: string;
  marketContext: string;
  painPoints: string[];
  desirePoints: string[];
  buyingMotivations: string[];
  trustBarriers: string[];
  caseAngles: string[];
  solutionFramework: string[];
  courseFramework: string[];
  commercialLogic: string[];
  visualKeywords: string[];
  mustInclude: string[];
  mustAvoid: string[];
};

export type PptSlide = {
  moduleKey?: string;
  slideTitle: string;
  subtitle: string;
  keyMessage: string;
  sectionLabel: string;
  coreContent: string[];
  expandedExplanation: string;
  expertInsight: string;
  decisionValue: string;
  visualSuggestion: string;
  imagePrompt: string;
  imageQuery?: string;
  imageRequired?: boolean;
  imageSearchQuery: string;
  imageSearchUrl: string;
  speakerNotes: string;
  layoutType: LayoutType;
};

export type PptOutline = {
  title: string;
  subtitle: string;
  type: PptType;
  audience: string;
  coreMessage: string;
  stylePreset?: StylePreset;
  colorPalette?: ColorPalette;
  outputLanguage?: OutputLanguage;
  expertDiagnosis?: unknown;
  qualityReview?: unknown;
  autoModeContext?: AutoModeContext;
  industryResearch?: IndustryResearch;
  slides: PptSlide[];
};
