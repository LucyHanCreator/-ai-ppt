import type { ColorPalette, PptType, StylePreset } from "@/lib/types";

export type Locale = "zh" | "en";

export const i18n = {
  zh: {
    navGenerate: "开始生成",
    languageZh: "中文",
    languageEn: "英文",
    navBrand: "AI商业PPT",
    landingKicker: "为成交而设计的 AI PPT 生成器",
    landingHeadline: "把一个想法变成高级商业PPT。",
    landingSubhead: "自动生成咨询级大纲、行业化叙事、高级版式，并导出可打开的 PowerPoint 文件。",
    landingProof: ["行业专家引擎", "行业视觉系统", "PPTX 文件导出"],
    createDeck: "创建 PPT",
    aiSaas: "AI SaaS",
    courseIdea: "课程想法",
    courseIdeaValue: "面向创始人的短视频变现课",
    audience: "目标人群",
    audienceValue: "个人创作者、教练和小团队",
    generatePremiumDeck: "生成高级 PPT",
    previewLabel: "课程策略",
    previewTitle: "从零散想法到可售卖课程路径",
    previewDesc: "定位、结果、证明、方法与转化流程。",
    contentFit: "内容匹配",
    formTitle: "生成你的课程PPT",
    formDescription: "内置专家逻辑，快速生成可下载 PPT。",
    autoModeTitle: "用一句话生成你的PPT",
    autoModeSubtitle: "AI自动识别类型、行业、目标用户与卖点，生成可直接使用的专业PPT",
    tabs: {
      auto: "一句话生成",
      standard: "常规输入"
    },
    inputModeLabel: "输入模式",
    aiHelperButton: "AI帮我整理想法",
    autoInputLabel: "用一句话描述你想生成的PPT",
    autoInputHelper: "AI会自动识别类型、行业、目标用户、痛点与卖点",
    autoInputPlaceholder: "例如：给创业女性做一个30天AI短视频陪跑课",
    autoDetect: "自动识别",
    autoDetectDescription: "AI根据一句话判断类型",
    autoPreviewTitle: "AI自动生成专业PPT",
    autoPreviewSteps: ["类型识别", "行业逻辑", "高级版式"],
    pptType: "PPT类型",
    stylePreset: "视觉风格",
    colorPalette: "配色方案",
    outputLanguage: "输出语言",
    topic: "主题",
    topicPlaceholder: "例如：短视频变现课程，面向创业女性",
    goal: "目标",
    goalPlaceholder: "例如：让学员愿意报名并进入30天陪跑",
    tone: "语气",
    toneDefault: "专业、清晰、有商业说服力",
    slideCount: "页数",
    slideUnit: "页",
    requirements: "补充要求",
    requirementsPlaceholder: "例如：强调课程结果、学员案例、陪跑机制",
    submitIdle: "生成PPT",
    submitLoading: "生成中...",
    submitDone: "生成完成",
    hintSpecific: "请填写具体人群和明确目标。",
    hintSlides: "MVP 支持 5 到 12 页。",
    additionalTitle: "补充信息（可提升生成质量）",
    additionalDesc: "填写越完整，生成的PPT越精准",
    progress: {
      generating: "正在生成PPT",
      generatingFile: "正在生成PPT文件，请稍候...",
      complex: "内容较复杂，正在继续生成，请稍候...",
      complete: "生成完成",
      autoEstimate: "预计 10–20 秒",
      standardEstimate: "预计 15–30 秒",
      steps: ["分析行业", "构建结构", "生成内容", "优化表达", "设计版式", "插入图片"]
    },
    outputOptions: {
      zh: "中文",
      en: "英文",
      bilingual: "中英双语"
    },
    pptTypes: {
      investment: "招商PPT",
      course: "课程PPT",
      event: "活动PPT"
    },
    pptTypeDescriptions: {
      investment: "适合项目招商、商业合作、融资路演与资源洽谈。",
      course: "适合知识付费、培训课程、公开课和企业内训。",
      event: "适合峰会、沙龙、发布会、品牌活动与赞助方案。"
    },
    previewByType: {
      investment: {
        title: "专家逻辑生成招商方案",
        steps: ["商业逻辑", "盈利模型", "投资说服"]
      },
      course: {
        title: "专家逻辑生成课程方案",
        steps: ["内容结构", "成交路径", "高转化表达"]
      },
      event: {
        title: "专家逻辑生成活动方案",
        steps: ["活动亮点", "传播结构", "执行路径"]
      }
    },
    formByType: {
      investment: {
        title: "生成你的招商PPT",
        subtitle: "内置商业与融资逻辑，快速生成有说服力的招商方案"
      },
      course: {
        title: "生成你的课程PPT",
        subtitle: "内置教学与转化逻辑，快速生成可售卖课程内容"
      },
      event: {
        title: "生成你的活动PPT",
        subtitle: "内置活动策划逻辑，快速生成完整活动方案"
      }
    },
    topicByType: {
      investment: {
        label: "一句话描述你的项目或商业模式",
        placeholder: "例如：跨境电商平台，面向澳洲市场，年增长200%",
        helperText: "输入你的项目，AI将生成完整商业与成交结构"
      },
      course: {
        label: "一句话描述你的课程",
        placeholder: "例如：30天短视频变现课程，面向创业女性",
        helperText: "输入你的课程，AI将生成完整课程与转化逻辑"
      },
      event: {
        label: "一句话描述你的活动",
        placeholder: "例如：女性成长峰会，面向30-45岁职场女性",
        helperText: "输入你的活动，AI将生成活动策划与传播方案"
      }
    },
    styleOptions: {
      auto: "自动",
      business: "商务",
      luxury: "轻奢",
      wellness: "疗愈",
      dynamic: "动感",
      playful: "活泼"
    } satisfies Record<StylePreset, string>,
    paletteLabels: {
      navy_gold: "深蓝金",
      graphite_blue: "石墨蓝",
      executive_grey: "高级灰",
      black_white: "黑白极简",
      deep_green: "深绿商务",
      champagne_gold: "香槟金",
      cream_rose: "奶油玫瑰",
      black_gold: "黑金",
      pearl_white: "珍珠白",
      mocha_brown: "摩卡棕",
      sage_green: "鼠尾草绿",
      soft_mint: "柔和薄荷",
      warm_beige: "暖米色",
      natural_clay: "自然陶土",
      calm_blue: "静谧蓝",
      electric_blue: "电光蓝",
      neon_purple: "霓虹紫",
      dark_tech: "深色科技",
      orange_energy: "活力橙",
      cyber_green: "赛博绿",
      candy_pastel: "糖果粉彩",
      kids_bright: "儿童亮彩",
      sky_yellow: "天空黄",
      peach_mint: "蜜桃薄荷",
      cartoon_blue: "卡通蓝"
    } satisfies Record<ColorPalette, string>,
    promptAssistant: {
      title: "AI提示词助手",
      desc: "回答几个问题，AI会整理成可直接生成PPT的高质量提示词。",
      close: "关闭",
      q1: "1. 你想做什么类型的PPT？",
      q2: "2. 你的目标用户是谁？",
      q2Placeholder: "例如：创业女性、企业主、门店老板",
      q3: "3. 你希望对方看完后做什么？",
      q3Placeholder: "例如：报名课程、预约咨询、参与活动",
      q4: "4. 你的核心卖点是什么？",
      q4Placeholder: "例如：30天陪跑、真实案例、老师逐条点评",
      q5: "5. 有没有必须强调的内容？",
      q5Placeholder: "例如：价格权益、名额限制、行业案例、交付方式",
      submit: "生成提示词",
      loading: "正在生成..."
    },
    errors: {
      buildPrompt: "提示词生成失败。",
      outline: "大纲生成失败。",
      pptx: "PPTX生成失败。"
    }
  },
  en: {
    navGenerate: "Generate",
    languageZh: "Chinese",
    languageEn: "English",
    navBrand: "AI Business PPT",
    landingKicker: "AI PPT generator designed to sell",
    landingHeadline: "Turn one idea into a premium business PPT.",
    landingSubhead: "Generate consulting-grade outlines, industry-aware narratives, premium layouts, and downloadable PowerPoint files in one calm workflow.",
    landingProof: ["Industry expert engine", "Theme-aware design", "Real PPTX export"],
    createDeck: "Create deck",
    aiSaas: "AI SaaS",
    courseIdea: "Course idea",
    courseIdeaValue: "Short video monetization for founders",
    audience: "Audience",
    audienceValue: "Solo creators, coaches, and small teams",
    generatePremiumDeck: "Generate premium deck",
    previewLabel: "Course strategy",
    previewTitle: "From scattered ideas to a sellable learning path",
    previewDesc: "Positioning, outcomes, proof, methods, and conversion flow.",
    contentFit: "Content fit",
    formTitle: "Generate your course PPT",
    formDescription: "Built with expert logic. Ready in seconds.",
    autoModeTitle: "Generate your PPT in one sentence",
    autoModeSubtitle: "AI identifies type, industry, audience, and selling points to create a ready-to-use professional PPT.",
    tabs: {
      auto: "One-sentence",
      standard: "Standard"
    },
    inputModeLabel: "Input mode",
    aiHelperButton: "Help me build prompt",
    autoInputLabel: "Describe your PPT in one sentence",
    autoInputHelper: "AI will infer type, industry, audience, pain points, and selling points.",
    autoInputPlaceholder: "Example: a 30-day AI short-video coaching course for female founders",
    autoDetect: "Automatic recognition",
    autoDetectDescription: "AI infers the PPT type from your sentence.",
    autoPreviewTitle: "AI automatically generates a professional PPT",
    autoPreviewSteps: ["Type recognition", "Industry logic", "Premium layout"],
    pptType: "PPT type",
    stylePreset: "Visual style",
    colorPalette: "Color palette",
    outputLanguage: "Output language",
    topic: "Topic",
    topicPlaceholder: "Example: short video monetization course for female founders",
    goal: "Goal",
    goalPlaceholder: "Example: persuade learners to enroll in a 30-day coaching program",
    tone: "Tone",
    toneDefault: "professional, clear, commercially persuasive",
    slideCount: "Slide count",
    slideUnit: "slides",
    requirements: "Additional requirements",
    requirementsPlaceholder: "Example: emphasize course outcomes, learner cases, and coaching mechanism",
    submitIdle: "Generate Your PPT",
    submitLoading: "Generating...",
    submitDone: "Generation complete",
    hintSpecific: "Use a specific audience and business goal.",
    hintSlides: "The MVP generates 5 to 12 slides.",
    additionalTitle: "Additional details for better results",
    additionalDesc: "The more complete your input, the more precise the PPT.",
    progress: {
      generating: "Generating your PPT",
      generatingFile: "Generating the PPT file, please wait...",
      complex: "The content is more complex. Still generating, please wait...",
      complete: "Generation complete",
      autoEstimate: "Estimated 10-20 seconds",
      standardEstimate: "Estimated 15-30 seconds",
      steps: ["Analyze industry", "Build structure", "Generate content", "Refine copy", "Design layout", "Insert images"]
    },
    outputOptions: {
      zh: "Chinese",
      en: "English",
      bilingual: "Bilingual"
    },
    pptTypes: {
      investment: "Investment Promotion PPT",
      course: "Course PPT",
      event: "Event PPT"
    },
    pptTypeDescriptions: {
      investment: "For investment promotion, partnerships, fundraising, and commercial collaboration.",
      course: "For paid courses, training programs, workshops, and corporate learning.",
      event: "For summits, salons, launches, brand events, and sponsorship proposals."
    },
    previewByType: {
      investment: {
        title: "Expert Logic Generation Investment Plan",
        steps: ["Business Logic", "Profit Model", "Investor Persuasion"]
      },
      course: {
        title: "Expert Logic Generation Course Plan",
        steps: ["Content Structure", "Conversion Path", "High-conversion Expression"]
      },
      event: {
        title: "Expert Logic Generation Event Plan",
        steps: ["Event Highlights", "Promotion Structure", "Execution Path"]
      }
    },
    formByType: {
      investment: {
        title: "Generate your investment PPT",
        subtitle: "Built with business and funding logic for persuasive partnership decks."
      },
      course: {
        title: "Generate your course PPT",
        subtitle: "Built with teaching and conversion logic for sellable course content."
      },
      event: {
        title: "Generate your event PPT",
        subtitle: "Built with event planning logic for complete event proposals."
      }
    },
    topicByType: {
      investment: {
        label: "Describe your project or business model in one sentence",
        placeholder: "Example: Cross-border e-commerce platform for Australia, growing 200% YoY",
        helperText: "Enter your project. AI will build the business logic and conversion structure."
      },
      course: {
        label: "Describe your course in one sentence",
        placeholder: "Example: 30-day short video monetization course for female founders",
        helperText: "Enter your course. AI will build the course logic and conversion flow."
      },
      event: {
        label: "Describe your event in one sentence",
        placeholder: "Example: Women leadership summit for professionals aged 30-45",
        helperText: "Enter your event. AI will build the event plan and promotion strategy."
      }
    },
    styleOptions: {
      auto: "Auto",
      business: "Business",
      luxury: "Luxury",
      wellness: "Wellness",
      dynamic: "Dynamic",
      playful: "Playful"
    } satisfies Record<StylePreset, string>,
    paletteLabels: {
      navy_gold: "Navy Gold",
      graphite_blue: "Graphite Blue",
      executive_grey: "Executive Grey",
      black_white: "Black White",
      deep_green: "Deep Green",
      champagne_gold: "Champagne Gold",
      cream_rose: "Cream Rose",
      black_gold: "Black Gold",
      pearl_white: "Pearl White",
      mocha_brown: "Mocha Brown",
      sage_green: "Sage Green",
      soft_mint: "Soft Mint",
      warm_beige: "Warm Beige",
      natural_clay: "Natural Clay",
      calm_blue: "Calm Blue",
      electric_blue: "Electric Blue",
      neon_purple: "Neon Purple",
      dark_tech: "Dark Tech",
      orange_energy: "Orange Energy",
      cyber_green: "Cyber Green",
      candy_pastel: "Candy Pastel",
      kids_bright: "Kids Bright",
      sky_yellow: "Sky Yellow",
      peach_mint: "Peach Mint",
      cartoon_blue: "Cartoon Blue"
    } satisfies Record<ColorPalette, string>,
    promptAssistant: {
      title: "AI Prompt Assistant",
      desc: "Answer a few questions and AI will turn them into a deck-ready prompt.",
      close: "Close",
      q1: "1. What type of PPT do you want?",
      q2: "2. Who is your target audience?",
      q2Placeholder: "Example: founders, store owners, course buyers",
      q3: "3. What should they do after viewing?",
      q3Placeholder: "Example: enroll, book a call, sponsor the event",
      q4: "4. What are your key selling points?",
      q4Placeholder: "Example: 30-day coaching, proof cases, expert feedback",
      q5: "5. Anything that must be emphasized?",
      q5Placeholder: "Example: pricing, limited seats, proof, delivery model",
      submit: "Build prompt",
      loading: "Building..."
    },
    errors: {
      buildPrompt: "Failed to build prompt.",
      outline: "Failed to generate outline.",
      pptx: "Failed to generate PPTX."
    }
  }
} as const;

export function normalizeLocale(value: string | string[] | undefined): Locale {
  const locale = Array.isArray(value) ? value[0] : value;
  return locale === "zh" ? "zh" : "en";
}

export function getI18n(locale: Locale) {
  return i18n[locale];
}
