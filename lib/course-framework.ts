export type CourseFrameworkModuleKey =
  | "opening_awareness"
  | "pain_deep_dive"
  | "desire_preview"
  | "case_breakdown"
  | "core_methods"
  | "practical_homework"
  | "pitfall_guide"
  | "review_summary"
  | "bonus_value";

export type CourseFrameworkModule = {
  moduleKey: CourseFrameworkModuleKey;
  name: string;
  purpose: string;
  contentDirections: string[];
};

export const knowledgeCourseFramework: {
  coreLogic: string;
  closedLoop: string[];
  priorityRules: string[];
  modules: CourseFrameworkModule[];
  pageCountRules: Record<string, string>;
  selfReviewChecklist: string[];
} = {
  coreLogic:
    "以用户痛点为入口，用爽点建立期待，靠案例强化信任，用方法交付价值，以作业落地效果，补充认知、避坑、复盘、福利模块，形成完整课程成交闭环。",
  closedLoop: ["认知", "方法", "实操", "复盘"],
  priorityRules: [
    "第一优先级：用户输入的关键词和卖点",
    "第二优先级：行业专家知识库",
    "第三优先级：knowledgeCourseFramework",
    "第四优先级：AI自由补充"
  ],
  modules: [
    {
      moduleKey: "opening_awareness",
      name: "开篇破局",
      purpose: "认知唤醒，直击核心",
      contentDirections: [
        "课程导言：为什么学了很多方法仍无法落地",
        "行业真相：90%的人踩过的认知误区",
        "核心痛点自查：3分钟找准问题",
        "课程交付承诺：学完能拿到的3个具体结果"
      ]
    },
    {
      moduleKey: "pain_deep_dive",
      name: "痛点深挖",
      purpose: "戳中痒点，唤醒需求",
      contentDirections: [
        "新手入门难，无从下手",
        "有基础但不会落地",
        "踩坑无数，走弯路、花冤枉钱",
        "碎片化学习，无法形成闭环",
        "遇到问题无人解答，容易放弃",
        "痛点根源：不是你不行，是方法不对",
        "解决痛点后的改变"
      ]
    },
    {
      moduleKey: "desire_preview",
      name: "爽点前置",
      purpose: "看见结果，建立信心",
      contentDirections: [
        "新手快速入门，短期拿到结果",
        "进阶学员突破瓶颈",
        "踩坑用户成功避坑",
        "学习后的爽点场景",
        "从0到1的成长路径"
      ]
    },
    {
      moduleKey: "case_breakdown",
      name: "案例拆解",
      purpose: "直观借鉴，强化信任",
      contentDirections: [
        "新手成功路径",
        "进阶学员突破路径",
        "踩坑学员复盘调整路径",
        "反面案例：高频踩坑",
        "从案例中提炼可复用规律"
      ]
    },
    {
      moduleKey: "core_methods",
      name: "核心方法",
      purpose: "干货交付，即学即用",
      contentDirections: [
        "基础方法：新手快速入门",
        "进阶方法：突破瓶颈，提升效率",
        "高阶方法：精准破局，实现升级",
        "方法总结：一张图掌握核心方法"
      ]
    },
    {
      moduleKey: "practical_homework",
      name: "实操作业",
      purpose: "落地践行，巩固效果",
      contentDirections: [
        "基础作业：掌握核心操作",
        "进阶作业：解决实际问题",
        "综合作业：形成完整解决方案",
        "作业反馈：共性问题讲解，个性问题指导"
      ]
    },
    {
      moduleKey: "pitfall_guide",
      name: "避坑指南",
      purpose: "少走弯路，高效成长",
      contentDirections: ["行业高频避坑清单", "避坑技巧", "学员避坑经验分享"]
    },
    {
      moduleKey: "review_summary",
      name: "复盘总结",
      purpose: "沉淀经验，持续升级",
      contentDirections: ["课程核心知识点复盘", "个人学习复盘", "常见问题答疑", "后续成长路径"]
    },
    {
      moduleKey: "bonus_value",
      name: "增值福利",
      purpose: "额外赋能，提升满意度",
      contentDirections: ["专属资料包", "工具合集", "案例合集", "学习社群", "长期答疑", "额外加餐"]
    }
  ],
  pageCountRules: {
    "8": "合并开篇破局与痛点深挖，合并避坑指南与复盘总结，保留案例、方法、作业、福利和行动。",
    "10": "完整覆盖核心模块，并让方法或作业至少出现两页。",
    "12": "扩展案例、方法、作业、避坑、福利模块，增加行业化执行细节。",
    "15": "扩展案例、方法、作业、避坑、复盘、福利模块，每个扩展页都必须有行业动作和成交理由。"
  },
  selfReviewChecklist: [
    "是否覆盖认知、痛点、结果、案例、方法、作业、复盘中的核心环节",
    "是否结合具体行业，而不是原样复制模板文字",
    "是否体现用户输入关键词和卖点",
    "是否有清晰成交逻辑",
    "是否可直接用于课程销售"
  ]
};

export function selectCourseFrameworkModules(slideCount: number): CourseFrameworkModule[] {
  const core: CourseFrameworkModuleKey[] = [
    "opening_awareness",
    "pain_deep_dive",
    "desire_preview",
    "case_breakdown",
    "core_methods",
    "practical_homework",
    "review_summary",
    "bonus_value"
  ];
  const expanded: CourseFrameworkModuleKey[] = slideCount >= 10 ? ["pitfall_guide"] : [];
  const priority = slideCount >= 12 ? [...core, "pitfall_guide", "case_breakdown", "core_methods", "practical_homework"] : [...core, ...expanded];
  const selected = priority.slice(0, Math.max(8, Math.min(slideCount, 15)));

  return selected
    .map((moduleKey) => knowledgeCourseFramework.modules.find((module) => module.moduleKey === moduleKey))
    .filter((module): module is CourseFrameworkModule => Boolean(module));
}

export function buildCourseFrameworkPrompt(slideCount: number) {
  const selected = selectCourseFrameworkModules(slideCount);
  const countKey = slideCount >= 12 ? String(Math.min(slideCount, 15)) : String(slideCount);
  const pageRule = knowledgeCourseFramework.pageCountRules[countKey] || knowledgeCourseFramework.pageCountRules["10"];

  return [
    "Knowledge Course Framework:",
    "If pptType=course, the following framework is mandatory and has priority over generic AI completion.",
    `Core logic: ${knowledgeCourseFramework.coreLogic}`,
    `Closed loop: ${knowledgeCourseFramework.closedLoop.join(" -> ")}`,
    "Priority rules:",
    ...knowledgeCourseFramework.priorityRules.map((rule) => `- ${rule}`),
    `Page-count rule: ${pageRule}`,
    "Selected framework modules for this deck:",
    ...selected.map(
      (module, index) =>
        `${index + 1}. moduleKey=${module.moduleKey}; name=${module.name}; purpose=${module.purpose}; directions=${module.contentDirections.join(" / ")}`
    ),
    "Generation rules:",
    "- Do not copy the template wording literally.",
    "- Replace all generic course problems, methods, homework, cases, pitfalls, and bonuses with the user's industry-specific content.",
    "- Every course slide must include moduleKey, sectionLabel, slideTitle, subtitle, keyMessage, expertInsight, coreContent, decisionValue, imageQuery.",
    "- Every slide must reflect the user's keywords and selling points whenever possible.",
    "- Do not write generic slogans or only titles.",
    "Industry replacement examples:",
    "- AI short-video course pain points: won't choose topics, afraid to appear on camera, cannot shoot, cannot edit, cannot use AI workflow.",
    "- AI short-video course methods: golden 3-second hook, viral topic system, camera expression, editing rhythm, AI tool workflow.",
    "- AI short-video course homework: publish one video daily, submit scripts, filming practice, AI tool practice, mentor review.",
    "- Yoga posture course methods: shoulder-neck release, lower-back relief, core activation, breathing practice, daily check-in.",
    "Self-review checklist:",
    ...knowledgeCourseFramework.selfReviewChecklist.map((item) => `- ${item}`)
  ].join("\n");
}
