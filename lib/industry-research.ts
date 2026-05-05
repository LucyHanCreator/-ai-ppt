import { generateJsonContent, hasAiProviderKey } from "@/lib/ai-provider";
import { matchExpertKnowledge, type ExpertKnowledge, type IndustryConfidence } from "@/lib/expert-knowledge";
import type { IndustryResearch, OutputLanguage, PptOutline, PptType } from "@/lib/types";

type BuildIndustryResearchInput = {
  userInput: string;
  pptType: PptType;
  industry?: string;
  outputLanguage?: OutputLanguage;
  deepResearch?: boolean;
};

const industryResearchSchema = {
  name: "industry_research",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "pptType",
      "industry",
      "targetAudience",
      "marketContext",
      "painPoints",
      "desirePoints",
      "buyingMotivations",
      "trustBarriers",
      "caseAngles",
      "solutionFramework",
      "courseFramework",
      "commercialLogic",
      "visualKeywords",
      "mustInclude",
      "mustAvoid"
    ],
    properties: {
      pptType: { type: "string", enum: ["course", "investment", "event"] },
      industry: { type: "string" },
      targetAudience: { type: "string" },
      marketContext: { type: "string" },
      painPoints: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      desirePoints: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      buyingMotivations: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      trustBarriers: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      caseAngles: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
      solutionFramework: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      courseFramework: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 8 },
      commercialLogic: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 8 },
      visualKeywords: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      mustInclude: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 10 },
      mustAvoid: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 12 }
    }
  }
} as const;

function clean(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function unique(values: Array<string | undefined | null>) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const item = clean(value || "");
    const key = item.toLowerCase();
    if (!item || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

function extractMustInclude(userInput: string) {
  const text = clean(userInput);
  const shortPhrases = text
    .split(/[\n,，。；;、|/]+/)
    .map((item) => clean(item))
    .filter((item) => item.length >= 2 && item.length <= 36);
  const signalPhrases = shortPhrases.filter((item) =>
    /AI|导师|工具|拍摄|剪辑|表达|成交|陪跑|案例|权益|课程|活动|招商|增长|转化|获客|复购|SOP|[0-9]/i.test(item)
  );
  const quoted = Array.from(text.matchAll(/[“"']([^“”"']{2,32})[”"']/g)).map((match) => match[1]);

  return unique([...signalPhrases, ...quoted, ...shortPhrases]).slice(0, 10);
}

function fallbackMustInclude(userInput: string, pptType: PptType) {
  const extracted = extractMustInclude(userInput);
  if (extracted.length) return extracted;
  if (userInput.length >= 2 && userInput.length <= 40) return [userInput];
  return pptType === "course" ? ["课程主题", "学习结果"] : ["项目主题", "核心价值"];
}

function localResearchFromKnowledge(input: BuildIndustryResearchInput, knowledge: ExpertKnowledge): IndustryResearch {
  const mustInclude = fallbackMustInclude(input.userInput, input.pptType);
  const courseFramework =
    input.pptType === "course"
      ? unique([...knowledge.courseAngles, ...knowledge.transformationPath, knowledge.courseMechanism]).slice(0, 8)
      : [];
  const commercialLogic =
    input.pptType !== "course"
      ? unique([...knowledge.buyingMotivations, knowledge.moneyLogic, knowledge.conversionTrigger, ...knowledge.keyStrategies]).slice(0, 8)
      : [];

  return {
    pptType: input.pptType,
    industry: knowledge.courseIndustry,
    targetAudience: clean(input.userInput).slice(0, 90) || knowledge.industryName,
    marketContext: knowledge.expertInsights[0] || knowledge.rootProblem || `${knowledge.industryName} needs a more specific decision path.`,
    painPoints: unique([knowledge.surfaceProblem, ...knowledge.realBusinessProblems, ...knowledge.rootCauses]).slice(0, 8),
    desirePoints: unique([...knowledge.hiddenNeeds, ...knowledge.emotionalDrivers, ...knowledge.transformationPath]).slice(0, 8),
    buyingMotivations: unique([...knowledge.buyingMotivations, knowledge.moneyLogic, knowledge.conversionTrigger]).slice(0, 8),
    trustBarriers: unique([...knowledge.trustBarriers]).slice(0, 8),
    caseAngles: unique([...knowledge.proofAssets, ...knowledge.courseAngles]).slice(0, 6),
    solutionFramework: unique([...knowledge.keyStrategies, knowledge.courseMechanism, ...knowledge.expertInsights]).slice(0, 8),
    courseFramework,
    commercialLogic,
    visualKeywords: unique([...knowledge.visualKeywords]).slice(0, 8),
    mustInclude,
    mustAvoid: unique([...knowledge.mustAvoid]).slice(0, 12)
  };
}

function shouldUseAiResearch(input: BuildIndustryResearchInput, confidence: IndustryConfidence | "low") {
  const asksForResearch = /搜索|最新|趋势|市场信息|行业趋势|行业研究|research|trend|market/i.test(input.userInput);
  return Boolean(input.deepResearch || confidence === "low" || clean(input.userInput).length < 40 || asksForResearch);
}

function fallbackResearch(input: BuildIndustryResearchInput, localResearch?: IndustryResearch): IndustryResearch {
  if (localResearch) return localResearch;

  const mustInclude = fallbackMustInclude(input.userInput, input.pptType);
  return {
    pptType: input.pptType,
    industry: input.industry || "general_industry",
    targetAudience: "目标用户",
    marketContext: "用户需要一套结构清晰、证据充分、能推动决策的方案。",
    painPoints: ["需求不清晰", "判断依据不足", "行动路径模糊"],
    desirePoints: ["看清可获得的结果", "降低决策风险", "获得可执行路径"],
    buyingMotivations: ["相信方案能落地", "看见案例和机制", "获得清晰交付"],
    trustBarriers: ["担心内容空泛", "担心无法执行", "担心投入回报不清晰"],
    caseAngles: ["典型用户前后变化", "执行过程拆解", "结果证明材料"],
    solutionFramework: ["问题诊断", "方法路径", "执行机制", "结果复盘"],
    courseFramework: input.pptType === "course" ? ["痛点放大", "结果对比", "方法训练", "案例证明", "陪跑交付"] : [],
    commercialLogic: input.pptType !== "course" ? ["价值证明", "权益设计", "合作路径", "行动转化"] : [],
    visualKeywords: ["business presentation", "strategy workshop", "professional team"],
    mustInclude,
    mustAvoid: ["空泛口号", "夸张承诺", "无依据数据"]
  };
}

function buildResearchInstructions(input: BuildIndustryResearchInput, localResearch?: IndustryResearch) {
  const languageRule =
    input.outputLanguage === "en"
      ? "Write every field in native business English."
      : input.outputLanguage === "bilingual"
        ? "Write fields primarily in Simplified Chinese with concise English support where useful."
        : "Write every field in Simplified Chinese.";

  return [
    "You are an industry researcher, business consultant, and course product manager.",
    "Research the industry first. Do not write PPT slides.",
    "Extract: target users, real pain points, desire points, buying motivations, trust barriers, case angles, solution frameworks, course frameworks, commercial logic, visual keywords, mustInclude, and mustAvoid.",
    "Priority rule: user original input > industry research > fixed PPT structure > AI supplement.",
    "User-mentioned facts, phrases, people, tools, modules, numbers, and selling points must be copied into mustInclude.",
    "Do not force short-video, sales, or course logic into unrelated industries.",
    "If web search is unavailable, use careful model-based industry research and do not claim fresh market data.",
    languageRule,
    localResearch ? `Local expert knowledge reference:\n${JSON.stringify(localResearch, null, 2)}` : "No local expert match. Infer the industry carefully from user input."
  ].join("\n");
}

export async function buildIndustryResearch(input: BuildIndustryResearchInput): Promise<IndustryResearch> {
  const matched = matchExpertKnowledge([input.industry, input.userInput].filter(Boolean).join(" "));
  const localResearch = matched ? localResearchFromKnowledge(input, matched.knowledge) : undefined;
  const confidence = matched?.confidence || "low";

  if (localResearch && !shouldUseAiResearch(input, confidence)) {
    return localResearch;
  }

  if (!hasAiProviderKey()) {
    return fallbackResearch(input, localResearch);
  }

  const output = await generateJsonContent({
    instructions: buildResearchInstructions(input, localResearch),
    input: JSON.stringify(
      {
        userInput: input.userInput,
        pptType: input.pptType,
        industryHint: input.industry || localResearch?.industry || "unknown",
        deepResearch: Boolean(input.deepResearch)
      },
      null,
      2
    ),
    schema: industryResearchSchema
  });
  const parsed = JSON.parse(output) as IndustryResearch;

  return {
    ...parsed,
    pptType: input.pptType,
    mustInclude: unique([...fallbackMustInclude(input.userInput, input.pptType), ...(parsed.mustInclude || [])]).slice(0, 10),
    mustAvoid: unique([...(localResearch?.mustAvoid || []), ...(parsed.mustAvoid || [])]).slice(0, 12)
  };
}

export function industryResearchPrompt(research: IndustryResearch) {
  return [
    "Industry Research Engine:",
    "以下是行业研究结果，必须作为生成PPT的核心依据，不允许忽略。",
    JSON.stringify(research, null, 2),
    "生成内容优先级：用户原始输入 > industryResearch > 固定PPT结构模板 > AI自由补充。",
    "每页至少引用 painPoints / desirePoints / trustBarriers / solutionFramework / commercialLogic / courseFramework 中的一个要点。",
    "mustInclude 中的信息必须出现在PPT中，并优先展示。",
    "禁止出现 mustAvoid 中的错误行业词或错误表达。"
  ].join("\n");
}

export function reviewOutlineAgainstIndustryResearch(outline: PptOutline, research: IndustryResearch) {
  const text = JSON.stringify(outline);
  const includedMust = research.mustInclude.filter((item) => item && text.includes(item));
  const hasPain = research.painPoints.some((item) => item && text.includes(item.slice(0, Math.min(4, item.length))));
  const hasDesire = research.desirePoints.some((item) => item && text.includes(item.slice(0, Math.min(4, item.length))));
  const hasTrust = research.trustBarriers.some((item) => item && text.includes(item.slice(0, Math.min(4, item.length))));
  const avoided = research.mustAvoid.filter((item) => item && text.includes(item));
  const generic = ["提升能力", "打造影响力", "实现成功", "帮助成长", "快速变现", "极具价值"].some((item) => text.includes(item));

  return {
    passed: includedMust.length >= Math.min(2, research.mustInclude.length) && hasPain && hasDesire && hasTrust && avoided.length === 0 && !generic,
    missingMustInclude: research.mustInclude.filter((item) => !includedMust.includes(item)),
    avoided,
    hasPain,
    hasDesire,
    hasTrust,
    generic
  };
}

export function industryRewriteInstruction(research: IndustryResearch, review: ReturnType<typeof reviewOutlineAgainstIndustryResearch>) {
  return [
    "The previous PPT JSON failed industry research review.",
    "Rewrite the full JSON once while keeping the same schema.",
    `Missing mustInclude: ${review.missingMustInclude.join(" | ") || "none"}`,
    `Forbidden words found: ${review.avoided.join(" | ") || "none"}`,
    `Pain points used: ${review.hasPain ? "yes" : "no"}`,
    `Desire points used: ${review.hasDesire ? "yes" : "no"}`,
    `Trust barriers used: ${review.hasTrust ? "yes" : "no"}`,
    "Use the industryResearch object as the main evidence base.",
    JSON.stringify(research, null, 2)
  ].join("\n");
}
