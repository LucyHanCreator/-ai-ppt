import { generateJsonContent, hasAiProviderKey } from "@/lib/ai-provider";
import { matchExpertKnowledge, type ExpertKnowledge } from "@/lib/expert-knowledge";
import type { AutoModeContext, OutputLanguage, PptType } from "@/lib/types";

type BuildAutoModeContextInput = {
  userInput: string;
  pptTypeHint: PptType;
  outputLanguage?: OutputLanguage;
};

const autoModeSchema = {
  name: "auto_mode_context",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "pptType",
      "industry",
      "coreGoal",
      "targetAudience",
      "painPoints",
      "desirePoints",
      "trustBarriers",
      "sellingPoints",
      "courseFramework",
      "commercialLogic",
      "caseAngles",
      "solutionFramework",
      "visualKeywords"
    ],
    properties: {
      pptType: { type: "string", enum: ["course", "investment", "event"] },
      industry: { type: "string" },
      coreGoal: { type: "string" },
      targetAudience: { type: "string" },
      painPoints: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      desirePoints: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      trustBarriers: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      sellingPoints: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      courseFramework: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 8 },
      commercialLogic: { type: "array", items: { type: "string" }, minItems: 0, maxItems: 8 },
      caseAngles: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
      solutionFramework: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
      visualKeywords: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 }
    }
  }
} as const;

function clean(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function unique(values: Array<string | undefined | null>) {
  const seen = new Set<string>();
  return values
    .map((value) => clean(value || ""))
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function inferPptType(input: string, hint: PptType): PptType {
  if (/活动|峰会|沙龙|大会|发布会|event|summit|conference/i.test(input)) return "event";
  if (/招商|融资|加盟|代理|合作|投资|商业模式|investment|franchise|partnership/i.test(input)) return "investment";
  if (/课程|训练营|陪跑|教学|课|workshop|course|bootcamp|class/i.test(input)) return "course";
  return hint;
}

function fromKnowledge(input: BuildAutoModeContextInput, knowledge: ExpertKnowledge): AutoModeContext {
  const pptType = inferPptType(input.userInput, input.pptTypeHint);

  return {
    pptType,
    industry: knowledge.courseIndustry,
    coreGoal: pptType === "course" ? knowledge.conversionTrigger : knowledge.moneyLogic,
    targetAudience: knowledge.industryName,
    painPoints: unique([knowledge.surfaceProblem, ...knowledge.realBusinessProblems]).slice(0, 8),
    desirePoints: unique([...knowledge.hiddenNeeds, ...knowledge.transformationPath]).slice(0, 8),
    trustBarriers: unique([...knowledge.trustBarriers]).slice(0, 8),
    sellingPoints: unique([...knowledge.courseAngles, ...knowledge.keyStrategies, knowledge.courseMechanism]).slice(0, 8),
    courseFramework: pptType === "course" ? unique([...knowledge.transformationPath, ...knowledge.keyStrategies]).slice(0, 8) : [],
    commercialLogic: pptType !== "course" ? unique([knowledge.moneyLogic, knowledge.conversionTrigger, ...knowledge.buyingMotivations]).slice(0, 8) : [],
    caseAngles: unique([...knowledge.proofAssets, ...knowledge.courseAngles]).slice(0, 6),
    solutionFramework: unique([...knowledge.keyStrategies, knowledge.courseMechanism]).slice(0, 8),
    visualKeywords: unique([...knowledge.visualKeywords]).slice(0, 8)
  };
}

function fallbackContext(input: BuildAutoModeContextInput): AutoModeContext {
  const pptType = inferPptType(input.userInput, input.pptTypeHint);

  return {
    pptType,
    industry: "general_industry",
    coreGoal: pptType === "course" ? "让目标用户愿意报名并开始学习" : pptType === "investment" ? "让合作方理解价值并愿意进一步沟通" : "让目标人群愿意报名参与",
    targetAudience: "目标用户",
    painPoints: ["需求不清晰", "信任不足", "行动路径模糊"],
    desirePoints: ["看见明确结果", "降低决策风险", "获得可执行路径"],
    trustBarriers: ["担心内容空泛", "担心无法落地", "担心投入不值得"],
    sellingPoints: ["结构完整", "方法具体", "交付清晰"],
    courseFramework: pptType === "course" ? ["痛点诊断", "结果对比", "方法训练", "案例证明", "陪跑交付"] : [],
    commercialLogic: pptType !== "course" ? ["价值证明", "权益设计", "合作路径", "行动转化"] : [],
    caseAngles: ["典型用户变化", "执行动作拆解", "结果证明材料"],
    solutionFramework: ["问题诊断", "方法路径", "执行机制", "结果复盘"],
    visualKeywords: ["business presentation", "strategy workshop", "professional team"]
  };
}

function autoModeInstructions(input: BuildAutoModeContextInput, localContext?: AutoModeContext) {
  const language =
    input.outputLanguage === "en"
      ? "Write all fields in native business English."
      : input.outputLanguage === "bilingual"
        ? "Write primarily in Simplified Chinese with concise English support."
        : "Write all fields in Simplified Chinese.";

  return [
    "You are an industry expert, business consultant, and course/product designer.",
    "Auto Mode: the user only provided one short sentence. Do not write PPT slides directly.",
    "First infer pptType, industry, coreGoal, targetAudience, painPoints, desirePoints, trustBarriers, sellingPoints, courseFramework or commercialLogic.",
    "Use industry knowledge and commercial logic to fill missing information.",
    "The output must be specific enough to generate a complete, conversion-ready PPT.",
    "Do not produce generic content.",
    language,
    localContext ? `Local industry knowledge reference:\n${JSON.stringify(localContext, null, 2)}` : "No local expert match. Infer carefully without forcing unrelated industry logic."
  ].join("\n");
}

export async function buildAutoModeContext(input: BuildAutoModeContextInput): Promise<AutoModeContext> {
  const matched = matchExpertKnowledge(input.userInput);
  const localContext = matched ? fromKnowledge(input, matched.knowledge) : undefined;

  if (!hasAiProviderKey()) {
    return localContext || fallbackContext(input);
  }

  const output = await generateJsonContent({
    instructions: autoModeInstructions(input, localContext),
    input: JSON.stringify(
      {
        userSentence: input.userInput,
        pptTypeHint: input.pptTypeHint
      },
      null,
      2
    ),
    schema: autoModeSchema
  });

  const parsed = JSON.parse(output) as AutoModeContext;
  return {
    ...parsed,
    pptType: inferPptType(input.userInput, parsed.pptType || input.pptTypeHint)
  };
}

export function autoModePrompt(context: AutoModeContext) {
  return [
    "Auto Mode Context:",
    "用户只输入了一句话。以下是系统自动补全后的完整生成依据，必须优先使用。",
    JSON.stringify(context, null, 2),
    "生成PPT时必须体现：coreGoal、targetAudience、painPoints、desirePoints、trustBarriers、sellingPoints。",
    "如果 pptType=course，必须使用 courseFramework。",
    "如果 pptType=investment 或 event，必须使用 commercialLogic。",
    "不允许只基于原始一句话直接写PPT，也不允许生成泛化内容。"
  ].join("\n");
}
