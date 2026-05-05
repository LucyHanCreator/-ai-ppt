import { NextRequest, NextResponse } from "next/server";
import { generateOutline, openaiModel } from "@/lib/openai";
import { autoModePrompt, buildAutoModeContext } from "@/lib/auto-mode";
import { buildCourseFrameworkPrompt } from "@/lib/course-framework";
import {
  buildExpertEnginePrompt,
  resolveExpertDiagnosis,
  reviewOutlineQuality,
  rewriteOutlineWithExpertReview,
  selfReviewAndOptimizeOutline,
  shouldRewrite,
  type ContentQualityReview,
  type ExpertDiagnosis
} from "@/lib/expert-engine";
import { buildIndustryResearch, industryResearchPrompt } from "@/lib/industry-research";
import { generatePptRequestSchema } from "@/lib/schema";
import { rewriteOutlineWithVariation } from "@/lib/section-variation";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { AutoModeContext, IndustryResearch, OutputLanguage, PptOutline, PptSlide, PptType } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type RawGenerateRequest = {
  pptType?: unknown;
  presentationType?: unknown;
  inputMode?: unknown;
  topic?: unknown;
  audience?: unknown;
  goal?: unknown;
  tone?: unknown;
  slideCount?: unknown;
  requirements?: unknown;
  stylePreset?: unknown;
  colorPalette?: unknown;
  outputLanguage?: unknown;
  deepResearch?: unknown;
};

type PreparedRequest = {
  requestJson: unknown;
  expertDiagnosis: ExpertDiagnosis | null;
  industryResearch: IndustryResearch;
  autoModeContext: AutoModeContext | null;
};

const weakValues = new Set(["", "无", "暂无", "不知道", "不确定", "待补充", "未填写", "用户", "学员"]);
const fillerWords = ["非常", "可以", "帮助", "实现", "通过", "进行", "快速", "轻松", "有效", "全面", "系统性", "进一步", "真正"];

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isWeak(value: unknown) {
  const text = asText(value);
  return text.length < 2 || weakValues.has(text);
}

function normalizePptType(value: unknown) {
  const text = asText(value);
  if (text === "course" || text.includes("课程")) return "course";
  if (text === "investment" || text.includes("招商")) return "investment";
  if (text === "event" || text.includes("活动")) return "event";
  return text;
}

function normalizeOutputLanguage(value: unknown): OutputLanguage {
  const text = asText(value);
  if (text === "en" || text === "bilingual" || text === "zh") return text;
  return "zh";
}

function normalizeInputMode(value: unknown, raw: RawGenerateRequest) {
  const text = asText(value);
  if (text === "document") return "document";
  if (text === "auto") return "auto";
  if (text === "standard" || text === "simple") return "standard";
  const source = [asText(raw.topic), asText(raw.requirements)].join("\n");
  const length = Array.from(source.replace(/\s+/g, "")).length;
  if (length > 200) return "document";
  if (length > 0 && length < 80) return "auto";
  return "standard";
}

function normalizeDeepResearch(value: unknown) {
  return value === true || asText(value).toLowerCase() === "true";
}

function toValidPptType(value: unknown): PptType {
  return value === "course" || value === "investment" || value === "event" ? value : "course";
}

function buildResearchSource(raw: RawGenerateRequest) {
  return [asText(raw.topic), asText(raw.audience), asText(raw.goal), asText(raw.tone), asText(raw.requirements)]
    .filter(Boolean)
    .join("\n");
}

function buildOutputLanguagePrompt(outputLanguage: OutputLanguage) {
  if (outputLanguage === "en") {
    return [
      "Output language rule:",
      "All PPT content must be written in English.",
      "Use native business English, like an industry expert plus consulting advisor.",
      "Avoid Chinglish, literal translation, Chinese punctuation, and Chinese headings.",
      "Keep the same industry expert logic, sales conversion logic, complete deck structure, and visual strategy.",
      "Do not translate or simplify the industry model itself. Only change the language expression."
    ].join("\n");
  }

  if (outputLanguage === "bilingual") {
    return [
      "Output language rule:",
      "The PPT must be bilingual.",
      "slideTitle and subtitle should include Chinese + English.",
      "Body content should be mainly Chinese with concise English support.",
      "Keep the same industry logic, expert diagnosis, sales structure, and visual strategy.",
      "Do not translate the industry model itself. Only change the language expression."
    ].join("\n");
  }

  return [
    "Output language rule:",
    "All PPT content must be written in Simplified Chinese.",
    "Keep the same industry logic, expert diagnosis, sales structure, and visual strategy.",
    "Do not translate the industry model itself. Only change the language expression."
  ].join("\n");
}

function courseFrameworkPromptFor(raw: RawGenerateRequest, fallbackCount = 10) {
  return buildCourseFrameworkPrompt(Number(raw.slideCount) || fallbackCount);
}

function removeFiller(text: string) {
  return fillerWords.reduce((result, word) => result.replaceAll(word, ""), text || "");
}

function shortenText(text: string, maxLength: number) {
  const cleaned = removeFiller(text)
    .replace(/\s+/g, "")
    .replace(/\.{3,}|…+/g, "")
    .replace(/[，,；;。]+$/g, "")
    .trim();
  const chars = Array.from(cleaned);
  return chars.length > maxLength ? chars.slice(0, maxLength).join("") : cleaned;
}

function shortenSentenceText(text: string, maxSentenceLength: number, maxSentences = 2) {
  const sentences = removeFiller(text)
    .replace(/\s+/g, "")
    .split(/[。！？!?]/)
    .map((sentence) => shortenText(sentence, maxSentenceLength))
    .filter(Boolean)
    .slice(0, maxSentences);
  return sentences.join("。");
}

function sanitizeText(text: string, maxLength: number) {
  return shortenText(text, maxLength);
}

function sanitizeExpanded(text: string) {
  return shortenSentenceText(text, 20, 2);
}

function courseNameFor(expertDiagnosis: ExpertDiagnosis) {
  const names: Record<string, string> = {
    yoga_fitness: "体态改善训练课程",
    short_video: "短视频获客变现课程",
    beauty: "美业客户信任与复购课程",
    personal_ip: "个人IP定位表达课程",
    general_research: `${expertDiagnosis.industryName}实战课程`
  };
  return names[expertDiagnosis.courseIndustry] || `${expertDiagnosis.industryName}实战课程`;
}

function inferCourseTopic(raw: RawGenerateRequest, expertDiagnosis: ExpertDiagnosis) {
  const topic = asText(raw.topic) || asText(raw.requirements);
  if (!isWeak(topic)) return topic.includes("课程") ? topic : `${topic}课程`;
  return courseNameFor(expertDiagnosis);
}

function inferGoal(raw: RawGenerateRequest, expertDiagnosis: ExpertDiagnosis) {
  if (!isWeak(raw.goal)) return asText(raw.goal);
  return expertDiagnosis.desiredTransformation.slice(0, 3).join("、");
}

function buildStrictIndustryPrompt(expertDiagnosis: ExpertDiagnosis) {
  return [
    "行业专家诊断已经完成。生成PPT时必须完全服从 expertDiagnosis。",
    "禁止出现 mustAvoid 中的词和逻辑。",
    "每页必须引用：surfaceProblem、rootProblem、moneyLogic、courseMechanism、proofAssets、conversionTrigger 中至少一项。",
    "每页必须说明用户为什么要学、学完怎么变、为什么相信、为什么现在行动。",
    "expertInsight 必须是行业判断，不是普通描述。",
    "decisionValue 必须说明这一页帮助用户做什么报名决策。",
    "禁止空泛表达：提升能力、打造影响力、实现成功、帮助成长、快速变现、增强信任，除非后面有具体机制。",
    `courseIndustry: ${expertDiagnosis.courseIndustry}`,
    `industryName: ${expertDiagnosis.industryName}`,
    `mustAvoid: ${expertDiagnosis.mustAvoid.join("、")}`
  ].join("\n");
}

async function prepareRequestJson(rawJson: unknown): Promise<PreparedRequest> {
  const raw = (rawJson && typeof rawJson === "object" ? rawJson : {}) as RawGenerateRequest;
  const pptType = normalizePptType(raw.pptType || raw.presentationType);
  const outputLanguage = normalizeOutputLanguage(raw.outputLanguage);
  const inputMode = normalizeInputMode(raw.inputMode, raw);
  const documentText = [asText(raw.topic), asText(raw.requirements)].filter(Boolean).join("\n\n");
  const resolvedPptType = toValidPptType(pptType);
  const deepResearch = normalizeDeepResearch(raw.deepResearch);

  if (inputMode === "auto") {
    const autoModeContext = await buildAutoModeContext({
      userInput: buildResearchSource(raw),
      pptTypeHint: resolvedPptType,
      outputLanguage
    });
    const autoSource = [buildResearchSource(raw), autoModePrompt(autoModeContext)].filter(Boolean).join("\n\n");
    const industryResearch = await buildIndustryResearch({
      userInput: autoSource,
      pptType: autoModeContext.pptType,
      industry: autoModeContext.industry,
      outputLanguage,
      deepResearch
    });

    return {
      requestJson: {
        ...raw,
        pptType: autoModeContext.pptType,
        inputMode,
        deepResearch,
        autoModeContext,
        industryResearch,
        outputLanguage,
        topic: asText(raw.topic),
        audience: isWeak(raw.audience) ? autoModeContext.targetAudience : asText(raw.audience),
        goal: isWeak(raw.goal) ? autoModeContext.coreGoal : asText(raw.goal),
        tone: isWeak(raw.tone) ? "行业专家、商业顾问、成交导向、结构完整" : asText(raw.tone),
        slideCount: Number(raw.slideCount) || (autoModeContext.pptType === "course" ? 10 : 8),
        requirements: [
          asText(raw.requirements),
          autoModePrompt(autoModeContext),
          autoModeContext.pptType === "course" ? courseFrameworkPromptFor(raw, 10) : "",
          industryResearchPrompt(industryResearch),
          buildOutputLanguagePrompt(outputLanguage)
        ]
          .filter(Boolean)
          .join("\n\n")
      },
      expertDiagnosis: null,
      industryResearch,
      autoModeContext
    };
  }

  if (inputMode === "document") {
    const industryResearch = await buildIndustryResearch({
      userInput: documentText || buildResearchSource(raw),
      pptType: resolvedPptType,
      outputLanguage,
      deepResearch
    });
    return {
      requestJson: {
        ...raw,
        pptType: resolvedPptType,
        inputMode,
        deepResearch,
        industryResearch,
        outputLanguage,
        topic: outputLanguage === "en" ? "AI Business Deck" : "AI生成商业PPT",
        audience: isWeak(raw.audience) ? "Auto inferred from document" : asText(raw.audience),
        goal: isWeak(raw.goal) ? "Create a complete presentation from the document" : asText(raw.goal),
        tone: isWeak(raw.tone) ? "Consulting-grade, structured, concise" : asText(raw.tone),
        slideCount: Number(raw.slideCount) || 12,
        requirements: [`Document source:\n${documentText}`, industryResearchPrompt(industryResearch), buildOutputLanguagePrompt(outputLanguage)].filter(Boolean).join("\n\n")
      },
      expertDiagnosis: null,
      industryResearch,
      autoModeContext: null
    };
  }

  if (pptType !== "course") {
    const industryResearch = await buildIndustryResearch({
      userInput: buildResearchSource(raw),
      pptType: resolvedPptType,
      outputLanguage,
      deepResearch
    });
    return {
      requestJson: {
        ...raw,
        inputMode,
        deepResearch,
        industryResearch,
        outputLanguage,
        topic: asText(raw.topic),
        audience: asText(raw.audience),
        goal: asText(raw.goal),
        tone: asText(raw.tone),
        slideCount: Number(raw.slideCount) || 8,
        requirements: [asText(raw.requirements), industryResearchPrompt(industryResearch), buildOutputLanguagePrompt(outputLanguage)].filter(Boolean).join("\n\n")
      },
      expertDiagnosis: null,
      industryResearch,
      autoModeContext: null
    };
  }

  const expertDiagnosis = await resolveExpertDiagnosis({
    topic: asText(raw.topic),
    audience: asText(raw.audience),
    goal: asText(raw.goal),
    requirements: asText(raw.requirements)
  });
  const industryResearch = await buildIndustryResearch({
    userInput: buildResearchSource(raw),
    pptType: "course",
    industry: expertDiagnosis.courseIndustry,
    outputLanguage,
    deepResearch
  });
  const requirements = [
    asText(raw.requirements),
    buildCourseFrameworkPrompt(Number(raw.slideCount) || 10),
    industryResearchPrompt(industryResearch),
    buildExpertEnginePrompt(expertDiagnosis),
    buildStrictIndustryPrompt(expertDiagnosis),
    buildOutputLanguagePrompt(outputLanguage)
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    expertDiagnosis,
    industryResearch,
    autoModeContext: null,
    requestJson: {
      ...raw,
      pptType: "course",
      inputMode,
      deepResearch,
      industryResearch,
      outputLanguage,
      topic: inferCourseTopic(raw, expertDiagnosis),
      audience: isWeak(raw.audience) ? expertDiagnosis.targetAudience : asText(raw.audience),
      goal: inferGoal(raw, expertDiagnosis),
      tone: isWeak(raw.tone) ? "专业、具体、专家诊断、可直接交付" : asText(raw.tone),
      slideCount: Number(raw.slideCount) || 10,
      requirements
    }
  };
}

const yogaSlideOverrides: Partial<Record<PptSlide["layoutType"], Partial<PptSlide>>> = {
  cover: {
    sectionLabel: "课程结果",
    slideTitle: "30天改善体态",
    subtitle: "每天15分钟练习",
    keyMessage: "从僵硬到舒展",
    coreContent: ["肩颈放松", "腰背舒缓", "体态改善"],
    expandedExplanation: "很多女性不是不想运动。是身体太紧。",
    decisionValue: "相信课程适合自己",
    visualSuggestion: "yoga practice"
  },
  agenda: {
    sectionLabel: "课程路径",
    slideTitle: "五步建立习惯",
    subtitle: "从放松到稳定",
    keyMessage: "先松开身体",
    coreContent: ["身体评估", "肩颈释放", "核心激活", "呼吸放松", "每日打卡"],
    expandedExplanation: "练习路径要简单。坚持才会发生。",
    decisionValue: "看清学习路径",
    visualSuggestion: "pilates"
  },
  problem_matrix: {
    sectionLabel: "身体问题",
    slideTitle: "紧绷来自失衡",
    subtitle: "先看身体信号",
    keyMessage: "酸痛不是小事",
    coreContent: ["肩颈紧张", "腰背酸痛", "核心无力"],
    expandedExplanation: "久坐会改变体态。忽视会加重不适。",
    decisionValue: "认识到必须练习",
    visualSuggestion: "stretching"
  },
  before_after: {
    sectionLabel: "前后转变",
    slideTitle: "身体变轻盈",
    subtitle: "变化来自坚持",
    keyMessage: "练习给身体反馈",
    coreContent: ["肩颈紧", "腰背酸", "体态塌", "核心稳"],
    expandedExplanation: "结果不是口号。身体会给反馈。",
    decisionValue: "相信能改变",
    visualSuggestion: "wellness"
  },
  three_engines: {
    sectionLabel: "训练系统",
    slideTitle: "三步改善体态",
    subtitle: "放松强化坚持",
    keyMessage: "顺序很重要",
    coreContent: ["肩颈释放", "核心激活", "呼吸放松"],
    expandedExplanation: "先恢复活动度。再建立稳定性。",
    decisionValue: "相信老师有方法",
    visualSuggestion: "yoga practice"
  },
  timeline: {
    sectionLabel: "练习节奏",
    slideTitle: "30天陪跑路径",
    subtitle: "每天一点改变",
    keyMessage: "坚持比强度重要",
    coreContent: ["身体评估", "拉伸入门", "核心激活", "呼吸练习", "复盘打卡"],
    expandedExplanation: "节奏要温和。动作要可坚持。",
    decisionValue: "判断能否跟上",
    visualSuggestion: "stretching"
  },
  method: {
    sectionLabel: "练习方法",
    slideTitle: "动作必须做对",
    subtitle: "不追求高难度",
    keyMessage: "标准比强度重要",
    coreContent: ["晨间拉伸", "肩颈释放", "核心激活", "呼吸练习", "每日打卡"],
    expandedExplanation: "每个动作都有目标。每次练习都有反馈。",
    decisionValue: "相信方法可落地",
    visualSuggestion: "pilates"
  },
  case: {
    sectionLabel: "练习记录",
    slideTitle: "变化来自坚持",
    subtitle: "记录身体反馈",
    keyMessage: "案例只作占位",
    coreContent: ["久坐女性", "肩颈紧张", "每日打卡", "体态改善", "习惯形成"],
    expandedExplanation: "不编造夸张结果。请替换真实记录。",
    decisionValue: "相信路径可复制",
    visualSuggestion: "wellness"
  },
  sop: {
    sectionLabel: "陪跑机制",
    slideTitle: "陪伴更易坚持",
    subtitle: "反馈形成习惯",
    keyMessage: "练习需要提醒",
    coreContent: ["每日打卡", "动作纠正", "社群陪伴", "呼吸练习", "周复盘", "轻作业"],
    expandedExplanation: "有人陪跑。坚持更容易。",
    decisionValue: "相信交付扎实",
    visualSuggestion: "meditation"
  },
  pricing: {
    sectionLabel: "课程权益",
    slideTitle: "适合长期练习",
    subtitle: "权益清晰可见",
    keyMessage: "为坚持提供支持",
    coreContent: ["练习计划", "动作示范", "打卡表", "社群陪伴", "周复盘", "不适合急躁者"],
    expandedExplanation: "课程重在坚持。不是高强度挑战。",
    decisionValue: "判断是否报名",
    visualSuggestion: "wellness"
  },
  closing: {
    sectionLabel: "报名行动",
    slideTitle: "今天开始练习",
    subtitle: "先完成评估",
    keyMessage: "改变从一次练习开始",
    coreContent: ["提交评估", "进入社群", "领取计划", "开始打卡"],
    expandedExplanation: "先做轻练习。再形成习惯。",
    decisionValue: "愿意开始行动",
    visualSuggestion: "yoga practice"
  }
};

function enforceYogaModel(outline: PptOutline): PptOutline {
  return {
    ...outline,
    title: "体态改善训练课程",
    subtitle: "每天15分钟练习",
    coreMessage: "改善体态与放松身心",
    slides: outline.slides.map((slide) => ({
      ...slide,
      ...(yogaSlideOverrides[slide.layoutType] || {})
    }))
  };
}

function enforceSlideTextLimits(slide: PptSlide): PptSlide {
  return {
    ...slide,
    slideTitle: sanitizeText(slide.slideTitle, 16),
    subtitle: sanitizeText(slide.subtitle, 20),
    keyMessage: sanitizeText(slide.keyMessage, 20),
    sectionLabel: sanitizeText(slide.sectionLabel, 10),
    coreContent: slide.coreContent.slice(0, 6).map((item) => sanitizeText(item, 12)),
    expandedExplanation: sanitizeExpanded(slide.expandedExplanation),
    decisionValue: sanitizeText(slide.decisionValue, 15),
    visualSuggestion: sanitizeText(slide.visualSuggestion, 24),
    speakerNotes: slide.speakerNotes
  };
}

function rewriteIndustryHeadings(outline: PptOutline, expertDiagnosis: ExpertDiagnosis | null): PptOutline {
  if (outline.outputLanguage && outline.outputLanguage !== "zh") return outline;
  return rewriteOutlineWithVariation(outline, expertDiagnosis?.courseIndustry);
}

function enforceTextControl(outline: PptOutline, expertDiagnosis: ExpertDiagnosis | null): PptOutline {
  const industrySafeOutline = expertDiagnosis?.courseIndustry === "yoga_fitness" && outline.outputLanguage === "zh" ? enforceYogaModel(outline) : outline;
  const headingSafeOutline = rewriteIndustryHeadings(industrySafeOutline, expertDiagnosis);

  return {
    ...headingSafeOutline,
    title: sanitizeText(headingSafeOutline.title, 16),
    subtitle: sanitizeText(headingSafeOutline.subtitle, 20),
    coreMessage: sanitizeText(headingSafeOutline.coreMessage, 20),
    slides: headingSafeOutline.slides.map((slide) => enforceSlideTextLimits(slide))
  };
}

async function reviewAndMaybeRewrite(outline: PptOutline, expertDiagnosis: ExpertDiagnosis | null, outputLanguage: OutputLanguage) {
  if (!expertDiagnosis) {
    return {
      outline,
      qualityReview: null as ContentQualityReview | null
    };
  }

  const optimized = selfReviewAndOptimizeOutline(outline, expertDiagnosis);
  if (outputLanguage !== "zh") {
    return {
      outline: optimized,
      qualityReview: null as ContentQualityReview | null
    };
  }
  const qualityReview = await reviewOutlineQuality(optimized, expertDiagnosis);

  if (!shouldRewrite(qualityReview)) {
    return { outline: optimized, qualityReview };
  }

  const rewritten = await rewriteOutlineWithExpertReview(optimized, expertDiagnosis, qualityReview);
  const finalReview = await reviewOutlineQuality(rewritten, expertDiagnosis);
  return {
    outline: rewritten,
    qualityReview: finalReview
  };
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const prepared = await prepareRequestJson(json);
  const parsed = generatePptRequestSchema.safeParse(prepared.requestJson);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = parsed.data;
  const supabase = getSupabaseAdmin();
  let generationId: string | null = null;

  try {
    if (supabase) {
      const { data } = await supabase
        .from("ppt_generations")
        .insert({
          ppt_type: input.pptType,
          topic: input.topic,
          audience: input.audience,
          goal: input.goal,
          tone: input.tone,
          slide_count: input.slideCount,
          requirements: input.requirements,
          status: "pending",
          model: openaiModel
        })
        .select("id")
        .single();
      generationId = data?.id || null;
    }

    const generatedOutline = await generateOutline(input);
    const textSafeOutline = enforceTextControl(generatedOutline, prepared.expertDiagnosis);
    const reviewed = await reviewAndMaybeRewrite(textSafeOutline, prepared.expertDiagnosis, input.outputLanguage);
    const finalOutline = enforceTextControl(
      {
        ...reviewed.outline,
        stylePreset: input.stylePreset,
        colorPalette: input.colorPalette,
        outputLanguage: input.outputLanguage,
        autoModeContext: prepared.autoModeContext || undefined,
        industryResearch: prepared.industryResearch
      },
      prepared.expertDiagnosis
    );

    if (supabase && generationId) {
      await supabase
        .from("ppt_generations")
        .update({
          outline_json: finalOutline
        })
        .eq("id", generationId);
    }

    return NextResponse.json({
      outline: finalOutline,
      generationId,
      autoModeContext: prepared.autoModeContext,
      expertDiagnosis: prepared.expertDiagnosis,
      industryResearch: prepared.industryResearch,
      qualityReview: reviewed.qualityReview
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate outline.";

    if (supabase && generationId) {
      await supabase
        .from("ppt_generations")
        .update({
          status: "failed",
          error_message: message
        })
        .eq("id", generationId);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
