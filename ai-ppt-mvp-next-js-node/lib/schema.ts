import { z } from "zod";
import type { AutoModeContext, IndustryResearch } from "@/lib/types";

const layoutTypeValues = [
  "cover",
  "agenda",
  "goal",
  "problem_matrix",
  "before_after",
  "three_engines",
  "timeline",
  "method",
  "case",
  "sop",
  "pricing",
  "closing"
] as const;

const colorPaletteValues = [
  "navy_gold",
  "graphite_blue",
  "executive_grey",
  "black_white",
  "deep_green",
  "champagne_gold",
  "cream_rose",
  "black_gold",
  "pearl_white",
  "mocha_brown",
  "sage_green",
  "soft_mint",
  "warm_beige",
  "natural_clay",
  "calm_blue",
  "electric_blue",
  "neon_purple",
  "dark_tech",
  "orange_energy",
  "cyber_green",
  "candy_pastel",
  "kids_bright",
  "sky_yellow",
  "peach_mint",
  "cartoon_blue"
] as const;

export const generatePptRequestSchema = z.object({
  pptType: z.enum(["investment", "course", "event"]),
  inputMode: z.enum(["auto", "standard", "document"]).optional().default("standard"),
  deepResearch: z.boolean().optional().default(false),
  stylePreset: z.enum(["auto", "business", "luxury", "wellness", "dynamic", "playful"]).optional().default("auto"),
  colorPalette: z.enum(colorPaletteValues).optional(),
  outputLanguage: z.enum(["zh", "en", "bilingual"]).optional().default("zh"),
  topic: z.string().min(2).max(120),
  audience: z.string().min(2).max(120),
  goal: z.string().min(2).max(240),
  tone: z.string().min(2).max(120),
  slideCount: z.coerce.number().int().min(5).max(15),
  requirements: z.string().max(24000).optional().default(""),
  autoModeContext: z.custom<AutoModeContext>().optional(),
  industryResearch: z.custom<IndustryResearch>().optional()
});

export const pptSlideSchema = z.object({
  moduleKey: z.string().max(40).optional(),
  slideTitle: z.string().min(1).max(36),
  subtitle: z.string().min(1).max(42),
  keyMessage: z.string().min(1).max(48),
  sectionLabel: z.string().min(1).max(20),
  coreContent: z.array(z.string().min(1).max(42)).min(3).max(6),
  expandedExplanation: z.string().min(1).max(90),
  expertInsight: z.string().min(1).max(120),
  decisionValue: z.string().min(1).max(52),
  visualSuggestion: z.string().min(1).max(60),
  imagePrompt: z.string().min(1).max(120),
  imageQuery: z.string().max(100).optional(),
  imageRequired: z.boolean().optional(),
  imageSearchQuery: z.string().min(1).max(100),
  imageSearchUrl: z.string().url().max(180),
  speakerNotes: z.string().min(1).max(220),
  layoutType: z.enum(layoutTypeValues)
});

export const pptOutlineSchema = z.object({
  title: z.string().min(1).max(40),
  subtitle: z.string().min(1).max(52),
  type: z.enum(["investment", "course", "event"]),
  audience: z.string().min(1),
  coreMessage: z.string().min(1).max(60),
  stylePreset: z.enum(["auto", "business", "luxury", "wellness", "dynamic", "playful"]).optional().default("auto"),
  colorPalette: z.enum(colorPaletteValues).optional(),
  outputLanguage: z.enum(["zh", "en", "bilingual"]).optional().default("zh"),
  expertDiagnosis: z.unknown().optional(),
  qualityReview: z.unknown().optional(),
  autoModeContext: z.custom<AutoModeContext>().optional(),
  industryResearch: z.custom<IndustryResearch>().optional(),
  slides: z.array(pptSlideSchema).min(8).max(15)
});

export const generatePptFileRequestSchema = z.object({
  outline: pptOutlineSchema,
  generationId: z.string().uuid().nullable().optional().default(null)
});

export const pptOutlineJsonSchema = {
  name: "consulting_course_ppt_outline",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "subtitle", "type", "audience", "coreMessage", "slides"],
    properties: {
      title: { type: "string" },
      subtitle: { type: "string" },
      type: { type: "string", enum: ["investment", "course", "event"] },
      audience: { type: "string" },
      coreMessage: { type: "string" },
      slides: {
        type: "array",
        minItems: 8,
        maxItems: 15,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "moduleKey",
            "slideTitle",
            "subtitle",
            "keyMessage",
            "sectionLabel",
            "coreContent",
            "expandedExplanation",
            "expertInsight",
            "decisionValue",
            "visualSuggestion",
            "imagePrompt",
            "imageQuery",
            "imageRequired",
            "imageSearchQuery",
            "imageSearchUrl",
            "speakerNotes",
            "layoutType"
          ],
          properties: {
            moduleKey: { type: "string" },
            slideTitle: { type: "string" },
            subtitle: { type: "string" },
            keyMessage: { type: "string" },
            sectionLabel: { type: "string" },
            coreContent: {
              type: "array",
              minItems: 3,
              maxItems: 6,
              items: { type: "string" }
            },
            expandedExplanation: { type: "string" },
            expertInsight: { type: "string" },
            decisionValue: { type: "string" },
            visualSuggestion: { type: "string" },
            imagePrompt: { type: "string" },
            imageQuery: { type: "string" },
            imageRequired: { type: "boolean" },
            imageSearchQuery: { type: "string" },
            imageSearchUrl: { type: "string" },
            speakerNotes: { type: "string" },
            layoutType: {
              type: "string",
              enum: [
                "cover",
                "agenda",
                "goal",
                "problem_matrix",
                "before_after",
                "three_engines",
                "timeline",
                "method",
                "case",
                "sop",
                "pricing",
                "closing"
              ]
            }
          }
        }
      }
    }
  }
} as const;
