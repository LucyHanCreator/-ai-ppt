import { NextRequest, NextResponse } from "next/server";
import { generateJsonContent, hasAiProviderKey } from "@/lib/ai-provider";
import type { PptType } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const buildPromptSchema = {
  name: "ppt_prompt_builder",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["promptText"],
    properties: {
      promptText: { type: "string" }
    }
  }
} as const;

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePptType(value: unknown): PptType {
  const text = asText(value);
  if (text === "investment" || text === "event" || text === "course") return text;
  return "course";
}

function pptTypeLogic(type: PptType) {
  if (type === "investment") {
    return "Use investment and partnership logic: project positioning, market pain, market opportunity, business model, profit model, competitive edge, cooperation model, ROI, and next action.";
  }

  if (type === "event") {
    return "Use event planning and promotion logic: event positioning, audience, highlights, agenda, guests/resources, communication value, cooperation rights, sponsorship package, and next action.";
  }

  return "Use course conversion logic: learner pain, cognitive upgrade, course value, learning path, methods, case proof, delivery mechanism, pricing benefits, and enrollment action.";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!hasAiProviderKey()) {
    return NextResponse.json({ error: process.env.MODEL_PROVIDER === "kimi" ? "Missing KIMI_API_KEY" : "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const pptType = normalizePptType((body as { pptType?: unknown }).pptType);
  const targetAudience = asText((body as { targetAudience?: unknown }).targetAudience);
  const desiredAction = asText((body as { desiredAction?: unknown }).desiredAction);
  const keySellingPoints = asText((body as { keySellingPoints?: unknown }).keySellingPoints);
  const mustInclude = asText((body as { mustInclude?: unknown }).mustInclude);
  const outputLanguage = asText((body as { outputLanguage?: unknown }).outputLanguage) || "zh";

  if (!targetAudience || !desiredAction || !keySellingPoints) {
    return NextResponse.json({ error: "Missing required prompt inputs." }, { status: 400 });
  }

  const instructions = [
    "Return only JSON matching the schema.",
    outputLanguage === "en" ? "Write promptText in English." : outputLanguage === "bilingual" ? "Write promptText mainly in Chinese with concise English support." : "Write promptText in Simplified Chinese.",
    "You are an AI prompt strategist for a premium PPT generator.",
    "Build a high-quality prompt that the user can paste into a PPT generator.",
    "The promptText must be structured, specific, and not too short.",
    "It must include all user-provided key information.",
    "It must not be generic.",
    pptTypeLogic(pptType)
  ].join("\n");

  const input = [
    `pptType: ${pptType}`,
    `targetAudience: ${targetAudience}`,
    `desiredAction: ${desiredAction}`,
    `keySellingPoints: ${keySellingPoints}`,
    `mustInclude: ${mustInclude || "none"}`
  ].join("\n");

  try {
    const output = await generateJsonContent({
      instructions,
      input,
      schema: buildPromptSchema
    });
    const parsed = JSON.parse(output) as { promptText?: string };
    return NextResponse.json({ promptText: parsed.promptText || "" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to build prompt.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

