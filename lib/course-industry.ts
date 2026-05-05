export type CourseIndustry =
  | "yoga_fitness"
  | "short_video"
  | "beauty"
  | "business_sales"
  | "general_course";

export type CourseIndustryInsight = {
  courseIndustry: CourseIndustry;
  targetAudience: string;
  industryPainPoints: string[];
  desiredOutcomes: string[];
  commonMethods: string[];
  courseSellingAngles: string[];
  visualKeywords: string[];
};

type IndustryRule = CourseIndustryInsight & {
  keywords: string[];
};

type IndustryInput = {
  topic?: string;
  audience?: string;
  goal?: string;
  requirements?: string;
};

const industryRules: IndustryRule[] = [
  {
    courseIndustry: "yoga_fitness",
    keywords: ["瑜伽", "普拉提", "健身", "塑形", "体态", "肩颈", "腰背", "冥想"],
    targetAudience: "久坐人群 / 女性用户 / 体态改善需求者",
    industryPainPoints: ["肩颈紧张", "腰背酸痛", "体态不好", "核心无力", "焦虑失眠", "难以坚持"],
    desiredOutcomes: ["身体柔软", "体态改善", "核心稳定", "情绪放松", "形成运动习惯"],
    commonMethods: ["晨间拉伸", "肩颈释放", "核心激活", "呼吸练习", "每日打卡"],
    courseSellingAngles: ["温柔陪跑", "动作纠正", "社群陪伴", "30天改善体态"],
    visualKeywords: ["yoga practice", "pilates class", "body posture", "breathing exercise", "wellness routine"]
  },
  {
    courseIndustry: "short_video",
    keywords: ["短视频", "视频号", "小红书", "抖音", "TikTok", "流量", "爆款"],
    targetAudience: "创业者 / 自由职业者 / 内容创作者",
    industryPainPoints: ["不会选题", "不会开头", "不会表达", "没有流量", "不会转化"],
    desiredOutcomes: ["稳定输出", "获取客户", "形成内容闭环", "提升成交"],
    commonMethods: ["黄金3秒", "痛点脚本", "评论区选题", "私域承接", "复盘优化"],
    courseSellingAngles: ["内容定位", "爆款表达", "获客路径", "转化闭环"],
    visualKeywords: ["social media creator", "short video filming", "content marketing", "growth analytics"]
  },
  {
    courseIndustry: "beauty",
    keywords: ["美业", "美容", "皮肤", "抗衰", "瘦身", "轻医美"],
    targetAudience: "美业门店主 / 美容顾问 / 皮肤管理从业者",
    industryPainPoints: ["客户信任不足", "服务同质化", "复购低", "不会展示效果"],
    desiredOutcomes: ["打造专业形象", "提升客户信任", "增加复购", "建立案例库"],
    commonMethods: ["前后对比", "客户见证", "项目体验", "服务流程标准化"],
    courseSellingAngles: ["专业背书", "效果可视化", "案例成交", "复购经营"],
    visualKeywords: ["beauty salon", "skin care consultation", "before after skincare", "professional service"]
  },
  {
    courseIndustry: "business_sales",
    keywords: ["销售", "成交", "招商", "商业", "老板", "企业主"],
    targetAudience: "销售团队 / 创业者 / 企业主",
    industryPainPoints: ["客户需求不清", "话术无力", "报价被压", "跟进混乱"],
    desiredOutcomes: ["提升成交率", "建立成交流程", "提高客单价"],
    commonMethods: ["需求诊断", "异议处理", "价值锚定", "跟进SOP"],
    courseSellingAngles: ["成交诊断", "价值表达", "报价策略", "跟进机制"],
    visualKeywords: ["business sales meeting", "negotiation", "team training", "business strategy"]
  }
];

const generalCourse: CourseIndustryInsight = {
  courseIndustry: "general_course",
  targetAudience: "有明确学习目标的学员 / 创业者 / 职场人",
  industryPainPoints: ["学习路径不清", "执行缺少反馈", "结果难以衡量", "难以长期坚持"],
  desiredOutcomes: ["建立系统方法", "形成训练习惯", "获得阶段成果", "提升实际应用能力"],
  commonMethods: ["目标拆解", "模块训练", "作业反馈", "案例复盘", "社群陪跑"],
  courseSellingAngles: ["系统路径", "实操作业", "反馈机制", "成果标准"],
  visualKeywords: ["online course", "learning roadmap", "workshop training", "coaching community"]
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function hasKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(normalize(keyword)));
}

function pickAudience(inputAudience: string, insightAudience: string) {
  const weakValues = new Set(["", "无", "暂无", "不知道", "不确定", "待补充", "未填写", "用户", "学员"]);
  const audience = inputAudience.trim();
  return audience.length >= 2 && !weakValues.has(audience) ? audience : insightAudience;
}

export function getCourseIndustryInsight(input: IndustryInput): CourseIndustryInsight {
  const source = normalize([input.topic, input.audience, input.goal, input.requirements].filter(Boolean).join(" "));
  const matched = industryRules.find((rule) => hasKeyword(source, rule.keywords));
  const base = matched || generalCourse;

  return {
    courseIndustry: base.courseIndustry,
    targetAudience: pickAudience(input.audience || "", base.targetAudience),
    industryPainPoints: [...base.industryPainPoints],
    desiredOutcomes: [...base.desiredOutcomes],
    commonMethods: [...base.commonMethods],
    courseSellingAngles: [...base.courseSellingAngles],
    visualKeywords: [...base.visualKeywords]
  };
}

export function buildIndustryResearchPrompt(industryInsight: CourseIndustryInsight) {
  const forbiddenLogic =
    industryInsight.courseIndustry === "yoga_fitness"
      ? "禁止出现短视频变现、爆款、私域成交、销售话术。"
      : industryInsight.courseIndustry === "short_video"
        ? "禁止套用瑜伽体态、医美护理、销售招商逻辑。"
        : industryInsight.courseIndustry === "beauty"
          ? "禁止套用短视频爆款课或销售招商课逻辑。"
          : industryInsight.courseIndustry === "business_sales"
            ? "禁止套用瑜伽体态、美容护肤或短视频拍摄逻辑。"
            : "不要硬套短视频、销售、美业或瑜伽逻辑。";

  return [
    "你是一位知识付费课程操盘手。生成PPT前，必须先参考以下行业研究摘要。",
    "不要直接套固定模板，要基于行业痛点、方法、结果和卖点组织内容。",
    "",
    "industryInsight:",
    JSON.stringify(industryInsight, null, 2),
    "",
    "生成要求：",
    "1. PPT内容必须引用 industryPainPoints、desiredOutcomes、commonMethods、courseSellingAngles。",
    "2. 每页内容要符合 courseIndustry 的真实行业逻辑。",
    "3. visualSuggestion 要参考 visualKeywords。",
    "4. 如果 courseIndustry 是 general_course，使用通用知识付费结构，不要硬套短视频或销售逻辑。",
    `5. ${forbiddenLogic}`,
    "6. 保持现有 PPT JSON 结构不变。"
  ].join("\n");
}
