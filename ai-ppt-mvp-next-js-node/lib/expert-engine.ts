import { generateJsonContent, hasAiProviderKey } from "@/lib/ai-provider";
import { matchExpertKnowledge, type ExpertKnowledge, type IndustryConfidence } from "@/lib/expert-knowledge";
import { runGeneralResearch } from "@/lib/expert-knowledge/general-research";
import { pptOutlineJsonSchema } from "@/lib/schema";
import type { PptOutline, PptSlide } from "@/lib/types";

export type ExpertDiagnosis = {
  courseIndustry: string;
  industryName: string;
  expertRole: string;
  targetAudience: string;
  realPainPoints: string[];
  rootCauses: string[];
  hiddenNeeds: string[];
  buyingMotivations: string[];
  trustBarriers: string[];
  desiredTransformation: string[];
  keyStrategies: string[];
  courseAngles: string[];
  expertInsights: string[];
  surfaceProblem: string;
  rootProblem: string;
  emotionalDrivers: string[];
  moneyLogic: string;
  courseMechanism: string;
  transformationPath: string[];
  proofAssets: string[];
  conversionTrigger: string;
  mustAvoid: string[];
  visualKeywords: string[];
  industryConfidence: IndustryConfidence;
};

export type ContentQualityReview = {
  industryExpertiseScore: number;
  specificityScore: number;
  conversionLogicScore: number;
  clarityScore: number;
  hasGenericLanguage: boolean;
  canBeDeliveredToClient: boolean;
  revisionAdvice: string[];
};

export type ExpertEngineInput = {
  topic: string;
  audience: string;
  goal: string;
  requirements: string;
};

function toMutableArray(value: readonly string[] | string[]) {
  return [...value];
}

function pickAudience(input: ExpertEngineInput, fallback: string) {
  return input.audience && input.audience.length >= 2 ? input.audience : fallback;
}

function fromKnowledge(input: ExpertEngineInput, knowledge: ExpertKnowledge, confidence: IndustryConfidence): ExpertDiagnosis {
  return {
    courseIndustry: knowledge.courseIndustry,
    industryName: knowledge.industryName,
    expertRole: knowledge.expertRole,
    targetAudience: pickAudience(input, "该行业目标学员"),
    realPainPoints: toMutableArray(knowledge.realBusinessProblems),
    rootCauses: toMutableArray(knowledge.rootCauses),
    hiddenNeeds: toMutableArray(knowledge.hiddenNeeds),
    buyingMotivations: toMutableArray(knowledge.buyingMotivations),
    trustBarriers: toMutableArray(knowledge.trustBarriers),
    desiredTransformation: toMutableArray(knowledge.transformationPath),
    keyStrategies: toMutableArray(knowledge.keyStrategies),
    courseAngles: toMutableArray(knowledge.courseAngles),
    expertInsights: toMutableArray(knowledge.expertInsights),
    surfaceProblem: knowledge.surfaceProblem,
    rootProblem: knowledge.rootProblem,
    emotionalDrivers: toMutableArray(knowledge.emotionalDrivers),
    moneyLogic: knowledge.moneyLogic,
    courseMechanism: knowledge.courseMechanism,
    transformationPath: toMutableArray(knowledge.transformationPath),
    proofAssets: toMutableArray(knowledge.proofAssets),
    conversionTrigger: knowledge.conversionTrigger,
    mustAvoid: toMutableArray(knowledge.mustAvoid),
    visualKeywords: toMutableArray(knowledge.visualKeywords),
    industryConfidence: confidence
  };
}

export async function resolveExpertDiagnosis(input: ExpertEngineInput): Promise<ExpertDiagnosis> {
  const source = [input.topic, input.audience, input.goal, input.requirements].filter(Boolean).join(" ");
  const matched = matchExpertKnowledge(source);

  if (matched) return fromKnowledge(input, matched.knowledge, matched.confidence);

  const research = await runGeneralResearch(input);
  return {
    courseIndustry: "general_research",
    industryName: research.industryName,
    expertRole: `拥有20年${research.industryName}行业研究、课程设计与用户转化经验的课程顾问。`,
    targetAudience: pickAudience(input, research.inferredAudience),
    realPainPoints: research.realBusinessProblems,
    rootCauses: research.rootCauses,
    hiddenNeeds: research.emotionalDrivers,
    buyingMotivations: research.courseAngles,
    trustBarriers: ["怕内容太泛", "怕没有落地路径", "怕学完用不上"],
    desiredTransformation: research.desiredTransformation,
    keyStrategies: research.courseAngles,
    courseAngles: research.courseAngles,
    expertInsights: research.expertInsights,
    surfaceProblem: research.surfaceProblem,
    rootProblem: research.rootProblem,
    emotionalDrivers: research.emotionalDrivers,
    moneyLogic: research.moneyLogic,
    courseMechanism: research.courseMechanism,
    transformationPath: research.transformationPath,
    proofAssets: research.proofAssets,
    conversionTrigger: research.conversionTrigger,
    mustAvoid: research.mustAvoid,
    visualKeywords: research.visualKeywords,
    industryConfidence: "low"
  };
}

export function buildExpertEnginePrompt(expertDiagnosis: ExpertDiagnosis) {
  return [
    "Expert Engine:",
    "你不是普通PPT生成器。你必须像行业顾问一样先诊断，再设计课程成交结构。",
    `专家角色：${expertDiagnosis.expertRole}`,
    "",
    "expertDiagnosis:",
    JSON.stringify(expertDiagnosis, null, 2),
    "",
    "生成规则：",
    "1. 每页必须基于 expertDiagnosis，不允许只替换行业关键词。",
    "2. 每页必须引用 realPainPoints、rootCauses、keyStrategies、proofAssets 或 expertInsights。",
    "3. expertInsight 必须是行业判断，不是普通描述。",
    "4. decisionValue 必须说明这一页帮助用户做什么报名决策。",
    "5. 内容必须具体到行业动作。",
    "6. 禁止空泛表达：提升能力、打造影响力、实现成功、帮助成长、快速变现、增强信任，除非后面有具体机制。",
    "7. 禁止出现 mustAvoid 中的词和逻辑。",
    "8. 结构必须包含：学前问题 -> 学后改变 -> 方法路径 -> 案例证明 -> 陪跑交付 -> 报名行动。",
    "9. 输出仍保持当前PPT JSON结构；系统会补充 expertInsight 与 imageSearchQuery。"
  ].join("\n");
}

function pick(values: string[], index: number, fallback: string) {
  return values.length ? values[index % values.length] : fallback;
}

function includesAvoidedWord(text: string, mustAvoid: string[]) {
  return mustAvoid.some((word) => word && text.includes(word));
}

function removeAvoidedWords(text: string, diagnosis: ExpertDiagnosis) {
  return diagnosis.mustAvoid.reduce((result, word) => result.replaceAll(word, ""), text || "");
}

function expertInsightFor(diagnosis: ExpertDiagnosis, index: number) {
  const insight = pick(diagnosis.expertInsights, index, "课程必须解决真实场景中的具体阻力。");
  const root = pick(diagnosis.rootCauses, index, diagnosis.rootProblem);
  return `${insight} 底层原因是${root}。`;
}

function imageQueryFor(diagnosis: ExpertDiagnosis, slide: PptSlide, index: number) {
  if (diagnosis.courseIndustry === "yoga_fitness") {
    return pick(["yoga practice", "stretching", "meditation", "pilates", "wellness"], index, "yoga practice");
  }
  return `${pick(diagnosis.visualKeywords, index, "online course")} ${slide.layoutType}`.trim();
}

function hasGenericLanguage(text: string) {
  return ["提升能力", "打造影响力", "实现成功", "帮助成长", "快速变现", "增强信任"].some((word) => text.includes(word));
}

function contentTooGeneric(slide: PptSlide, diagnosis: ExpertDiagnosis) {
  const joined = [slide.slideTitle, slide.subtitle, slide.keyMessage, slide.expandedExplanation, ...slide.coreContent].join(" ");
  const signals = [...diagnosis.realPainPoints, ...diagnosis.rootCauses, ...diagnosis.keyStrategies, ...diagnosis.proofAssets];
  return !signals.some((signal) => signal && joined.includes(signal.slice(0, Math.min(4, signal.length)))) || hasGenericLanguage(joined);
}

function rewriteGenericSlide(slide: PptSlide, diagnosis: ExpertDiagnosis, index: number): PptSlide {
  const pain = pick(diagnosis.realPainPoints, index, diagnosis.surfaceProblem);
  const cause = pick(diagnosis.rootCauses, index, diagnosis.rootProblem);
  const strategy = pick(diagnosis.keyStrategies, index, diagnosis.courseMechanism);
  const proof = pick(diagnosis.proofAssets, index, "学习反馈记录");
  const transformation = pick(diagnosis.transformationPath, index, diagnosis.conversionTrigger);

  return {
    ...slide,
    slideTitle: pain,
    subtitle: cause,
    keyMessage: transformation,
    coreContent: [pain, cause, strategy, proof].slice(0, Math.max(3, Math.min(4, slide.coreContent.length || 4))),
    expandedExplanation: `${pain}背后不是单点问题，而是${cause}。`,
    decisionValue: "相信课程能解决真实问题",
    visualSuggestion: pick(diagnosis.visualKeywords, index, slide.visualSuggestion)
  };
}

function optimizeSlide(slide: PptSlide, diagnosis: ExpertDiagnosis, index: number): PptSlide {
  const joined = [
    slide.slideTitle,
    slide.subtitle,
    slide.keyMessage,
    slide.expandedExplanation,
    slide.decisionValue,
    slide.visualSuggestion,
    slide.speakerNotes,
    ...slide.coreContent
  ].join(" ");
  const base = includesAvoidedWord(joined, diagnosis.mustAvoid) || contentTooGeneric(slide, diagnosis)
    ? rewriteGenericSlide(slide, diagnosis, index)
    : slide;

  return {
    ...base,
    slideTitle: removeAvoidedWords(base.slideTitle, diagnosis),
    subtitle: removeAvoidedWords(base.subtitle, diagnosis),
    keyMessage: removeAvoidedWords(base.keyMessage, diagnosis),
    coreContent: base.coreContent.map((item) => removeAvoidedWords(item, diagnosis)),
    expandedExplanation: removeAvoidedWords(base.expandedExplanation, diagnosis),
    decisionValue: removeAvoidedWords(base.decisionValue, diagnosis),
    visualSuggestion: removeAvoidedWords(base.visualSuggestion, diagnosis),
    speakerNotes: removeAvoidedWords(base.speakerNotes, diagnosis),
    expertInsight: expertInsightFor(diagnosis, index),
    imageSearchQuery: imageQueryFor(diagnosis, base, index)
  };
}

export function selfReviewAndOptimizeOutline(outline: PptOutline, expertDiagnosis: ExpertDiagnosis): PptOutline {
  return {
    ...outline,
    title: removeAvoidedWords(outline.title, expertDiagnosis),
    subtitle: removeAvoidedWords(outline.subtitle, expertDiagnosis),
    coreMessage: removeAvoidedWords(outline.coreMessage, expertDiagnosis),
    expertDiagnosis,
    slides: outline.slides.map((slide, index) => optimizeSlide(slide, expertDiagnosis, index))
  };
}

function fallbackQualityReview(outline: PptOutline, expertDiagnosis: ExpertDiagnosis): ContentQualityReview {
  const text = JSON.stringify(outline);
  const avoided = includesAvoidedWord(text, expertDiagnosis.mustAvoid);
  const generic = hasGenericLanguage(text);
  const signals = [...expertDiagnosis.realPainPoints, ...expertDiagnosis.keyStrategies, ...expertDiagnosis.proofAssets];
  const signalCount = signals.filter((signal) => signal && text.includes(signal.slice(0, Math.min(4, signal.length)))).length;
  const score = Math.min(10, Math.max(5, 6 + signalCount));

  return {
    industryExpertiseScore: avoided ? 5 : score,
    specificityScore: generic ? 6 : score,
    conversionLogicScore: text.includes(expertDiagnosis.conversionTrigger.slice(0, 4)) ? 9 : 7,
    clarityScore: 8,
    hasGenericLanguage: generic,
    canBeDeliveredToClient: !avoided && !generic && signalCount >= 2,
    revisionAdvice: avoided ? ["移除错误行业词"] : generic ? ["替换空泛表达为行业动作"] : []
  };
}

export function shouldRewrite(review: ContentQualityReview) {
  return (
    review.industryExpertiseScore < 8 ||
    review.specificityScore < 8 ||
    review.conversionLogicScore < 8 ||
    review.clarityScore < 8 ||
    review.hasGenericLanguage ||
    !review.canBeDeliveredToClient
  );
}

export async function reviewOutlineQuality(outline: PptOutline, expertDiagnosis: ExpertDiagnosis): Promise<ContentQualityReview> {
  if (!hasAiProviderKey()) return fallbackQualityReview(outline, expertDiagnosis);

  try {
    const output = await generateJsonContent({
      instructions: [
        "你是课程PPT内容总监，请严格评估这份PPT是否可直接交付客户。",
        "只返回JSON。分数必须严格，空泛就低于8分。",
        "如果出现 mustAvoid 词，industryExpertiseScore 必须低于8。"
      ].join("\n"),
      input: JSON.stringify({ expertDiagnosis, outline }, null, 2),
      schema: {
          name: "ppt_quality_review",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "industryExpertiseScore",
              "specificityScore",
              "conversionLogicScore",
              "clarityScore",
              "hasGenericLanguage",
              "canBeDeliveredToClient",
              "revisionAdvice"
            ],
            properties: {
              industryExpertiseScore: { type: "number" },
              specificityScore: { type: "number" },
              conversionLogicScore: { type: "number" },
              clarityScore: { type: "number" },
              hasGenericLanguage: { type: "boolean" },
              canBeDeliveredToClient: { type: "boolean" },
              revisionAdvice: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 8 }
            }
          }
      }
    });
    return JSON.parse(output) as ContentQualityReview;
  } catch {
    return fallbackQualityReview(outline, expertDiagnosis);
  }
}

export async function rewriteOutlineWithExpertReview(
  outline: PptOutline,
  expertDiagnosis: ExpertDiagnosis,
  review: ContentQualityReview
): Promise<PptOutline> {
  if (!hasAiProviderKey()) return selfReviewAndOptimizeOutline(outline, expertDiagnosis);

  try {
    const output = await generateJsonContent({
      instructions: [
        "你是行业专家型课程PPT主笔。请根据专家诊断和自评意见，重写PPT JSON。",
        "必须更具体、更像行业顾问方案。",
        "每页必须包含行业真实动作、用户心理、证明材料或解决策略。",
        "禁止出现 mustAvoid 中的词。",
        "保留原 JSON schema，不要添加 schema 之外字段。"
      ].join("\n"),
      input: JSON.stringify({ expertDiagnosis, review, outline }, null, 2),
      schema: pptOutlineJsonSchema
    });
    return selfReviewAndOptimizeOutline(JSON.parse(output) as PptOutline, expertDiagnosis);
  } catch {
    return selfReviewAndOptimizeOutline(outline, expertDiagnosis);
  }
}
