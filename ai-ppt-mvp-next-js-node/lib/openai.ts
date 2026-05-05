import { generateJsonContent, getActiveModel, hasAiProviderKey } from "@/lib/ai-provider";
import { buildCourseFrameworkPrompt } from "@/lib/course-framework";
import { industryResearchPrompt, industryRewriteInstruction, reviewOutlineAgainstIndustryResearch } from "@/lib/industry-research";
import { pptOutlineJsonSchema } from "@/lib/schema";
import type { GeneratePptRequest, LayoutType, PptOutline, PptSlide, PptType } from "@/lib/types";

export const openaiModel = getActiveModel();

type SlideModel = {
  moduleKey?: string;
  layoutType: LayoutType;
  sectionLabel: string;
  slideTitle: string;
  subtitle: string;
  keyMessage: string;
  coreContent: string[];
  expandedExplanation: string;
  decisionValue: string;
  visualSuggestion: string;
};

type UserInputInsight = {
  coreGoal: string;
  keySellingPoints: string[];
};

const courseModel: SlideModel[] = [
  {
    layoutType: "cover",
    sectionLabel: "课程结果",
    slideTitle: "不会拍短视频，客户就看不见你",
    subtitle: "30天建立可复用获客内容系统",
    keyMessage: "学完要能持续产出、稳定测试、承接成交。",
    coreContent: ["适合想获客的老板", "适合内容转型团队", "核心结果：独立产出闭环"],
    expandedExplanation: "课程不是讲理论，而是带学员跑通从选题到成交的完整动作。",
    decisionValue: "判断这门课是否匹配自己的增长目标。",
    visualSuggestion: "封面人物剪影+短视频增长路径"
  },
  {
    layoutType: "agenda",
    sectionLabel: "课程逻辑",
    slideTitle: "课程不是知识堆砌，是成交路径",
    subtitle: "五个板块解决报名疑虑",
    keyMessage: "先看到问题，再看到结果，最后看到陪跑。",
    coreContent: ["学之前的问题", "学之后的好处", "以往学员案例", "干货与实操方法", "作业与陪跑机制"],
    expandedExplanation: "目录页要让用户相信课程有完整路径，而不是零散技巧合集。",
    decisionValue: "确认课程结构是否系统完整。",
    visualSuggestion: "五个编号模块卡片"
  },
  {
    layoutType: "problem_matrix",
    sectionLabel: "学之前的问题",
    slideTitle: "不是你不努力，是动作不对",
    subtitle: "五个断点让内容没有结果",
    keyMessage: "选题、开头、表达、剪辑、转化任何一环断掉，流量都变不成客户。",
    coreContent: ["不会选题：拍了没人看", "不会开头：3秒被划走", "不会表达：用户听不懂", "不会剪辑：完播率低", "不会转化：流量不成交"],
    expandedExplanation: "这页要把焦虑具体化，让用户看到问题不是天赋，而是缺少标准动作。",
    decisionValue: "确认自己卡在哪个环节。",
    visualSuggestion: "2x3问题矩阵+后果标签"
  },
  {
    layoutType: "before_after",
    sectionLabel: "学之后的好处",
    slideTitle: "从靠感觉，到有标准流程",
    subtitle: "学习结果必须能被验证",
    keyMessage: "课程交付的不是灵感，而是一套可复盘的内容生产系统。",
    coreContent: ["不会拍 -> 能稳定输出", "没流量 -> 有爆款方法", "没成交 -> 有转化路径", "靠感觉 -> 有标准流程"],
    expandedExplanation: "结果页必须让用户看见转变，而不是听到承诺。",
    decisionValue: "判断学习后能获得什么变化。",
    visualSuggestion: "Before/After双栏对比"
  },
  {
    layoutType: "three_engines",
    sectionLabel: "课程价值总览",
    slideTitle: "三大系统，解决增长断点",
    subtitle: "定位、表达、成交缺一不可",
    keyMessage: "内容增长不是单点技巧，而是三套系统协同。",
    coreContent: ["内容定位系统：找到能成交的选题", "爆款表达系统：让用户愿意看完", "转化成交系统：把流量导向咨询"],
    expandedExplanation: "这一页建立课程的高维框架，让用户理解为什么单学剪辑不够。",
    decisionValue: "判断课程是否覆盖完整增长链路。",
    visualSuggestion: "三大增长引擎卡片"
  },
  {
    layoutType: "timeline",
    sectionLabel: "课程模块",
    slideTitle: "五阶段跑通内容闭环",
    subtitle: "每个阶段都有可交付结果",
    keyMessage: "学习路径越清晰，执行阻力越小。",
    coreContent: ["第1阶段：定位与选题", "第2阶段：脚本与表达", "第3阶段：拍摄与剪辑", "第4阶段：发布与转化", "第5阶段：复盘与优化"],
    expandedExplanation: "时间线要让用户看到每天做什么，每周交付什么。",
    decisionValue: "确认学习路径是否可执行。",
    visualSuggestion: "横向五阶段时间线"
  },
  {
    layoutType: "method",
    sectionLabel: "干货方法",
    slideTitle: "方法必须能马上照做",
    subtitle: "给公式、给动作、给测试标准",
    keyMessage: "课程价值来自可执行方法，而不是概念解释。",
    coreContent: ["黄金3秒开头公式", "痛点-冲突-结果脚本", "5条视频测试选题", "评论区反推需求", "私域承接成交路径"],
    expandedExplanation: "这一页要证明课程有实操含量，能直接改变学员动作。",
    decisionValue: "判断课程是否有真方法。",
    visualSuggestion: "方法公式+示例卡片"
  },
  {
    layoutType: "case",
    sectionLabel: "学员案例",
    slideTitle: "案例不是炫耀，是证明路径",
    subtitle: "请替换真实学员信息",
    keyMessage: "案例要呈现背景、动作、结果和可复制经验。",
    coreContent: ["学员背景：本地门店老板", "原始问题：视频无人咨询", "训练动作：重做选题和开头", "结果变化：咨询量开始增长", "可复制经验：先测选题"],
    expandedExplanation: "没有真实案例时，先放案例结构占位，避免编造姓名和夸张数据。",
    decisionValue: "判断方法是否有可复制路径。",
    visualSuggestion: "案例卡片+结果变化箭头"
  },
  {
    layoutType: "sop",
    sectionLabel: "交付机制",
    slideTitle: "陪跑决定完成率",
    subtitle: "课程交付必须有节奏",
    keyMessage: "知识付费真正交付的是训练环境和反馈机制。",
    coreContent: ["每周线下课", "每周线上答疑", "每日视频作业", "逐条视频点评", "社群陪跑复盘", "直播复盘优化"],
    expandedExplanation: "SOP页要让用户相信自己不会买完就放弃。",
    decisionValue: "确认交付机制是否足够扎实。",
    visualSuggestion: "周交付SOP流程图"
  },
  {
    layoutType: "pricing",
    sectionLabel: "报名权益",
    slideTitle: "价格不是成本，是结果门票",
    subtitle: "权益越清楚，决策越快",
    keyMessage: "价格页要把主课、赠品、福利、限制说清楚。",
    coreContent: ["主权益：系统课程+陪跑", "赠品：脚本模板库", "限时福利：诊断1次", "名额限制：保证点评质量", "适合：愿意交作业的人", "不适合：只想听理论的人"],
    expandedExplanation: "这页要降低价格疑虑，同时筛选真正适合的学员。",
    decisionValue: "判断现在报名是否值得。",
    visualSuggestion: "权益清单+价值锚点"
  },
  {
    layoutType: "closing",
    sectionLabel: "下一步行动",
    slideTitle: "今天报名，今天开始改",
    subtitle: "30天陪跑从诊断开始",
    keyMessage: "行动路径越短，转化概率越高。",
    coreContent: ["立即报名", "提交诊断表", "进入学习群", "开始30天陪跑"],
    expandedExplanation: "最后一页只保留行动，不再重复卖点。",
    decisionValue: "推动用户完成报名动作。",
    visualSuggestion: "四步报名路径+强CTA"
  }
];

const genericModels: Record<Exclude<PptType, "course">, SlideModel[]> = {
  investment: [
    { layoutType: "cover", sectionLabel: "项目定位", slideTitle: "项目合作方案", subtitle: "商业合作与增长回报", keyMessage: "先看机会，再看回报。", coreContent: ["市场机会明确", "合作路径清晰", "回报机制可算"], expandedExplanation: "招商PPT保留商业合作逻辑。", decisionValue: "判断合作价值。", visualSuggestion: "项目定位主视觉" },
    { layoutType: "problem_matrix", sectionLabel: "市场痛点", slideTitle: "需求正在放大", subtitle: "旧方式难以增长", keyMessage: "痛点越清楚，合作越必要。", coreContent: ["获客成本高", "转化链路断", "复购机制弱", "团队效率低"], expandedExplanation: "先建立合作必要性。", decisionValue: "确认市场痛点。", visualSuggestion: "痛点矩阵" },
    { layoutType: "three_engines", sectionLabel: "解决方案", slideTitle: "三套能力驱动增长", subtitle: "从流量到成交", keyMessage: "系统比单点更可靠。", coreContent: ["获客系统", "转化系统", "复购系统"], expandedExplanation: "用系统能力证明可落地。", decisionValue: "判断方案完整度。", visualSuggestion: "三引擎结构" },
    { layoutType: "timeline", sectionLabel: "合作路径", slideTitle: "三阶段启动合作", subtitle: "从试点到放量", keyMessage: "小步试点降低风险。", coreContent: ["第1月搭建", "第2月测试", "第3月放量"], expandedExplanation: "让合作方看到实施路径。", decisionValue: "判断启动难度。", visualSuggestion: "三阶段时间线" },
    { layoutType: "pricing", sectionLabel: "合作权益", slideTitle: "投入回报可测算", subtitle: "权益与收益对齐", keyMessage: "合作必须算得清。", coreContent: ["资源投入", "支持权益", "收益结构", "评估指标"], expandedExplanation: "把合作条件说清楚。", decisionValue: "判断回报合理性。", visualSuggestion: "权益表" },
    { layoutType: "closing", sectionLabel: "下一步", slideTitle: "确认试点，进入评估", subtitle: "用数据决定放量", keyMessage: "先试点，再扩大。", coreContent: ["确认负责人", "提交资料", "启动试点", "复盘决策"], expandedExplanation: "收口到可执行动作。", decisionValue: "推动下一步。", visualSuggestion: "行动路径" }
  ],
  event: [
    { layoutType: "cover", sectionLabel: "活动定位", slideTitle: "活动推广方案", subtitle: "参与价值与传播价值", keyMessage: "先看人群，再看声量。", coreContent: ["活动主题明确", "人群匹配清晰", "传播价值可见"], expandedExplanation: "活动PPT保留推广逻辑。", decisionValue: "判断活动价值。", visualSuggestion: "活动主视觉" },
    { layoutType: "agenda", sectionLabel: "活动结构", slideTitle: "活动价值一页看清", subtitle: "内容、嘉宾、权益", keyMessage: "结构越清晰，参与越容易。", coreContent: ["活动背景", "目标人群", "活动亮点", "传播权益", "赞助方案"], expandedExplanation: "先建立整体认知。", decisionValue: "理解活动结构。", visualSuggestion: "目录卡片" },
    { layoutType: "three_engines", sectionLabel: "活动亮点", slideTitle: "三类价值驱动参与", subtitle: "内容、资源、曝光", keyMessage: "活动必须给到明确收益。", coreContent: ["内容价值", "资源价值", "传播价值"], expandedExplanation: "用价值驱动报名和赞助。", decisionValue: "判断参与理由。", visualSuggestion: "三价值卡片" },
    { layoutType: "timeline", sectionLabel: "流程安排", slideTitle: "流程决定体验", subtitle: "每个环节都有产出", keyMessage: "节奏清晰降低疑虑。", coreContent: ["签到破冰", "主题分享", "圆桌交流", "资源对接", "报名转化"], expandedExplanation: "让用户看到参与路径。", decisionValue: "判断时间投入。", visualSuggestion: "活动时间线" },
    { layoutType: "pricing", sectionLabel: "合作权益", slideTitle: "赞助回报要可见", subtitle: "权益、曝光、线索", keyMessage: "赞助不是露出，是线索。", coreContent: ["品牌露出", "内容共创", "现场权益", "线索沉淀"], expandedExplanation: "把赞助转成商业结果。", decisionValue: "判断赞助价值。", visualSuggestion: "权益矩阵" },
    { layoutType: "closing", sectionLabel: "行动号召", slideTitle: "锁定席位，启动传播", subtitle: "报名与合作同步推进", keyMessage: "窗口越短，行动越快。", coreContent: ["确认档位", "提交资料", "启动宣发", "现场转化"], expandedExplanation: "收口到报名和赞助动作。", decisionValue: "推动合作确认。", visualSuggestion: "行动路径" }
  ]
};

function modelFor(input: GeneratePptRequest) {
  return input.pptType === "course" ? courseModel : genericModels[input.pptType];
}

function clamp(value: string | undefined, max: number, fallback: string) {
  const text = (value || fallback).trim();
  return text.length > max ? text.slice(0, max) : text;
}

function list(value: string[] | undefined, fallback: string[]) {
  const source = Array.isArray(value) && value.length >= 3 ? value : fallback;
  return source.slice(0, 6).map((item, index) => clamp(item, 42, fallback[index] || "结果明确"));
}

function industryImageBase(input: GeneratePptRequest) {
  const research = input.industryResearch;
  const haystack = [research?.industry, research?.visualKeywords?.join(" "), input.topic, input.requirements].filter(Boolean).join(" ");

  if (/yoga|fitness|瑜伽|普拉提|体态|肩颈|腰背|冥想/i.test(haystack)) return "yoga studio wellness natural light";
  if (/beauty|skincare|美业|美容|抗衰|轻医美|皮肤/i.test(haystack)) return "beauty skincare soft light spa";
  if (/real estate|property|房地产|地产|楼盘|置业/i.test(haystack)) return "luxury real estate modern interior";
  if (/kids|children|education|儿童|少儿|教育|启蒙/i.test(haystack)) return "kids education bright classroom";
  if (/short_video|video|短视频|抖音|小红书|TikTok/i.test(haystack)) return "content creator filming smartphone tripod";
  if (input.pptType === "event") return "business conference audience event";
  if (input.pptType === "investment") return "startup business partnership presentation";
  return "online course business workshop";
}

function imageQueryForSlide(input: GeneratePptRequest, model: SlideModel, raw?: Partial<PptSlide>) {
  const base = industryImageBase(input);
  const visual = raw?.visualSuggestion || model.visualSuggestion;

  if (model.layoutType === "cover") return `${base} premium cover atmosphere`;
  if (model.layoutType === "case") return `${base} case study people transformation`;
  if (model.layoutType === "method") return `${base} workflow method tools`;
  if (model.layoutType === "before_after") return `${base} transformation before after`;
  if (model.layoutType === "closing") return `${base} success action`;
  return `${base} ${visual}`;
}

function pexelsSearchUrl(query: string) {
  return `https://www.pexels.com/search/${encodeURIComponent(query.trim() || "business presentation")}/`;
}

function imageSearchQueryForSlide(input: GeneratePptRequest, model: SlideModel, raw?: Partial<PptSlide>) {
  return clamp(raw?.imageSearchQuery || raw?.imageQuery, 100, imageQueryForSlide(input, model, raw));
}

function imagePromptForSlide(model: SlideModel, raw?: Partial<PptSlide>) {
  return clamp(raw?.imagePrompt || raw?.visualSuggestion, 120, model.visualSuggestion);
}

function fallbackModuleKey(input: GeneratePptRequest, model: SlideModel) {
  if (model.moduleKey) return model.moduleKey;
  if (input.pptType !== "course") return model.layoutType;
  const map: Partial<Record<LayoutType, string>> = {
    cover: "opening_awareness",
    agenda: "opening_awareness",
    problem_matrix: "pain_deep_dive",
    before_after: "desire_preview",
    three_engines: "core_methods",
    timeline: "core_methods",
    method: "core_methods",
    case: "case_breakdown",
    sop: "practical_homework",
    pricing: "bonus_value",
    closing: "review_summary"
  };
  return map[model.layoutType] || "core_methods";
}

function normalizeSlide(input: GeneratePptRequest, model: SlideModel, raw: Partial<PptSlide> | undefined): PptSlide {
  const searchQuery = imageSearchQueryForSlide(input, model, raw);
  return {
    moduleKey: clamp(raw?.moduleKey, 40, fallbackModuleKey(input, model)),
    slideTitle: clamp(raw?.slideTitle, 36, model.slideTitle),
    subtitle: clamp(raw?.subtitle, 42, model.subtitle),
    keyMessage: clamp(raw?.keyMessage, 48, model.keyMessage),
    sectionLabel: clamp(raw?.sectionLabel, 20, model.sectionLabel),
    coreContent: list(raw?.coreContent, model.coreContent),
    expandedExplanation: clamp(raw?.expandedExplanation, 90, model.expandedExplanation),
    expertInsight: clamp(raw?.expertInsight, 120, raw?.expandedExplanation || model.expandedExplanation),
    decisionValue: clamp(raw?.decisionValue, 52, model.decisionValue),
    visualSuggestion: clamp(raw?.visualSuggestion, 60, model.visualSuggestion),
    imagePrompt: imagePromptForSlide(model, raw),
    imageQuery: searchQuery,
    imageRequired: raw?.imageRequired ?? ["cover", "method", "case", "before_after"].includes(model.layoutType),
    imageSearchQuery: searchQuery,
    imageSearchUrl: clamp(raw?.imageSearchUrl, 180, pexelsSearchUrl(searchQuery)),
    speakerNotes: clamp(raw?.speakerNotes, 220, "先讲冲突，再讲转变，最后落到行动。"),
    layoutType: model.layoutType
  };
}

function normalizeOutline(input: GeneratePptRequest, raw: Partial<PptOutline>): PptOutline {
  const model = modelFor(input);
  const slides = Array.isArray(raw.slides) ? raw.slides : [];
  return {
    title: clamp(raw.title, 40, input.topic),
    subtitle: clamp(raw.subtitle, 52, input.pptType === "course" ? "知识付费成交型课程方案" : "商业转化型方案"),
    type: input.pptType,
    audience: input.audience,
    coreMessage: clamp(raw.coreMessage, 60, input.goal),
    stylePreset: input.stylePreset || "auto",
    colorPalette: input.colorPalette,
    outputLanguage: input.outputLanguage || "zh",
    autoModeContext: input.autoModeContext,
    industryResearch: input.industryResearch,
    slides: model.map((item, index) => normalizeSlide(input, item, slides[index]))
  };
}

function cleanRequirementSource(requirements = "") {
  const documentMarker = "Document source:";
  const outputMarker = "Output language rule:";
  const documentIndex = requirements.indexOf(documentMarker);
  const source = documentIndex >= 0 ? requirements.slice(documentIndex + documentMarker.length) : requirements;
  const outputIndex = source.indexOf(outputMarker);
  return (outputIndex >= 0 ? source.slice(0, outputIndex) : source).replace(/\s+/g, " ").trim().slice(0, 2000);
}

function splitCandidatePhrases(source: string) {
  return source
    .split(/[\n,，。；;、|/]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 3 && item.length <= 36)
    .filter((item) => !/^(pptType|topic|audience|goal|tone|requirements|outputLanguage|Document source)/i.test(item));
}

function uniqueValues(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase().replace(/\s+/g, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function extractUserInputInsight(input: GeneratePptRequest): UserInputInsight {
  const userSource = cleanRequirementSource(input.requirements || "");
  const combined = [input.topic, input.goal, input.audience, userSource].filter(Boolean).join(" ");
  const phraseCandidates = splitCandidatePhrases(combined);
  const numericOrSpecific = phraseCandidates.filter((item) => /[0-9一二三四五六七八九十百千万%％天周月年倍]/.test(item));
  const benefitLike = phraseCandidates.filter((item) => /增长|提升|转化|成交|获客|复购|改善|结果|方法|机制|权益|案例|陪跑|SOP|growth|conversion|revenue|result|method|case|benefit/i.test(item));
  const keySellingPoints = uniqueValues([...numericOrSpecific, ...benefitLike, ...phraseCandidates]).slice(0, 5);

  return {
    coreGoal: (input.goal && input.goal.length > 3 ? input.goal : input.topic || "Create a customized presentation").slice(0, 80),
    keySellingPoints: keySellingPoints.length >= 2 ? keySellingPoints : uniqueValues([input.topic, input.audience, input.goal].filter(Boolean)).slice(0, 5)
  };
}

function userInputConstraint(insight: UserInputInsight) {
  return [
    "Mandatory user-input coverage rule:",
    "The following information must be reflected in the PPT and shown with priority:",
    `Core goal: ${insight.coreGoal}`,
    `Key selling points: ${insight.keySellingPoints.join(" | ")}`,
    "Every slide must reflect 1-2 of these selling points or directly support the core goal.",
    "Do not ignore the user's input.",
    "Do not generate generic template content.",
    "The deck must feel customized for this exact project and ready for conversion."
  ].join("\n");
}

function normalizeForCoverage(value: string) {
  return value.toLowerCase().replace(/[\s"'`.,，。；;:：!?！？、|/\\()[\]{}<>《》【】\-_\n\r]/g, "");
}

function isCovered(haystack: string, value: string) {
  const needle = normalizeForCoverage(value);
  if (!needle) return true;
  if (haystack.includes(needle)) return true;
  if (needle.length <= 4) return false;
  return haystack.includes(needle.slice(0, Math.min(8, needle.length)));
}

function outlineCoverage(outline: PptOutline, insight: UserInputInsight) {
  const text = normalizeForCoverage(
    [
      outline.title,
      outline.subtitle,
      outline.audience,
      outline.coreMessage,
      ...outline.slides.flatMap((slide) => [
        slide.slideTitle,
        slide.subtitle,
        slide.keyMessage,
        slide.sectionLabel,
        slide.expandedExplanation,
        slide.decisionValue,
        slide.visualSuggestion,
        slide.speakerNotes,
        ...slide.coreContent
      ])
    ].join(" ")
  );
  const coveredGoal = isCovered(text, insight.coreGoal);
  const coveredSellingPoints = insight.keySellingPoints.filter((point) => isCovered(text, point));
  return {
    coveredGoal,
    coveredSellingPoints,
    missingSellingPoints: insight.keySellingPoints.filter((point) => !coveredSellingPoints.includes(point)),
    passed: coveredGoal && coveredSellingPoints.length >= Math.min(2, insight.keySellingPoints.length)
  };
}

function coverageRepairInstruction(insight: UserInputInsight, missing: string[]) {
  return [
    "The previous draft failed user-input coverage.",
    `You must explicitly include the core goal: ${insight.coreGoal}`,
    `You must explicitly include these missing selling points: ${missing.join(" | ")}`,
    "Put the core goal in the cover/coreMessage.",
    "Distribute the selling points across slideTitle, keyMessage, coreContent, and speakerNotes.",
    "Regenerate the full JSON. Keep the schema unchanged."
  ].join("\n");
}

async function repairWithIndustryResearch(
  input: GeneratePptRequest,
  outline: PptOutline,
  instructions: string,
  prompt: string,
  normalize: (raw: Partial<PptOutline>) => PptOutline
) {
  if (!input.industryResearch) return outline;

  const review = reviewOutlineAgainstIndustryResearch(outline, input.industryResearch);
  if (review.passed) return outline;

  const retryOutput = await generateJsonContent({
    instructions: [instructions, industryRewriteInstruction(input.industryResearch, review)].join("\n\n"),
    input: prompt,
    schema: pptOutlineJsonSchema
  });

  return normalize(JSON.parse(retryOutput) as PptOutline);
}

export function sanitizeDeckTitle(text: string): string {
  const stripped = (text || "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[.。…]{2,}/g, "")
    .replace(/[!！?？,，;；:：、|]+/g, " ")
    .replace(/^(我想做一个|我想做|请帮我生成|请帮我做|帮我生成|帮我做|这个课程|这个项目|这个活动|生成一个|做一个)/, "")
    .trim();

  if (!stripped) return "AI生成商业PPT";

  const hasCjk = /[\u4e00-\u9fff]/.test(stripped);
  if (!hasCjk) {
    return stripped.split(/\s+/).filter(Boolean).slice(0, 8).join(" ") || "AI Business Deck";
  }

  return Array.from(stripped.replace(/\s+/g, "")).slice(0, 18).join("") || "AI生成商业PPT";
}

function looksLikeRawDocumentTitle(title: string) {
  return /[\r\n]/.test(title) || Array.from(title || "").length > 42 || /我想|请帮我|这个课程|这个项目|这个活动/.test(title);
}

function resolveDocumentDeckTitle(input: GeneratePptRequest, raw: Partial<PptOutline>) {
  const candidates = [raw.title, raw.coreMessage, raw.subtitle]
    .map((value) => sanitizeDeckTitle(value || ""))
    .filter((value) => value && value !== "AI生成商业PPT" && value !== "AI Business Deck");

  const cleanTitle = sanitizeDeckTitle(raw.title || "");
  if (cleanTitle && !looksLikeRawDocumentTitle(raw.title || "") && cleanTitle !== "AI生成商业PPT") {
    return cleanTitle;
  }

  return candidates[0] || (input.outputLanguage === "en" ? "AI Business Deck" : "AI生成商业PPT");
}

const documentLayoutPlan: LayoutType[] = [
  "cover",
  "agenda",
  "problem_matrix",
  "before_after",
  "three_engines",
  "timeline",
  "method",
  "case",
  "sop",
  "pricing",
  "closing",
  "method",
  "timeline",
  "case",
  "closing"
];

function normalizeDocumentSlide(raw: Partial<PptSlide> | undefined, index: number, input: GeneratePptRequest): PptSlide {
  const layoutType = raw?.layoutType || documentLayoutPlan[index] || "method";
  const fallbackTitle = index === 0 ? input.topic : `Slide ${index + 1}`;
  const fallbackImageQuery = `${industryImageBase(input)} ${layoutType}`;
  const searchQuery = clamp(raw?.imageSearchQuery || raw?.imageQuery, 100, fallbackImageQuery);

  return {
    moduleKey: clamp(raw?.moduleKey, 40, layoutType),
    slideTitle: clamp(raw?.slideTitle, 36, fallbackTitle),
    subtitle: clamp(raw?.subtitle, 42, "Document insight"),
    keyMessage: clamp(raw?.keyMessage, 48, input.goal),
    sectionLabel: clamp(raw?.sectionLabel, 20, layoutType),
    coreContent: list(raw?.coreContent, ["Key point", "Supporting detail", "Action implication"]),
    expandedExplanation: clamp(raw?.expandedExplanation, 90, "This slide distills the document into a decision-ready message."),
    expertInsight: clamp(raw?.expertInsight, 120, raw?.expandedExplanation || "This slide turns the source into a decision-ready insight."),
    decisionValue: clamp(raw?.decisionValue, 52, "Understand the key implication"),
    visualSuggestion: clamp(raw?.visualSuggestion, 60, "structured business presentation visual"),
    imagePrompt: clamp(raw?.imagePrompt || raw?.visualSuggestion, 120, "structured business presentation visual"),
    imageQuery: searchQuery,
    imageRequired: raw?.imageRequired ?? ["cover", "method", "case", "before_after"].includes(layoutType),
    imageSearchQuery: searchQuery,
    imageSearchUrl: clamp(raw?.imageSearchUrl, 180, pexelsSearchUrl(searchQuery)),
    speakerNotes: clamp(raw?.speakerNotes, 220, "Explain the core insight, then connect it to the next slide."),
    layoutType
  };
}

function normalizeDocumentOutline(input: GeneratePptRequest, raw: Partial<PptOutline>): PptOutline {
  const requested = Math.min(Math.max(Number(input.slideCount) || 12, 8), 15);
  const rawSlides = Array.isArray(raw.slides) ? raw.slides : [];
  const slides = Array.from({ length: requested }, (_, index) => normalizeDocumentSlide(rawSlides[index], index, input));

  const deckTitle = resolveDocumentDeckTitle(input, raw);

  return {
    title: deckTitle,
    subtitle: clamp(raw.subtitle, 52, "Document to Deck"),
    type: raw.type || input.pptType,
    audience: clamp(raw.audience, 120, input.audience),
    coreMessage: clamp(raw.coreMessage, 60, input.goal),
    stylePreset: input.stylePreset || "auto",
    colorPalette: input.colorPalette,
    outputLanguage: input.outputLanguage || "zh",
    autoModeContext: input.autoModeContext,
    industryResearch: input.industryResearch,
    slides
  };
}

function courseInstruction() {
  return [
    "For pptType=course, use the exact knowledge-commerce sales structure below.",
    "This must feel like a consulting-grade course sales proposal, not slogan copy.",
    "The deck must answer: why learn, what to learn, how it lands, what result, why now, why trust.",
    "Use concrete mechanisms: daily video homework, weekly review, video critique, community coaching, live recap.",
    "Do not fabricate real names or exaggerated data. For cases, use placeholder case structure.",
    "Every slide should provide decision evidence that makes the user more likely to enroll.",
    "Avoid empty phrases: 轻松变现, 快速成功, 打造影响力, 机会就在眼前.",
    "Required course structure:",
    "1 cover: course name, result promise, audience, core result.",
    "2 agenda: five modules: 学之前的问题 / 学之后的好处 / 以往学员案例 / 干货与实操方法 / 作业与陪跑机制.",
    "3 problem_matrix: 不会选题/不会开头/不会表达/不会剪辑/不会转化, each with consequence.",
    "4 before_after: from cannot shoot to stable output; from no traffic to viral method; from no deal to conversion path; from feeling to SOP.",
    "5 three_engines: 内容定位系统 / 爆款表达系统 / 转化成交系统, each with role.",
    "6 timeline: 第1阶段定位与选题 / 第2阶段脚本与表达 / 第3阶段拍摄与剪辑 / 第4阶段发布与转化 / 第5阶段复盘与优化.",
    "7 method: executable methods: 黄金3秒开头公式 / 痛点-冲突-结果脚本 / 5条视频测试选题 / 评论区反推需求 / 私域承接成交路径.",
    "8 case: placeholder case with background, original problem, training action, result change, reusable lesson.",
    "9 sop: default coaching SOP: weekly offline class, weekly online Q&A, daily homework, video critique, community coaching, live recap.",
    "10 pricing: main benefits, bonuses, limited-time benefit, quota limit, suitable audience, unsuitable audience.",
    "11 closing: enroll now, submit diagnosis form, enter learning group, start 30-day coaching.",
    "Use varied layoutType values exactly as the structure implies."
  ].join("\n");
}

function courseFrameworkInstruction(input: GeneratePptRequest) {
  return [
    "For pptType=course, use knowledgeCourseFramework as the core content framework.",
    "This must feel like a consulting-grade knowledge-commerce course sales proposal, not slogan copy.",
    "The deck must answer: why learn, what to learn, how it lands, what result, why now, why trust.",
    "Use concrete industry mechanisms, homework, feedback, cases, pitfalls, review, and bonuses.",
    "Do not fabricate real names or exaggerated data. For cases, use placeholder case structure unless the user supplied real cases.",
    "Every slide should provide decision evidence that makes the user more likely to enroll.",
    "The framework is structure only. Never copy the template wording literally.",
    "Every course slide must include moduleKey and expertInsight.",
    "Every course slide must localize pain points, desire points, methods, homework, pitfalls, and bonuses to the user's industry and keywords.",
    buildCourseFrameworkPrompt(Number(input.slideCount) || 10)
  ].join("\n");
}

function genericInstruction(type: PptType) {
  if (type === "investment") {
    return "For pptType=investment, keep business partnership logic. Do not use course enrollment logic.";
  }
  return "For pptType=event, keep event promotion and sponsorship logic. Do not use course enrollment logic.";
}

function documentInstruction(input: GeneratePptRequest) {
  return [
    "Document to Deck mode.",
    "The user supplied long-form source text. Do not copy the source text by paragraphs.",
    "Before writing the deck, extract a document summary object internally:",
    "{ deckTitle, deckSubtitle, pptType, targetAudience, coreGoal, keySellingPoints }.",
    "Use deckTitle as the returned JSON title and deckSubtitle as the returned JSON subtitle.",
    "deckTitle rules: Chinese title <= 18 Chinese characters; English title <= 8 words; summarize the PPT topic; do not copy the original long text; no line breaks; one line only.",
    "If the source says '我想做一个以AI爆款短视频为核心的30天陪跑课程...', a correct deckTitle is 'AI爆款短视频30天陪跑课'.",
    "First analyze the document, infer the best pptType if needed, identify the topic, audience, objective, key facts, conflict, proof points, and missing logic.",
    "Then decompose it into a complete presentation structure with 8 to 15 slides.",
    "Every slide must be a synthesized decision-ready slide, not a raw excerpt.",
    "Auto-fill missing logic with reasonable consulting structure while staying faithful to the document.",
    "Required internal workflow:",
    "Step 1 content analysis: identify type, topic, audience, goal, key information, tension, proof, and next action.",
    "Step 2 structure breakdown: cover, agenda, problem, outcome, framework, steps, method, case/proof, SOP/execution, pricing/value when relevant, summary/closing.",
    "Step 3 content generation: each slide needs slideTitle, 3-5 concise bullet-like coreContent items, expandedExplanation, decisionValue, visualSuggestion, imagePrompt, imageSearchQuery, imageSearchUrl, and speakerNotes.",
    "Step 4 layout matching: use layoutType values that the current renderer supports. Map problem to problem_matrix, steps to timeline/sop, benefits to before_after/three_engines, methods to method, cases to case, summary to closing.",
    "Step 5 visual generation: visualSuggestion and imageQuery must match the selected theme, industry, and slide intent.",
    "imagePrompt is a concise visual direction shown inside the PPT placeholder.",
    "imageSearchQuery must be English Pexels search keywords. Examples: cover='modern yoga studio calm atmosphere natural light'; case='woman fitness transformation before after'; method='person filming video with smartphone tripod'.",
    "imageSearchUrl must be exactly https://www.pexels.com/search/{encodedQuery}/ using imageSearchQuery.",
    "Avoid repeated slide structures. Avoid direct paragraph splitting. Avoid empty generic slogans.",
    "If the document contains course content, keep course sales logic. If it contains investment/business content, use investment logic. If it contains event content, use event logic.",
    `Target slide count: ${Math.min(Math.max(Number(input.slideCount) || 12, 8), 15)}`
  ].join("\n");
}

function outputLanguageInstruction(language = "zh") {
  if (language === "en") {
    return [
      "Output language: English.",
      "Every text field in the returned PPT JSON must be written in English.",
      "Use native business English, like an industry expert and consulting advisor.",
      "Avoid Chinglish, literal translation, and Chinese punctuation.",
      "Keep the industry expert logic, conversion logic, and complete deck structure unchanged."
    ].join("\n");
  }

  if (language === "bilingual") {
    return [
      "Output language: bilingual.",
      "slideTitle and subtitle must include Chinese + English.",
      "Body content should be primarily Simplified Chinese with concise English support.",
      "Keep the industry expert logic, conversion logic, and complete deck structure unchanged."
    ].join("\n");
  }

  return [
    "Output language: Simplified Chinese.",
    "Every text field in the returned PPT JSON must be written in Simplified Chinese.",
    "Use Chinese industry expert language.",
    "Keep the industry expert logic, conversion logic, and complete deck structure unchanged."
  ].join("\n");
}

export async function generateOutline(input: GeneratePptRequest): Promise<PptOutline> {
  if (!hasAiProviderKey()) {
    throw new Error(process.env.MODEL_PROVIDER === "kimi" ? "Missing KIMI_API_KEY" : "Missing OPENAI_API_KEY");
  }

  const userInsight = extractUserInputInsight(input);

  if (input.inputMode === "document") {
    const instructions = [
      "Return only JSON matching the schema.",
      outputLanguageInstruction(input.outputLanguage || "zh"),
      "Write like a senior consultant turning a document into a client-ready deck.",
      userInputConstraint(userInsight),
      input.autoModeContext ? "Auto Mode is active. Use autoModeContext from requirements as the complete brief before writing slides." : "",
      input.industryResearch ? industryResearchPrompt(input.industryResearch) : "",
      documentInstruction(input),
      "Use these layoutType values only: cover, agenda, problem_matrix, before_after, three_engines, timeline, method, case, sop, pricing, closing.",
      "For each slide, coreContent represents bulletPoints. Use 3-5 items unless the slide needs 6 execution items.",
      "Every slide must include moduleKey and expertInsight.",
      "Every slide must include imagePrompt, imageSearchQuery, and imageSearchUrl.",
      "imageSearchQuery must be English Pexels search keywords based on industry and page type.",
      "imageSearchUrl must be exactly https://www.pexels.com/search/{encodedQuery}/ using imageSearchQuery.",
      "Every slide must include imageRequired. Set true for cover, case, method, result/before_after pages."
    ].join("\n");
    const prompt = [
      `inputMode: document`,
      `selectedPptType: ${input.pptType}`,
      `topic: ${input.topic}`,
      `audience: ${input.audience}`,
      `goal: ${input.goal}`,
      `tone: ${input.tone}`,
      `outputLanguage: ${input.outputLanguage || "zh"}`,
      `sourceDocument:\n${input.requirements || input.topic}`
    ].join("\n");

    const output = await generateJsonContent({
      instructions,
      input: prompt,
      schema: pptOutlineJsonSchema
    });

    let outline = normalizeDocumentOutline(input, JSON.parse(output) as PptOutline);
    const coverage = outlineCoverage(outline, userInsight);

    if (!coverage.passed) {
      const retryOutput = await generateJsonContent({
        instructions: [instructions, coverageRepairInstruction(userInsight, coverage.missingSellingPoints)].join("\n\n"),
        input: prompt,
        schema: pptOutlineJsonSchema
      });
      outline = normalizeDocumentOutline(input, JSON.parse(retryOutput) as PptOutline);
    }

    return repairWithIndustryResearch(input, outline, instructions, prompt, (raw) => normalizeDocumentOutline(input, raw));
  }

  const model = modelFor(input);
  const instructions = [
      "Return only JSON matching the schema.",
      outputLanguageInstruction(input.outputLanguage || "zh"),
      "Write like a consulting firm and commercial coach.",
      userInputConstraint(userInsight),
      input.autoModeContext ? "Auto Mode is active. Use autoModeContext from requirements as the complete brief before writing slides." : "",
      input.industryResearch ? industryResearchPrompt(input.industryResearch) : "",
      "Use specific mechanisms, execution details, decision value, and visual suggestions.",
      "Every slide must include moduleKey and expertInsight.",
      "Every slide must include imagePrompt, imageSearchQuery, and imageSearchUrl.",
      "imageSearchQuery must be English Pexels search keywords based on industry and page type.",
      "imageSearchUrl must be exactly https://www.pexels.com/search/{encodedQuery}/ using imageSearchQuery.",
      "Every slide must include imageRequired. Set true for cover, case, method, result/before_after pages.",
      "For cover use an atmospheric industry image. For case use people/results. For method use tools/workflow/action.",
      "Do not write generic slogans.",
      input.pptType === "course" ? courseFrameworkInstruction(input) : genericInstruction(input.pptType),
      "Use this slide plan:",
      ...model.map(
        (item, index) =>
          `${index + 1}. layoutType=${item.layoutType}; sectionLabel=${item.sectionLabel}; slideTitle=${item.slideTitle}; visual=${item.visualSuggestion}`
      )
    ].join("\n");
  const prompt = [
    `pptType: ${input.pptType}`,
    `topic: ${input.topic}`,
    `audience: ${input.audience}`,
    `goal: ${input.goal}`,
    `tone: ${input.tone}`,
    `outputLanguage: ${input.outputLanguage || "zh"}`,
    `requirements: ${input.requirements || "none"}`
  ].join("\n");

  const output = await generateJsonContent({
    instructions,
    input: prompt,
    schema: pptOutlineJsonSchema
  });

  let outline = normalizeOutline(input, JSON.parse(output) as PptOutline);
  const coverage = outlineCoverage(outline, userInsight);

  if (!coverage.passed) {
    const retryOutput = await generateJsonContent({
      instructions: [instructions, coverageRepairInstruction(userInsight, coverage.missingSellingPoints)].join("\n\n"),
      input: prompt,
      schema: pptOutlineJsonSchema
    });
    outline = normalizeOutline(input, JSON.parse(retryOutput) as PptOutline);
  }

  return repairWithIndustryResearch(input, outline, instructions, prompt, (raw) => normalizeOutline(input, raw));
}
