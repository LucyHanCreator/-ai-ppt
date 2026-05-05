import { getSectionKey, type SectionKey } from "@/lib/section-labels";
import type { PptOutline, PptSlide } from "@/lib/types";

type HeadingOption = {
  sectionLabel: string;
  slideTitle: string;
  subtitle: string;
};

type IndustryVariationPool = Record<SectionKey, HeadingOption[]>;

const variationPools: Record<string, IndustryVariationPool> = {
  beauty: {
    problem: [
      { sectionLabel: "门店经营现状", slideTitle: "为什么项目卖不动？", subtitle: "问题常在体验设计，而不只是价格" },
      { sectionLabel: "当前门店困境", slideTitle: "客户为什么不复购？", subtitle: "第一次体验没有变化，后续疗程就难推进" },
      { sectionLabel: "真实经营问题", slideTitle: "不是客户少，是信任弱", subtitle: "顾问表达和案例证明决定购买信心" },
      { sectionLabel: "项目转化卡点", slideTitle: "好项目也会卖不动", subtitle: "卖点没有变成客户能感知的结果" },
      { sectionLabel: "复购流失原因", slideTitle: "成交停在第一次体验", subtitle: "缺少疗程路径，客户就只买单次" }
    ],
    result: [
      { sectionLabel: "客户与业绩变化", slideTitle: "从体验走向疗程", subtitle: "让客户看见变化，才愿意继续投入" },
      { sectionLabel: "门店增长结果", slideTitle: "复购开始自然发生", subtitle: "效果、记录、回访形成持续消费理由" },
      { sectionLabel: "成交结果变化", slideTitle: "顾问不再只靠话术", subtitle: "用诊断和案例建立购买判断" },
      { sectionLabel: "客户持续消费", slideTitle: "老客愿意继续买", subtitle: "每次护理都要连接下一次需求" },
      { sectionLabel: "疗程转化结果", slideTitle: "从犹豫到愿意办卡", subtitle: "价值被看见，价格压力才会下降" }
    ],
    case: [
      { sectionLabel: "真实成交案例", slideTitle: "一个案例拆清成交", subtitle: "看背景、动作、变化和可复制经验" },
      { sectionLabel: "门店转化案例", slideTitle: "客户为什么愿意升级？", subtitle: "升级来自感知变化和顾问跟进" },
      { sectionLabel: "客户变化案例", slideTitle: "案例不是简单晒图", subtitle: "要讲清问题、过程和结果变化" },
      { sectionLabel: "项目成交拆解", slideTitle: "疗程成交有路径", subtitle: "从面诊到体验，每步都要承接" },
      { sectionLabel: "复购路径案例", slideTitle: "老客复购怎么发生？", subtitle: "复购来自持续反馈和服务节奏" }
    ],
    method: [
      { sectionLabel: "项目与成交路径", slideTitle: "把项目讲成结果", subtitle: "客户买的不是项目名，而是变化" },
      { sectionLabel: "门店增长方法", slideTitle: "先设计首次体验", subtitle: "体验要让客户当场感知差异" },
      { sectionLabel: "成交关键动作", slideTitle: "顾问式面诊更重要", subtitle: "先判断需求，再推荐疗程" },
      { sectionLabel: "转化流程设计", slideTitle: "成交要靠流程托住", subtitle: "面诊、体验、案例、回访要连贯" },
      { sectionLabel: "标准服务方式", slideTitle: "服务动作必须标准化", subtitle: "团队一致，客户感受才稳定" }
    ],
    action: [
      { sectionLabel: "门店执行SOP", slideTitle: "每天照流程执行", subtitle: "把诊断、护理、回访变成固定动作" },
      { sectionLabel: "落地执行机制", slideTitle: "先跑通一个项目", subtitle: "不要全店改造，先验证单项目路径" },
      { sectionLabel: "日常运营动作", slideTitle: "每天都要有复盘", subtitle: "看成交卡点，不只看到店人数" },
      { sectionLabel: "团队执行路径", slideTitle: "让顾问说同一套话", subtitle: "标准表达减少新人发挥差异" },
      { sectionLabel: "复盘优化机制", slideTitle: "用数据修正流程", subtitle: "复购率和升级率决定下一步动作" }
    ]
  },
  yoga_fitness: {
    problem: [
      { sectionLabel: "身体现状与不适", slideTitle: "身体一直紧着", subtitle: "肩颈腰背在提醒你该放松了" },
      { sectionLabel: "身体发出的信号", slideTitle: "不是累，是身体失衡", subtitle: "久坐和错误发力会让不适反复出现" },
      { sectionLabel: "当前身体困扰", slideTitle: "为什么越休息越僵？", subtitle: "身体缺少正确活动，而不是只缺睡眠" },
      { sectionLabel: "体态问题来源", slideTitle: "体态塌来自无力", subtitle: "核心不稳定，肩颈就更容易代偿" },
      { sectionLabel: "练习前的问题", slideTitle: "坚持不了很正常", subtitle: "动作太难，反馈太少，就容易放弃" }
    ],
    result: [
      { sectionLabel: "练习后的身体变化", slideTitle: "从紧绷到舒展", subtitle: "先让身体变轻，再建立练习习惯" },
      { sectionLabel: "体态改善结果", slideTitle: "身体开始有支撑", subtitle: "核心稳定后，站姿和坐姿都会改变" },
      { sectionLabel: "练习后的反馈", slideTitle: "每天15分钟也有效", subtitle: "小强度、可坚持，变化才会持续" },
      { sectionLabel: "身心变化结果", slideTitle: "呼吸慢下来", subtitle: "身体放松后，情绪也更容易稳定" },
      { sectionLabel: "习惯带来的变化", slideTitle: "练习变成日常", subtitle: "不靠意志硬撑，靠节奏慢慢养成" }
    ],
    case: [
      { sectionLabel: "学员练习变化", slideTitle: "变化不是一夜发生", subtitle: "记录练习动作和身体反馈更可信" },
      { sectionLabel: "练习打卡记录", slideTitle: "坚持看得见", subtitle: "用打卡记录替代夸张承诺" },
      { sectionLabel: "身体反馈案例", slideTitle: "肩颈先松下来", subtitle: "从一个部位变化建立信心" },
      { sectionLabel: "学员改善路径", slideTitle: "从僵硬到敢动", subtitle: "先纠正动作，再逐步增加难度" },
      { sectionLabel: "真实练习过程", slideTitle: "案例要看过程", subtitle: "背景、动作、反馈都要清楚" }
    ],
    method: [
      { sectionLabel: "每日练习方法", slideTitle: "动作标准比难度重要", subtitle: "做对基础动作，身体才有反馈" },
      { sectionLabel: "身体练习路径", slideTitle: "先释放，再激活", subtitle: "紧绷没松开，强化训练会更累" },
      { sectionLabel: "温和训练方法", slideTitle: "每天练一点就够", subtitle: "可完成比高强度更重要" },
      { sectionLabel: "动作纠正方法", slideTitle: "老师反馈很关键", subtitle: "错动作练久了，不适会被放大" },
      { sectionLabel: "呼吸与核心训练", slideTitle: "呼吸带动身体放松", subtitle: "稳定核心前，先找回身体感受" }
    ],
    action: [
      { sectionLabel: "打卡与陪练机制", slideTitle: "有人陪更容易坚持", subtitle: "提醒、纠正、反馈让练习不断档" },
      { sectionLabel: "每日练习安排", slideTitle: "从今天开始轻练习", subtitle: "先完成评估，再进入30天节奏" },
      { sectionLabel: "陪跑执行机制", slideTitle: "把练习变成习惯", subtitle: "每天可完成，周周有反馈" },
      { sectionLabel: "动作反馈机制", slideTitle: "练完要知道对不对", subtitle: "视频点评帮你避开错误发力" },
      { sectionLabel: "社群陪伴节奏", slideTitle: "不靠一个人硬撑", subtitle: "社群打卡让练习更有持续性" }
    ]
  },
  short_video: {
    problem: [
      { sectionLabel: "内容现状", slideTitle: "为什么发了也没人看？", subtitle: "选题、开头、表达没有形成钩子" },
      { sectionLabel: "账号增长卡点", slideTitle: "内容卡在前三秒", subtitle: "用户不点开，后面讲得再好也没用" },
      { sectionLabel: "创作真实问题", slideTitle: "不是不努力，是方向乱", subtitle: "没有选题库，就只能每天凭感觉发" },
      { sectionLabel: "流量停滞原因", slideTitle: "账号没有稳定记忆点", subtitle: "定位模糊，用户就不知道为什么关注" },
      { sectionLabel: "转化断点", slideTitle: "有播放也没有成交", subtitle: "内容没有承接，私域就接不住需求" }
    ],
    result: [
      { sectionLabel: "流量与转化结果", slideTitle: "从乱发到稳定输出", subtitle: "用选题库和脚本模板降低创作波动" },
      { sectionLabel: "内容增长结果", slideTitle: "让内容开始带客户", subtitle: "播放、咨询、承接要形成闭环" },
      { sectionLabel: "账号转变结果", slideTitle: "账号有了清晰方向", subtitle: "用户知道你是谁，也知道能找你做什么" },
      { sectionLabel: "转化路径变化", slideTitle: "从曝光走向咨询", subtitle: "每条内容都要设计下一步动作" },
      { sectionLabel: "创作效率变化", slideTitle: "不再每天临时想题", subtitle: "用数据复盘决定下一批内容" }
    ],
    case: [
      { sectionLabel: "爆款与转化案例", slideTitle: "爆款不能只看播放", subtitle: "要看选题、评论和后端咨询" },
      { sectionLabel: "内容转化案例", slideTitle: "一条内容如何带咨询？", subtitle: "钩子、结构、行动指令缺一不可" },
      { sectionLabel: "账号拆解案例", slideTitle: "拆的是动作，不是运气", subtitle: "看选题来源和发布后的复盘" },
      { sectionLabel: "选题测试案例", slideTitle: "5条视频测一个方向", subtitle: "用数据判断，而不是靠感觉" },
      { sectionLabel: "私域承接案例", slideTitle: "咨询从哪里来？", subtitle: "评论区和私信都要提前设计" }
    ],
    method: [
      { sectionLabel: "内容与转化方法", slideTitle: "先建选题库", subtitle: "选题稳定，账号才会稳定" },
      { sectionLabel: "短视频创作方法", slideTitle: "黄金3秒决定打开率", subtitle: "开头要直接击中用户当下问题" },
      { sectionLabel: "脚本表达系统", slideTitle: "脚本要有冲突和结果", subtitle: "只讲观点，用户很难记住你" },
      { sectionLabel: "发布复盘方法", slideTitle: "数据告诉你下一条拍什么", subtitle: "完播、评论、咨询要一起看" },
      { sectionLabel: "转化承接路径", slideTitle: "内容后面必须有承接", subtitle: "没有私域路径，流量很快流失" }
    ],
    action: [
      { sectionLabel: "每日创作任务", slideTitle: "今天先写10个选题", subtitle: "先做输入整理，再开始拍摄" },
      { sectionLabel: "账号执行机制", slideTitle: "每天都要有发布节奏", subtitle: "创作、发布、复盘固定下来" },
      { sectionLabel: "内容训练安排", slideTitle: "30天跑通一条内容线", subtitle: "先验证方向，再扩大产能" },
      { sectionLabel: "复盘优化机制", slideTitle: "每周复盘一次数据", subtitle: "不复盘，爆款经验无法复制" },
      { sectionLabel: "转化行动路径", slideTitle: "把咨询入口放清楚", subtitle: "用户有兴趣时要知道下一步去哪" }
    ]
  },
  business_sales: {
    problem: [
      { sectionLabel: "当前成交瓶颈", slideTitle: "为什么客户一直犹豫？", subtitle: "真正的问题常在需求判断不清" },
      { sectionLabel: "成交卡点诊断", slideTitle: "报价总被压低", subtitle: "价值没有被看见，价格就会被比较" },
      { sectionLabel: "销售现场问题", slideTitle: "跟进越多越被动", subtitle: "没有节点设计，跟进就变成催单" },
      { sectionLabel: "客户决策阻力", slideTitle: "客户不是没需求", subtitle: "他还没有相信现在必须行动" },
      { sectionLabel: "流程断点", slideTitle: "成交不能靠临场发挥", subtitle: "团队需要统一诊断和跟进标准" }
    ],
    result: [
      { sectionLabel: "成交结果变化", slideTitle: "从被动等待到主动推进", subtitle: "每次沟通都有清晰下一步" },
      { sectionLabel: "客户决策变化", slideTitle: "客户知道为什么买", subtitle: "价值锚定清楚，报价才有支撑" },
      { sectionLabel: "团队成交变化", slideTitle: "新人也能按流程做", subtitle: "SOP降低个人发挥差异" },
      { sectionLabel: "跟进效率变化", slideTitle: "跟进不再靠感觉", subtitle: "用客户状态决定下一句话" },
      { sectionLabel: "成交路径结果", slideTitle: "从询价走向签约", subtitle: "诊断、方案、异议处理要连贯" }
    ],
    case: [
      { sectionLabel: "成交拆解案例", slideTitle: "客户为什么最终下单？", subtitle: "看需求、阻力、触发点和跟进动作" },
      { sectionLabel: "真实成交案例", slideTitle: "拆出关键一句话", subtitle: "成交往往发生在价值被重新理解时" },
      { sectionLabel: "客户跟进案例", slideTitle: "跟进不是重复提醒", subtitle: "每次联系都要推进一个判断" },
      { sectionLabel: "报价处理案例", slideTitle: "价格异议怎么转向价值？", subtitle: "先确认损失，再解释方案价值" },
      { sectionLabel: "团队训练案例", slideTitle: "标准流程让新人稳住", subtitle: "不用靠天赋，也能完成关键动作" }
    ],
    method: [
      { sectionLabel: "成交流程与话术", slideTitle: "先诊断，再报价", subtitle: "不清楚需求，任何报价都显贵" },
      { sectionLabel: "成交关键动作", slideTitle: "异议背后是风险感", subtitle: "处理异议前，先判断客户担心什么" },
      { sectionLabel: "价值锚定方法", slideTitle: "让客户看到不买的代价", subtitle: "价值不是介绍出来，是对比出来" },
      { sectionLabel: "跟进SOP设计", slideTitle: "每次跟进都有目的", subtitle: "推进决策，而不是反复问考虑好没" },
      { sectionLabel: "客户需求诊断", slideTitle: "问对问题才有成交", subtitle: "需求越清楚，方案越容易被接受" }
    ],
    action: [
      { sectionLabel: "跟进与复盘机制", slideTitle: "今天先复盘3个客户", subtitle: "看他们卡在哪个决策节点" },
      { sectionLabel: "成交训练任务", slideTitle: "先统一诊断问题", subtitle: "团队要用同一套标准判断客户" },
      { sectionLabel: "销售执行路径", slideTitle: "把跟进写成流程", subtitle: "节点清楚，成交才可复制" },
      { sectionLabel: "团队复盘机制", slideTitle: "每周复盘真实对话", subtitle: "话术优化必须来自现场" },
      { sectionLabel: "成交行动安排", slideTitle: "先修复最弱一环", subtitle: "不要全改，先抓最大流失点" }
    ]
  },
  personal_ip: {
    problem: [
      { sectionLabel: "个人品牌现状", slideTitle: "为什么别人记不住你？", subtitle: "身份模糊，内容就没有记忆点" },
      { sectionLabel: "表达卡点", slideTitle: "你说了很多，却没有标签", subtitle: "用户需要一句话理解你是谁" },
      { sectionLabel: "定位困境", slideTitle: "内容发散会稀释信任", subtitle: "栏目不稳定，用户就难以持续关注" },
      { sectionLabel: "信任断点", slideTitle: "专业不等于被相信", subtitle: "证明资产不足，用户就不敢付费" },
      { sectionLabel: "IP成长问题", slideTitle: "你缺的不是曝光", subtitle: "缺的是清晰身份和持续表达" }
    ],
    result: [
      { sectionLabel: "身份与信任变化", slideTitle: "从模糊到被记住", subtitle: "标签清楚，内容才会累积信任" },
      { sectionLabel: "品牌资产变化", slideTitle: "让内容服务成交", subtitle: "每个栏目都要指向你的专业身份" },
      { sectionLabel: "用户认知变化", slideTitle: "别人知道为何选择你", subtitle: "故事、案例、观点形成判断依据" },
      { sectionLabel: "表达结果变化", slideTitle: "从随手发到有系统", subtitle: "栏目化输出让用户持续理解你" },
      { sectionLabel: "转化结果变化", slideTitle: "信任积累到高客单", subtitle: "高客单购买先发生在心智里" }
    ],
    case: [
      { sectionLabel: "IP成长案例", slideTitle: "案例要看身份变化", subtitle: "不是包装好看，而是认知更清楚" },
      { sectionLabel: "个人品牌案例", slideTitle: "一个标签如何被记住？", subtitle: "重复表达和证明资产共同作用" },
      { sectionLabel: "信任资产案例", slideTitle: "用户为什么愿意咨询？", subtitle: "内容先回答了他最担心的问题" },
      { sectionLabel: "内容栏目案例", slideTitle: "栏目让专业持续出现", subtitle: "稳定栏目比偶尔爆文更重要" },
      { sectionLabel: "高客单案例", slideTitle: "转化来自长期信任", subtitle: "先有判断依据，再有购买动作" }
    ],
    method: [
      { sectionLabel: "定位与内容系统", slideTitle: "先确定你的身份标签", subtitle: "标签不清，内容越多越乱" },
      { sectionLabel: "个人品牌方法", slideTitle: "用故事建立真实感", subtitle: "只有观点不够，还要让用户理解你" },
      { sectionLabel: "内容栏目设计", slideTitle: "栏目必须服务定位", subtitle: "每个栏目都要强化同一个认知" },
      { sectionLabel: "信任资产建设", slideTitle: "证明比自夸更有用", subtitle: "案例、反馈、过程记录都要沉淀" },
      { sectionLabel: "高客单包装路径", slideTitle: "产品要匹配身份", subtitle: "你的专业标签决定用户愿意付多少" }
    ],
    action: [
      { sectionLabel: "表达与转化任务", slideTitle: "今天先写一句身份定位", subtitle: "让别人一句话知道你解决什么" },
      { sectionLabel: "IP执行机制", slideTitle: "每天输出一个固定栏目", subtitle: "重复出现，才能形成记忆" },
      { sectionLabel: "内容行动路径", slideTitle: "先搭3个内容栏目", subtitle: "观点、故事、案例要分工明确" },
      { sectionLabel: "信任沉淀机制", slideTitle: "把反馈变成资产", subtitle: "每次服务结果都要可展示" },
      { sectionLabel: "转化执行安排", slideTitle: "先做一次身份诊断", subtitle: "确定标签后，再设计内容和产品" }
    ]
  },
  default: {
    problem: [
      { sectionLabel: "当前问题", slideTitle: "真正卡点在哪里？", subtitle: "先判断问题，再设计学习路径" },
      { sectionLabel: "学习前的困扰", slideTitle: "不是学得少，是路径乱", subtitle: "缺少清晰步骤，行动就难持续" },
      { sectionLabel: "现实阻力", slideTitle: "为什么一直没有改变？", subtitle: "原因通常在方法、反馈和执行节奏" },
      { sectionLabel: "问题诊断", slideTitle: "先看见底层问题", subtitle: "表面症状背后有更深原因" },
      { sectionLabel: "行动障碍", slideTitle: "知道不等于做到", subtitle: "课程必须把方法变成动作" }
    ],
    result: [
      { sectionLabel: "学习后的变化", slideTitle: "变化必须看得见", subtitle: "结果越具体，学习动力越强" },
      { sectionLabel: "目标结果", slideTitle: "从理解到能执行", subtitle: "课程要交付可操作的路径" },
      { sectionLabel: "转变结果", slideTitle: "学完要能用起来", subtitle: "不是听懂，而是完成关键动作" },
      { sectionLabel: "结果承诺", slideTitle: "让改变有标准", subtitle: "先定义结果，再安排训练" },
      { sectionLabel: "学习收益", slideTitle: "从混乱到清楚", subtitle: "看清路径，行动才会稳定" }
    ],
    case: [
      { sectionLabel: "真实案例", slideTitle: "案例证明路径有效", subtitle: "看背景、动作、变化和经验" },
      { sectionLabel: "案例拆解", slideTitle: "不要只看结果", subtitle: "可复制的是动作，不是运气" },
      { sectionLabel: "用户变化案例", slideTitle: "变化如何发生？", subtitle: "过程越清楚，信任越容易建立" },
      { sectionLabel: "实践案例", slideTitle: "从一个样本看方法", subtitle: "案例用于说明路径，而不是夸张承诺" },
      { sectionLabel: "可复制经验", slideTitle: "把经验拆成步骤", subtitle: "用户需要知道自己也能照着做" }
    ],
    method: [
      { sectionLabel: "核心方法", slideTitle: "方法必须能落地", subtitle: "概念要变成任务、工具和反馈" },
      { sectionLabel: "学习方法", slideTitle: "先搭路径，再做训练", subtitle: "按阶段学习，结果更稳定" },
      { sectionLabel: "实操路径", slideTitle: "每一步都要有动作", subtitle: "没有动作设计，课程就停在理解层" },
      { sectionLabel: "方法框架", slideTitle: "先抓关键动作", subtitle: "少讲概念，多做可执行训练" },
      { sectionLabel: "训练系统", slideTitle: "反馈让方法变有效", subtitle: "练习后要知道哪里需要调整" }
    ],
    action: [
      { sectionLabel: "行动与执行", slideTitle: "下一步必须清楚", subtitle: "诊断、任务、反馈要马上开始" },
      { sectionLabel: "执行机制", slideTitle: "把学习变成计划", subtitle: "明确每天做什么，改变才会发生" },
      { sectionLabel: "作业与复盘", slideTitle: "没有作业就难落地", subtitle: "练习和复盘决定课程效果" },
      { sectionLabel: "落地安排", slideTitle: "先完成第一项任务", subtitle: "小行动能启动整个学习节奏" },
      { sectionLabel: "行动路径", slideTitle: "今天就进入执行", subtitle: "先诊断，再跟随训练节奏推进" }
    ]
  }
};

function getPool(courseIndustry: string | undefined) {
  return courseIndustry && courseIndustry in variationPools ? variationPools[courseIndustry] : variationPools.default;
}

function chooseUnique<T extends string>(items: T[], used: Set<string>) {
  const available = items.filter((item) => !used.has(item));
  const source = available.length > 0 ? available : items;
  const selected = source[Math.floor(Math.random() * source.length)];
  used.add(selected);
  return selected;
}

function chooseUniqueOption(options: HeadingOption[], usedTitles: Set<string>, usedLabels: Set<string>) {
  const available = options.filter((option) => !usedTitles.has(option.slideTitle));
  const source = available.length > 0 ? available : options;
  const selected = source[Math.floor(Math.random() * source.length)];
  usedTitles.add(selected.slideTitle);

  const sectionLabel = chooseUnique(
    source.map((option) => option.sectionLabel),
    usedLabels
  );

  return {
    ...selected,
    sectionLabel
  };
}

export function rewriteOutlineWithVariation(outline: PptOutline, courseIndustry?: string): PptOutline {
  if (outline.type !== "course") return outline;

  const pool = getPool(courseIndustry);
  const usedTitles = new Set<string>();
  const usedLabels = new Set<string>();

  return {
    ...outline,
    slides: outline.slides.map((slide: PptSlide) => {
      const sectionKey = getSectionKey(slide.layoutType);
      const options = pool[sectionKey] || variationPools.default[sectionKey];
      const heading = chooseUniqueOption(options, usedTitles, usedLabels);

      return {
        ...slide,
        sectionLabel: heading.sectionLabel,
        slideTitle: heading.slideTitle,
        subtitle: heading.subtitle
      };
    })
  };
}
