import type { LayoutType, PptSlide } from "@/lib/types";

export type SectionKey = "problem" | "result" | "case" | "method" | "action";

export const sectionLabels = {
  yoga_fitness: {
    problem: "身体现状与不适",
    result: "练习后的身体变化",
    case: "学员练习变化",
    method: "每日练习方法",
    action: "打卡与陪练机制"
  },
  beauty: {
    problem: "门店经营现状",
    result: "客户与业绩变化",
    case: "门店成交案例",
    method: "项目与成交路径",
    action: "门店执行SOP"
  },
  short_video: {
    problem: "内容现状",
    result: "流量与转化结果",
    case: "爆款与转化案例",
    method: "内容与转化方法",
    action: "每日创作任务"
  },
  business_sales: {
    problem: "当前成交瓶颈",
    result: "成交结果变化",
    case: "成交拆解案例",
    method: "成交流程与话术",
    action: "跟进与复盘机制"
  },
  personal_ip: {
    problem: "个人品牌现状",
    result: "身份与信任变化",
    case: "IP成长案例",
    method: "定位与内容系统",
    action: "表达与转化任务"
  },
  default: {
    problem: "当前问题",
    result: "学习后的变化",
    case: "真实案例",
    method: "核心方法",
    action: "行动与执行"
  }
} as const;

export type SectionIndustry = keyof typeof sectionLabels;

type Heading = {
  slideTitle: string;
  subtitle: string;
};

const headingLibrary: Record<string, Partial<Record<LayoutType, Heading>>> = {
  yoga_fitness: {
    cover: { slideTitle: "30天找回轻盈", subtitle: "适合久坐与体态困扰人群" },
    agenda: { slideTitle: "从不适到习惯", subtitle: "五个板块重建练习节奏" },
    goal: { slideTitle: "身体先松下来", subtitle: "改善从可感知变化开始" },
    problem_matrix: { slideTitle: "紧绷不是小事", subtitle: "肩颈腰背都在提醒你" },
    before_after: { slideTitle: "从僵硬到舒展", subtitle: "让身体重新有支撑" },
    three_engines: { slideTitle: "三步改善体态", subtitle: "释放激活再稳定" },
    timeline: { slideTitle: "30天陪练路径", subtitle: "每天15分钟可坚持" },
    method: { slideTitle: "动作做对才有效", subtitle: "不追高难度，先要标准" },
    case: { slideTitle: "变化来自记录", subtitle: "用打卡看见身体反馈" },
    sop: { slideTitle: "有人陪更容易练", subtitle: "纠正动作，稳定习惯" },
    pricing: { slideTitle: "权益围绕坚持", subtitle: "计划、点评、社群都清楚" },
    closing: { slideTitle: "今天先做评估", subtitle: "从一次轻练习开始" }
  },
  beauty: {
    cover: { slideTitle: "让项目更好卖", subtitle: "面向美容院与抗衰门店" },
    agenda: { slideTitle: "从体验到复购", subtitle: "五步梳理门店增长路径" },
    goal: { slideTitle: "客户先感知变化", subtitle: "成交来自看得见的效果" },
    problem_matrix: { slideTitle: "门店卡在信任", subtitle: "不是项目少，是表达弱" },
    before_after: { slideTitle: "从低复购到稳定", subtitle: "把体验设计成疗程入口" },
    three_engines: { slideTitle: "三套门店引擎", subtitle: "项目、案例、顾问协同" },
    timeline: { slideTitle: "门店训练路径", subtitle: "从面诊到老客激活" },
    method: { slideTitle: "疗程成交有路径", subtitle: "面诊、体验、案例要连上" },
    case: { slideTitle: "案例不是晒图", subtitle: "要讲清变化与动作" },
    sop: { slideTitle: "门店每天照表做", subtitle: "顾问、护理、回访同步" },
    pricing: { slideTitle: "权益锚定价值", subtitle: "主课、赠品、限时权益清楚" },
    closing: { slideTitle: "先做门店诊断", subtitle: "明确项目和转化卡点" }
  },
  short_video: {
    cover: { slideTitle: "内容带来客户", subtitle: "面向想获客的创作者" },
    agenda: { slideTitle: "从不会拍到能转化", subtitle: "五步建立内容增长闭环" },
    goal: { slideTitle: "先跑通一条内容线", subtitle: "用数据验证选题方向" },
    problem_matrix: { slideTitle: "内容卡在前3秒", subtitle: "选题、开头、转化都要重做" },
    before_after: { slideTitle: "从乱发到稳定获客", subtitle: "让内容有节奏和承接" },
    three_engines: { slideTitle: "三套增长系统", subtitle: "定位、脚本、转化一起跑" },
    timeline: { slideTitle: "30天内容训练", subtitle: "每天输出，周周复盘" },
    method: { slideTitle: "爆款不是靠感觉", subtitle: "用公式测试选题和脚本" },
    case: { slideTitle: "拆出可复制动作", subtitle: "不看热闹，只看路径" },
    sop: { slideTitle: "每天都有创作任务", subtitle: "选题、拍摄、发布、复盘" },
    pricing: { slideTitle: "权益服务于结果", subtitle: "模板、点评、陪跑要落地" },
    closing: { slideTitle: "今天建选题库", subtitle: "先完成账号诊断" }
  },
  business_sales: {
    cover: { slideTitle: "让成交有流程", subtitle: "面向老板与销售团队" },
    agenda: { slideTitle: "从瓶颈到复盘", subtitle: "五步重建成交系统" },
    goal: { slideTitle: "先看清成交卡点", subtitle: "用流程替代个人发挥" },
    problem_matrix: { slideTitle: "成交卡在判断", subtitle: "需求、报价、跟进都要拆" },
    before_after: { slideTitle: "从被动到可控", subtitle: "让每次跟进有依据" },
    three_engines: { slideTitle: "三套成交系统", subtitle: "诊断、锚定、跟进闭环" },
    timeline: { slideTitle: "成交训练路径", subtitle: "从需求诊断到复盘优化" },
    method: { slideTitle: "话术背后是判断", subtitle: "先判断需求，再设计报价" },
    case: { slideTitle: "拆解真实成交", subtitle: "看清客户为什么下单" },
    sop: { slideTitle: "跟进必须标准化", subtitle: "每一步都有目标和记录" },
    pricing: { slideTitle: "权益对应成交结果", subtitle: "训练、陪跑、复盘都明确" },
    closing: { slideTitle: "先做成交诊断", subtitle: "找出最先修复的环节" }
  },
  personal_ip: {
    cover: { slideTitle: "让别人记住你", subtitle: "面向创始人与专业个体" },
    agenda: { slideTitle: "从模糊到清晰", subtitle: "五步建立个人品牌资产" },
    goal: { slideTitle: "身份先被看见", subtitle: "标签清楚，内容才有效" },
    problem_matrix: { slideTitle: "表达没有记忆点", subtitle: "定位、故事、栏目都分散" },
    before_after: { slideTitle: "从发内容到建信任", subtitle: "让用户知道为何选择你" },
    three_engines: { slideTitle: "三套信任资产", subtitle: "定位、内容、证明协同" },
    timeline: { slideTitle: "IP打造路径", subtitle: "从身份到高客单产品" },
    method: { slideTitle: "内容要服务身份", subtitle: "栏目、故事、证明要一致" },
    case: { slideTitle: "看见成长路径", subtitle: "不是包装，是信任积累" },
    sop: { slideTitle: "每天表达有主题", subtitle: "栏目化输出更稳定" },
    pricing: { slideTitle: "权益支持长期表达", subtitle: "定位、模板、陪跑都清楚" },
    closing: { slideTitle: "先做身份诊断", subtitle: "确定你的核心标签" }
  },
  default: {
    cover: { slideTitle: "把结果讲清楚", subtitle: "面向真正需要改变的人" },
    agenda: { slideTitle: "从问题到行动", subtitle: "五个板块完成学习闭环" },
    goal: { slideTitle: "先明确学习结果", subtitle: "知道为什么学，才愿意学" },
    problem_matrix: { slideTitle: "问题不是表面", subtitle: "先看清真正卡点" },
    before_after: { slideTitle: "学习前后要不同", subtitle: "变化必须具体可感知" },
    three_engines: { slideTitle: "三套核心方法", subtitle: "从理解到执行" },
    timeline: { slideTitle: "学习路径清楚", subtitle: "按阶段完成训练" },
    method: { slideTitle: "方法必须能落地", subtitle: "不是概念，而是动作" },
    case: { slideTitle: "案例证明路径", subtitle: "看见可复制经验" },
    sop: { slideTitle: "执行需要机制", subtitle: "任务、反馈、复盘同步" },
    pricing: { slideTitle: "权益对应结果", subtitle: "看清适合与不适合" },
    closing: { slideTitle: "下一步要明确", subtitle: "先完成诊断和行动" }
  }
};

export function getSectionLabels(courseIndustry?: string) {
  if (courseIndustry && courseIndustry in sectionLabels) {
    return sectionLabels[courseIndustry as SectionIndustry];
  }

  return sectionLabels.default;
}

export function getSectionKey(layoutType: LayoutType): SectionKey {
  if (layoutType === "problem_matrix") return "problem";
  if (layoutType === "before_after" || layoutType === "goal" || layoutType === "cover") return "result";
  if (layoutType === "case") return "case";
  if (layoutType === "pricing" || layoutType === "closing") return "action";
  return "method";
}

export function rewriteSectionHeading(courseIndustry: string | undefined, slide: PptSlide): Pick<PptSlide, "sectionLabel" | "slideTitle" | "subtitle"> {
  const labels = getSectionLabels(courseIndustry);
  const sectionKey = getSectionKey(slide.layoutType);
  const industryKey = courseIndustry && courseIndustry in headingLibrary ? courseIndustry : "default";
  const heading = headingLibrary[industryKey]?.[slide.layoutType] || headingLibrary.default[slide.layoutType];

  return {
    sectionLabel: labels[sectionKey],
    slideTitle: heading?.slideTitle || slide.slideTitle,
    subtitle: heading?.subtitle || slide.subtitle
  };
}
