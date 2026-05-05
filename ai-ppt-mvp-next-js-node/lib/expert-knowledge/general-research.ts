import { generateJsonContent, hasAiProviderKey } from "@/lib/ai-provider";

export type GeneralResearchResult = {
  industryName: string;
  inferredAudience: string;
  realBusinessProblems: string[];
  rootCauses: string[];
  desiredTransformation: string[];
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
};

type GeneralResearchInput = {
  topic: string;
  audience: string;
  goal: string;
  requirements: string;
};

const fallbackResearch: GeneralResearchResult = {
  industryName: "通用实战课程",
  inferredAudience: "有明确学习目标的人群",
  realBusinessProblems: ["学习路径不清", "缺少练习反馈", "执行容易中断", "结果不可衡量"],
  rootCauses: ["目标拆解不足", "缺少标准动作", "没有反馈机制", "缺少成果验收"],
  desiredTransformation: ["从零散学习到系统路径", "从没人反馈到有人纠偏", "从听课到完成作业"],
  courseAngles: ["系统路径", "实操作业", "反馈机制", "成果标准"],
  expertInsights: ["课程的价值不是信息量，而是让学员完成关键动作。", "未知行业要先找到真实场景，再设计学习路径。"],
  surfaceProblem: "用户只知道自己想学习，但不清楚该如何开始。",
  rootProblem: "课程没有把目标、动作、反馈和成果验收串成闭环。",
  emotionalDrivers: ["想少走弯路", "想有人指导", "想看到结果"],
  moneyLogic: "用户愿意付费，是因为课程能减少试错并提供可执行路径。",
  courseMechanism: "用目标拆解、模块训练、作业反馈和成果验收，让学习变成可完成的行动。",
  transformationPath: ["目标模糊", "路径清晰", "开始练习", "获得反馈", "形成成果"],
  proofAssets: ["学习路径图", "作业样例", "反馈记录", "成果清单"],
  conversionTrigger: "让用户意识到继续自学的试错成本高于系统学习。",
  mustAvoid: ["硬套短视频逻辑", "硬套销售逻辑", "夸张承诺"],
  visualKeywords: ["online course", "learning roadmap", "workshop training", "coaching community"]
};

function ensureStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value.slice(0, 8) : fallback;
}

function ensureString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function normalizeResearch(raw: Partial<GeneralResearchResult>): GeneralResearchResult {
  return {
    industryName: ensureString(raw.industryName, fallbackResearch.industryName),
    inferredAudience: ensureString(raw.inferredAudience, fallbackResearch.inferredAudience),
    realBusinessProblems: ensureStringArray(raw.realBusinessProblems, fallbackResearch.realBusinessProblems),
    rootCauses: ensureStringArray(raw.rootCauses, fallbackResearch.rootCauses),
    desiredTransformation: ensureStringArray(raw.desiredTransformation, fallbackResearch.desiredTransformation),
    courseAngles: ensureStringArray(raw.courseAngles, fallbackResearch.courseAngles),
    expertInsights: ensureStringArray(raw.expertInsights, fallbackResearch.expertInsights),
    surfaceProblem: ensureString(raw.surfaceProblem, fallbackResearch.surfaceProblem),
    rootProblem: ensureString(raw.rootProblem, fallbackResearch.rootProblem),
    emotionalDrivers: ensureStringArray(raw.emotionalDrivers, fallbackResearch.emotionalDrivers),
    moneyLogic: ensureString(raw.moneyLogic, fallbackResearch.moneyLogic),
    courseMechanism: ensureString(raw.courseMechanism, fallbackResearch.courseMechanism),
    transformationPath: ensureStringArray(raw.transformationPath, fallbackResearch.transformationPath),
    proofAssets: ensureStringArray(raw.proofAssets, fallbackResearch.proofAssets),
    conversionTrigger: ensureString(raw.conversionTrigger, fallbackResearch.conversionTrigger),
    mustAvoid: ensureStringArray(raw.mustAvoid, fallbackResearch.mustAvoid),
    visualKeywords: ensureStringArray(raw.visualKeywords, fallbackResearch.visualKeywords)
  };
}

export async function runGeneralResearch(input: GeneralResearchInput): Promise<GeneralResearchResult> {
  if (!hasAiProviderKey()) return fallbackResearch;

  try {
    const output = await generateJsonContent({
      instructions: [
        "你是行业研究员，请基于用户输入推断行业并输出结构化行业研究摘要。",
        "不要泛泛而谈，不要硬套短视频、销售、美业或瑜伽逻辑。",
        "必须给出表面问题、根本问题、付费逻辑、课程机制、证明材料和转化触发点。",
        "只返回JSON。"
      ].join("\n"),
      input: JSON.stringify(input, null, 2),
      schema: {
          name: "general_industry_research",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "industryName",
              "inferredAudience",
              "realBusinessProblems",
              "rootCauses",
              "desiredTransformation",
              "courseAngles",
              "expertInsights",
              "surfaceProblem",
              "rootProblem",
              "emotionalDrivers",
              "moneyLogic",
              "courseMechanism",
              "transformationPath",
              "proofAssets",
              "conversionTrigger",
              "mustAvoid",
              "visualKeywords"
            ],
            properties: {
              industryName: { type: "string" },
              inferredAudience: { type: "string" },
              realBusinessProblems: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
              rootCauses: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
              desiredTransformation: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
              courseAngles: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
              expertInsights: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6 },
              surfaceProblem: { type: "string" },
              rootProblem: { type: "string" },
              emotionalDrivers: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 8 },
              moneyLogic: { type: "string" },
              courseMechanism: { type: "string" },
              transformationPath: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
              proofAssets: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 8 },
              conversionTrigger: { type: "string" },
              mustAvoid: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 8 },
              visualKeywords: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 }
            }
          }
      }
    });

    return normalizeResearch(JSON.parse(output) as Partial<GeneralResearchResult>);
  } catch {
    return fallbackResearch;
  }
}
