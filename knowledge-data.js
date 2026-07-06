/* ============================================
 * Galileo OS · 知识库市场详情数据
 * 12 个知识包（工艺/故障/安全/质量/标准/通用）
 *
 * 知识包 ≠ 应用：应用是"工具系统"，知识包是"知识内容本身"。
 * 老专家/OPC 把经验打包上架，全网订阅分润——经验即资产。
 * ============================================ */

window.KNOWLEDGE_DATA = {

/* ============== 工艺知识包（process）============== */
"cement-kiln-process": {
  name: "水泥窑炉工艺知识包",
  icon: "",
  category: "工艺知识",
  categoryKey: "process",
  status: "live",
  version: "v5.2",
  updatedAt: "2026-06-26",
  provider: "李工 · 30年水泥工艺师（OPC）",
  providerType: "OPC",
  tags: ["水泥窑", "煅烧", "煤粉配比", "风煤平衡", "熟料强度"],
  oneLine: "30 年水泥窑炉工艺经验的结构化知识包：开窑、配料、煅烧、调参、异常处置，附 800+ 真实案例。",
  overview: "水泥窑是水泥厂的心脏，工艺参数组合数以万计，老师傅凭经验能在窑尾温度波动 5 度时就判断出煤粉配比该不该调。这个知识包把一位 30 年水泥工艺师的全部经验数字化：开窑升温曲线、生料配料公式、煤粉配比窗口、风煤平衡规则、熟料强度影响因素、38 种典型异常的处置方法，全部结构化为可被 Agent 检索与推理的知识图谱。",
  content: [
    { type: "工艺手册", count: "12 章 / 800+ 页", desc: "涵盖回转窑、预热器、分解炉、冷却机全流程工艺规范" },
    { type: "参数窗口", count: "260+ 个参数", desc: "温度/压力/风量/煤粉/转速的最优区间与联动关系" },
    { type: "异常处置案例", count: "38 个典型场景", desc: "如窑尾温度偏高、结圈、跑生料、黄心料的诊断与处置" },
    { type: "配方库", count: "45 组配方", desc: "不同原料/煤质/强度目标下的生料配比方案" },
    { type: "问答对", count: "2000+ 条", desc: "工艺师常见提问与专家级回答，已人工校验" }
  ],
  quality: { accuracy: "96%", lastVerified: "2026-06-20", verifiedBy: "3 位在职工艺厂长交叉校验" },
  industry: ["水泥建材"],
  scenes: ["新窑开窑升温指导", "原料波动时配料调整", "熟料强度异常归因", "能耗优化的工艺侧支撑", "新工艺师培训"],
  useApps: [{ name: "工业知识库", id: "industrial-knowledge" }],
  useAgents: [{ name: "工艺指导 Agent", id: "quality-analysis" }, { name: "能耗优化 Agent", id: "energy-optim" }],
  case: {
    title: "某 5000t/d 生产线工艺调优",
    desc: "客户新工艺师无法应对原料波动，熟料强度合格率仅 88%。加载本知识包后，Agent 能在原料变化时自动推荐配料调整方案，强度合格率提升至 97%，年减少不合格品损失超 200 万元。",
    metrics: [{ num: "88%97%", label: "强度合格率" }, { num: "200万", label: "年减损" }, { num: "260+", label: "参数窗口" }]
  },
  pricing: { model: "按订阅计费 + 调用分润", price: "3000", unit: "元/工厂/年", note: "OPC 李工持续获得分润；订阅含季度更新" },
  specs: [{ k: "知识条目", v: "3000+" }, { k: "参数窗口", v: "260+" }, { k: "案例数", v: "38 个" }, { k: "问答对", v: "2000+" }, { k: "校验状态", v: "3 位厂长交叉校验" }],
  changelog: [
    { version: "v5.2", date: "2026-06-26", content: "新增替代燃料工艺章节；12 个新异常案例；参数窗口扩充至 260+。" },
    { version: "v5.0", date: "2026-03-10", content: "重构为知识图谱；问答对人工校验；3 位厂长交叉校验。" },
    { version: "v4.5", date: "2025-11-15", content: "新增 45 组配方库；风煤平衡规则。" }
  ]
},

"injection-molding-process": {
  name: "注塑成型工艺知识包",
  icon: "",
  category: "工艺知识",
  categoryKey: "process",
  status: "live",
  version: "v4.0",
  updatedAt: "2026-06-22",
  provider: "李工 · 30年注塑老兵（OPC，老李）",
  providerType: "OPC",
  tags: ["注塑", "模具", "压力窗口", "缩水", "披锋"],
  oneLine: "这就是 OPC 老李的招牌知识包——30 年注塑经验数字化，含 120+ 缺陷处置、压力温度窗口、模具调试。",
  overview: "这正是 OPC 老李的招牌资产。老李在注塑车间干了 30 年，闭着眼能听出注塑机哪里有异响。这个知识包把他的全部经验数字化：注塑压力/温度/速度的窗口、120+ 种缺陷（缩水、披锋、气泡、烧焦、变形）的成因与处置、模具调试与保养、材料特性与工艺匹配。老李交付项目赚实施费后，把方案抹去甲方数据打包成本知识包上架，全网注塑厂订阅即自动分润。",
  content: [
    { type: "缺陷图谱", count: "120+ 种缺陷", desc: "缩水/披锋/气泡/烧焦/变形/熔接痕等的成因分析与处置方案" },
    { type: "工艺窗口", count: "180+ 参数", desc: "不同材料/产品下的压力/温度/速度/时间最优区间" },
    { type: "模具知识", count: "60+ 案例", desc: "模具调试、热流道、冷却水路、保养周期" },
    { type: "材料工艺", count: "30+ 种材料", desc: "PP/ABS/PC/PA/POM 等的工艺特性与参数推荐" },
    { type: "问答对", count: "1500+ 条", desc: "注塑现场常见提问与老法师级回答" }
  ],
  quality: { accuracy: "94%", lastVerified: "2026-06-18", verifiedBy: "老李 + 2 位注塑车间主任校验" },
  industry: ["注塑压铸", "离散制造"],
  scenes: ["新品试模参数推荐", "缺陷快速诊断与处置", "换材料时工艺调整", "模具问题排查", "新操作工培训"],
  useApps: [{ name: "工业知识库", id: "industrial-knowledge" }, { name: "SOP 管理平台", id: "sop-platform" }],
  useAgents: [{ name: "生产调度 Agent", id: "production-scheduling" }, { name: "缺陷识别 Agent", id: "defect-detection" }],
  case: {
    title: "OPC 老李的招牌交付",
    desc: "某注塑厂准交率仅 76%、缺陷率 8%。老李用此知识包配置 Agent，3 天完成排产与缺陷诊断模块上线，准交率提升至 94%、缺陷率降至 2.5%。方案随后打包成本知识包上架，半年内被 23 家注塑厂订阅，老李持续获得分润。",
    metrics: [{ num: "76%94%", label: "准交率" }, { num: "23 家", label: "订阅工厂" }, { num: "永续", label: "分润收入" }]
  },
  pricing: { model: "按订阅计费 + OPC 分润", price: "2000", unit: "元/工厂/年", note: "OPC 老李持续获得 60% 分润；订阅含月度更新" },
  specs: [{ k: "知识条目", v: "2000+" }, { k: "缺陷图谱", v: "120+ 种" }, { k: "工艺窗口", v: "180+" }, { k: "材料数", v: "30+" }, { k: "校验", v: "OPC + 2 位主任" }],
  changelog: [
    { version: "v4.0", date: "2026-06-22", content: "新增 20 种缺陷；材料工艺扩充至 30+；问答对校验。" },
    { version: "v3.5", date: "2026-02-20", content: "重构为知识图谱；模具知识库扩充。" }
  ]
},

"chemical-reactor-process": {
  name: "化工反应釜工艺知识包",
  icon: "",
  category: "工艺知识",
  categoryKey: "process",
  status: "live",
  version: "v3.8",
  updatedAt: "2026-06-15",
  provider: "思为交互化工专家组",
  providerType: "官方",
  tags: ["反应釜", "配比", "温度控制", "批次一致性", "安全窗口"],
  oneLine: "化工反应釜的配比、温控、压力、安全窗口知识，含 90+ 批次异常案例与安全规程。",
  overview: "化工反应釜工艺的核心是「配比精度 + 温度控制 + 安全边界」。这个知识包把反应釜的全流程工艺知识结构化：原料配比公式、反应温度曲线、压力安全窗口、搅拌速度规则、批次一致性控制方法、90+ 个批次异常案例（温度失控、副反应、收率下降）的归因与处置。所有知识附带安全边界标注，关键操作必须人工确认。",
  content: [
    { type: "配比公式", count: "65 组", desc: "不同产品/原料下的投料配比与顺序" },
    { type: "温控曲线", count: "40+ 反应类型", desc: "升温/保温/降温曲线与临界温度" },
    { type: "安全窗口", count: "全量标注", desc: "每个参数的安全上下限与联锁规则" },
    { type: "异常案例", count: "90+ 批次", desc: "失控/副反应/收率下降的诊断与处置" },
    { type: "SOP", count: "25 套", desc: "开停车、换产、清洗、应急的标准作业流程" }
  ],
  quality: { accuracy: "95%", lastVerified: "2026-06-10", verifiedBy: "2 位化工总工 + 安全工程师" },
  industry: ["化工", "流程工业"],
  scenes: ["新产品工艺开发", "批次异常归因", "安全规程查询", "操作工培训", "合规审计取证"],
  useApps: [{ name: "工业知识库", id: "industrial-knowledge" }, { name: "SOP 管理平台", id: "sop-platform" }],
  useAgents: [{ name: "安全巡检 Agent", id: "safety-inspection" }, { name: "质量分析 Agent", id: "quality-analysis" }],
  case: {
    title: "某化工厂批次一致性提升",
    desc: "客户同产品批次间收率波动达 8%，加载本知识包后，Agent 在每次投料前校验配比与温控曲线，批次波动降至 2%，年增收超 500 万元。",
    metrics: [{ num: "8%2%", label: "批次波动" }, { num: "500万", label: "年增收" }, { num: "90+", label: "异常案例" }]
  },
  pricing: { model: "按订阅计费", price: "5000", unit: "元/工厂/年", note: "含季度更新与安全规程同步" },
  specs: [{ k: "知识条目", v: "2500+" }, { k: "配比公式", v: "65 组" }, { k: "异常案例", v: "90+" }, { k: "SOP", v: "25 套" }],
  changelog: [
    { version: "v3.8", date: "2026-06-15", content: "新增 15 个异常案例；安全窗口全量标注；SOP 扩充。" },
    { version: "v3.5", date: "2026-03-05", content: "重构为知识图谱；温控曲线扩充。" }
  ]
},

/* ============== 故障诊断包（fault）============== */
"equipment-fault-cement": {
  name: "水泥设备故障诊断包",
  icon: "",
  category: "故障诊断",
  categoryKey: "fault",
  status: "live",
  version: "v4.5",
  updatedAt: "2026-06-20",
  provider: "思为交互设备专家组",
  providerType: "官方",
  tags: ["回转窑", "磨机", "风机", "振动", "轴承"],
  oneLine: "水泥厂关键设备（窑/磨/风机）的故障树与振动诊断知识，含 150+ 故障案例。",
  overview: "水泥厂关键设备（回转窑、球磨机、立磨、高温风机、除尘器）一旦故障，单日停机损失数十万。这个知识包把设备维修专家的经验结构化：每类设备的故障树（症状可能原因诊断步骤处置方法）、振动频谱诊断规则、轴承/齿轮/电机常见故障模式、150+ 真实故障案例。配合预测性维护 Agent，能在故障萌芽期就给出诊断建议。",
  content: [
    { type: "故障树", count: "12 类设备", desc: "回转窑/磨机/风机/除尘器等的故障树与诊断路径" },
    { type: "振动诊断", count: "80+ 规则", desc: "频谱特征对应的故障类型（不平衡/不对中/轴承磨损）" },
    { type: "故障案例", count: "150+ 个", desc: "真实故障的征兆/诊断/处置全过程记录" },
    { type: "备件清单", count: "全设备", desc: "各设备易损件与推荐备件库存" },
    { type: "维修SOP", count: "60+ 套", desc: "常见维修作业的标准流程与工时" }
  ],
  quality: { accuracy: "93%", lastVerified: "2026-06-12", verifiedBy: "3 位设备总工校验" },
  industry: ["水泥建材"],
  scenes: ["设备异响快速诊断", "振动异常归因", "维修方案推荐", "备件准备", "维修工培训"],
  useApps: [{ name: "工业知识库", id: "industrial-knowledge" }],
  useAgents: [{ name: "预测性维护 Agent", id: "predictive-maintenance" }, { name: "设备巡检 Agent", id: "equipment-inspection" }],
  case: {
    title: "某水泥厂磨机故障预警",
    desc: "客户 2 号水泥机减速箱异响，维修工无法定位。加载本知识包后，Agent 根据振动频谱匹配知识库，15 分钟内诊断为「高速齿轮点蚀」，建议立即更换避免断齿停机。单次避免停机损失约 80 万元。",
    metrics: [{ num: "15 分钟", label: "诊断耗时" }, { num: "80万", label: "避免损失" }, { num: "150+", label: "故障案例" }]
  },
  pricing: { model: "按订阅计费", price: "4000", unit: "元/工厂/年", note: "含设备型号适配与季度更新" },
  specs: [{ k: "知识条目", v: "3500+" }, { k: "故障案例", v: "150+" }, { k: "设备类型", v: "12 类" }, { k: "振动规则", v: "80+" }],
  changelog: [
    { version: "v4.5", date: "2026-06-20", content: "新增立磨故障树；振动规则扩充；备件清单更新。" },
    { version: "v4.0", date: "2026-02-28", content: "重构为故障树结构；150+ 案例入库。" }
  ]
},

"lithium-equipment-fault": {
  name: "锂盐设备故障诊断包",
  icon: "",
  category: "故障诊断",
  categoryKey: "fault",
  status: "live",
  version: "v3.2",
  updatedAt: "2026-06-08",
  provider: "张工 · 锂盐行业设备专家（OPC）",
  providerType: "OPC",
  tags: ["焙烧窑", "浸出槽", "蒸发器", "结晶器"],
  oneLine: "锂盐生产线关键设备（焙烧窑/浸出/蒸发/结晶）的故障诊断知识，含 80+ 案例。",
  overview: "锂盐生产工艺链长、设备种类多，故障诊断高度依赖经验。这个知识包由一位 20 年锂盐设备专家整理：焙烧窑、浸出槽、蒸发器、结晶器等关键设备的故障模式、诊断方法、处置流程，含 80+ 真实故障案例。特别覆盖了锂盐行业特有的腐蚀、结垢、管道堵塞等高发问题。",
  content: [
    { type: "故障模式库", count: "8 类设备", desc: "焙烧窑/浸出/蒸发/结晶等设备的典型故障模式" },
    { type: "诊断流程", count: "60+ 流程", desc: "从症状到根因的诊断决策树" },
    { type: "故障案例", count: "80+ 个", desc: "真实案例的征兆/诊断/处置/复盘" },
    { type: "腐蚀结垢", count: "专章", desc: "锂盐特有的腐蚀/结垢/堵塞防治" }
  ],
  quality: { accuracy: "91%", lastVerified: "2026-06-01", verifiedBy: "OPC 张工 + 1 位设备厂长" },
  industry: ["锂盐新能源"],
  scenes: ["设备异常诊断", "腐蚀结垢防治", "维修方案制定", "新设备工程师培训"],
  useApps: [{ name: "工业知识库", id: "industrial-knowledge" }],
  useAgents: [{ name: "预测性维护 Agent", id: "predictive-maintenance" }],
  case: {
    title: "某锂盐厂蒸发器结垢预警",
    desc: "客户三效蒸发器换热效率持续下降，原因不明。加载本知识包后，Agent 诊断为「硫酸盐结垢」，推荐酸洗周期与阻垢剂调整方案，换热效率恢复，避免停机清垢 3 天。",
    metrics: [{ num: "3 天", label: "避免停机" }, { num: "91%", label: "诊断准确率" }, { num: "80+", label: "故障案例" }]
  },
  pricing: { model: "OPC 订阅分润", price: "3500", unit: "元/工厂/年", note: "OPC 张工获得 60% 分润" },
  specs: [{ k: "知识条目", v: "1800+" }, { k: "故障案例", v: "80+" }, { k: "设备类型", v: "8 类" }, { k: "校验", v: "OPC + 厂长" }],
  changelog: [
    { version: "v3.2", date: "2026-06-08", content: "新增结晶器故障模式；腐蚀结垢专章；案例扩充。" }
  ]
},

/* ============== 安全合规包（safety）============== */
"chemical-safety-rules": {
  name: "化工安全规程知识包",
  icon: "",
  category: "安全合规",
  categoryKey: "safety",
  status: "live",
  version: "v6.0",
  updatedAt: "2026-06-25",
  provider: "思为交互安全合规团队",
  providerType: "官方",
  tags: ["GB标准", "HAZOP", "应急", "重大危险源", "特殊作业"],
  oneLine: "化工行业全套安全规程：国标/行标/HAZOP/应急预案/特殊作业，实时同步法规更新。",
  overview: "化工安全是红线，规程多且更新频繁，靠人工跟踪极易遗漏。这个知识包汇集了化工行业的全套安全规程：国家标准（GB 50016/50160/30871 等）、行业标准、HAZOP 分析记录、重大危险源管控、八大特殊作业规范、应急预案库。法规更新时自动同步，确保企业始终合规。每个规程附带适用场景与执行要点，Agent 能在作业前自动校验合规性。",
  content: [
    { type: "国家/行业标准", count: "120+ 部", desc: "GB/SH/HG 等化工安全标准的结构化解读" },
    { type: "HAZOP 库", count: "35 类工艺", desc: "典型工艺的偏差/原因/后果/措施分析" },
    { type: "特殊作业", count: "8 大类", desc: "动火/受限空间/高处/临时用电等的许可与管控" },
    { type: "应急预案", count: "45 套", desc: "火灾/爆炸/泄漏/中毒的应急响应流程" },
    { type: "重大危险源", count: "全量管控", desc: "辨识/评估/登记/监控的完整规则" }
  ],
  quality: { accuracy: "99%", lastVerified: "2026-06-25", verifiedBy: "注册安全工程师 + 法务团队；法规更新自动同步" },
  industry: ["化工", "流程工业"],
  scenes: ["作业前合规校验", "新项目安全评审", "应急演练准备", "安全培训考核", "监管部门检查应对"],
  useApps: [{ name: "SOP 管理平台", id: "sop-platform" }, { name: "业务知识库", id: "business-knowledge" }],
  useAgents: [{ name: "安全巡检 Agent", id: "safety-inspection" }, { name: "环保合规 Agent", id: "environmental-compliance" }],
  case: {
    title: "某化工园区迎检零整改",
    desc: "客户面临省级安全大检查，原靠人工翻规程核对。加载本知识包后，Agent 一键生成合规自查报告，覆盖 120+ 项检查要点，最终以「零整改」通过检查，节省迎检人力 90%。",
    metrics: [{ num: "零整改", label: "检查通过" }, { num: "-90%", label: "迎检人力" }, { num: "120+", label: "标准覆盖" }]
  },
  pricing: { model: "按企业订阅", price: "8000", unit: "元/企业/年", note: "含法规更新自动同步；多工厂按规模阶梯" },
  specs: [{ k: "标准数", v: "120+ 部" }, { k: "HAZOP", v: "35 类工艺" }, { k: "应急预案", v: "45 套" }, { k: "更新频率", v: "法规发布即同步" }],
  changelog: [
    { version: "v6.0", date: "2026-06-25", content: "同步 2026 上半年法规更新；新增 HAZOP 5 类工艺；特殊作业扩充。" },
    { version: "v5.5", date: "2026-03-20", content: "重大危险源全量管控；应急预案库扩充。" }
  ]
},

"safety-behavior-cv": {
  name: "AI 安全行为识别规则包",
  icon: "",
  category: "安全合规",
  categoryKey: "safety",
  status: "live",
  version: "v2.8",
  updatedAt: "2026-06-18",
  provider: "思为交互 CV 团队",
  providerType: "官方",
  tags: ["未戴护具", "违规闯入", "跌倒", "烟雾明火", "行为识别"],
  oneLine: "工厂安全场景的 AI 视觉识别规则集：未戴安全帽/违规闯入/跌倒/烟雾明火，即装即用。",
  overview: "工厂安全管理从「人盯人」转向「AI 盯人」。这个知识包提供 25+ 类安全行为视觉识别规则：未戴安全帽/护目镜/手套、违规闯入危险区域、人员跌倒、抽烟、烟雾明火、通道堵塞等。每类规则含模型推荐、置信度阈值、告警分级、处置流程。配合 CV 视觉识别 Skill，摄像头即装即用，7×24 小时自动巡检。",
  content: [
    { type: "识别规则", count: "25+ 类", desc: "护具/闯入/跌倒/抽烟/明火/堵塞等的行为识别规则" },
    { type: "模型推荐", count: "全场景", desc: "每类规则推荐的预训练模型与微调建议" },
    { type: "告警分级", count: "三级", desc: "提醒/警告/紧急的分级标准与处置流程" },
    { type: "摄像头布点", count: "指南", desc: "不同场景的摄像头选型与安装位置建议" }
  ],
  quality: { accuracy: "95%+", lastVerified: "2026-06-15", verifiedBy: "10+ 工厂现场验证" },
  industry: ["化工", "水泥建材", "钢铁冶金", "能源电力", "通用"],
  scenes: ["厂区门口护具检查", "危险区域闯入报警", "人员跌倒救助", "烟雾明火早期预警", "安全合规审计"],
  useApps: [],
  useAgents: [{ name: "安全巡检 Agent", id: "safety-inspection" }],
  useSkills: [{ name: "CV 视觉识别", id: "cv-recognition" }, { name: "钉钉/企微/飞书通知", id: "im-notification" }],
  case: {
    title: "某钢铁厂 7×24 安全巡检",
    desc: "客户原靠安全员定时巡查，盲区多、违规难发现。部署本规则包 + 摄像头后，7×24 自动识别未戴护具/违规闯入，安全违规事件下降 85%，1 次提前发现初期烟雾避免火灾。",
    metrics: [{ num: "-85%", label: "违规事件" }, { num: "1 次", label: "避免火灾" }, { num: "25+", label: "识别规则" }]
  },
  pricing: { model: "按摄像头数计费", price: "200", unit: "元/摄像头/年", note: "含模型更新与规则优化" },
  specs: [{ k: "识别规则", v: "25+ 类" }, { k: "准确率", v: "95%+" }, { k: "响应延迟", v: "< 1 秒" }, { k: "验证工厂", v: "10+" }],
  changelog: [
    { version: "v2.8", date: "2026-06-18", content: "新增通道堵塞识别；告警分级优化；模型性能提升。" },
    { version: "v2.5", date: "2026-03-15", content: "新增明火/烟雾识别；摄像头布点指南。" }
  ]
},

/* ============== 质量标准包（quality）============== */
"qc-standards-injection": {
  name: "注塑件质量检验标准包",
  icon: "",
  category: "质量标准",
  categoryKey: "quality",
  status: "live",
  version: "v3.5",
  updatedAt: "2026-06-12",
  provider: "思为交互质量专家组",
  providerType: "官方",
  tags: ["尺寸", "外观", "材料", "GB标准", "客户规范"],
  oneLine: "注塑件全检项的判定标准：尺寸/外观/材料/性能，含国标与主流客户规范。",
  overview: "注塑件质量判定涉及尺寸公差、外观缺陷、材料性能、客户特殊规范多重标准，手工对照效率低易出错。这个知识包把注塑件全检项的判定标准结构化：GB/T 14486 尺寸公差、外观缺陷分级（A/B/C 面）、材料性能要求、主流客户（汽车/3C/家电）的特殊规范。配合质检规则 Skill，95% 批次自动判定放行。",
  content: [
    { type: "尺寸标准", count: "GB/T 14486", desc: "注塑件尺寸公差与检测方法" },
    { type: "外观分级", count: "A/B/C 面", desc: "关键面/次关键面/非关键面的缺陷允许标准" },
    { type: "客户规范", count: "15+ 主流客户", desc: "汽车/3C/家电客户的特殊质量要求" },
    { type: "判定规则", count: "300+ 条", desc: "合格/降级/返工/报废的判定逻辑" },
    { type: "检测方法", count: "全项", desc: "尺寸/外观/材料/性能的检测方法与频次" }
  ],
  quality: { accuracy: "97%", lastVerified: "2026-06-08", verifiedBy: "3 位质量工程师 + 客户质量代表" },
  industry: ["注塑压铸", "汽车零部件", "电子半导体"],
  scenes: ["来料检验", "过程检验", "出货检验", "客户投诉归因", "新质量员培训"],
  useApps: [],
  useAgents: [{ name: "质量分析 Agent", id: "quality-analysis" }, { name: "质检复核 Agent", id: "qc-review" }],
  useSkills: [{ name: "质检规则", id: "quality-rules" }],
  case: {
    title: "某注塑厂质检自动化",
    desc: "客户质检靠人工对照标准，慢且易出错。加载本标准包后，95% 批次自动判定放行，质检周期从 4 小时压缩至 20 分钟，客户投诉率下降 60%。",
    metrics: [{ num: "4h20min", label: "质检周期" }, { num: "-60%", label: "客户投诉" }, { num: "95%", label: "自动判定率" }]
  },
  pricing: { model: "按订阅计费", price: "2500", unit: "元/工厂/年", note: "含客户规范更新；多客户按数量阶梯" },
  specs: [{ k: "标准数", v: "300+ 条规则" }, { k: "客户规范", v: "15+" }, { k: "覆盖标准", v: "GB/T 14486" }, { k: "校验", v: "3 位质量工程师" }],
  changelog: [
    { version: "v3.5", date: "2026-06-12", content: "新增 3 家汽车客户规范；判定规则扩充至 300+。" },
    { version: "v3.0", date: "2026-03-08", content: "重构为可执行规则；外观 A/B/C 面分级。" }
  ]
},

"iso-9001-quality": {
  name: "ISO 9001 质量管理体系知识包",
  icon: "",
  category: "质量标准",
  categoryKey: "quality",
  status: "live",
  version: "v4.0",
  updatedAt: "2026-06-05",
  provider: "思为交互质量团队",
  providerType: "官方",
  tags: ["ISO 9001", "体系运行", "内审", "管理评审", "持续改进"],
  oneLine: "ISO 9001:2015 全条款解读 + 体系运行指南 + 内审检查表，应对认证审核与日常运行。",
  overview: "ISO 9001 质量管理体系是制造业的基础认证，但条款解读、体系运行、内审外审都依赖经验。这个知识包把 ISO 9001:2015 全部条款结构化解读，附体系文件模板、内审检查表、管理评审流程、不符合项整改案例。质量经理一句话就能查到「这个条款怎么落地」「内审怎么查」「审核员常问什么」。",
  content: [
    { type: "条款解读", count: "全 10 章", desc: "ISO 9001:2015 全条款的通俗解读与落地要点" },
    { type: "体系文件", count: "40+ 模板", desc: "质量手册/程序文件/作业指导书模板" },
    { type: "内审检查表", count: "全条款", desc: "内审员使用的检查清单与提问要点" },
    { type: "整改案例", count: "60+ 个", desc: "常见不符合项的整改方案与证据" },
    { type: "审核应对", count: "指南", desc: "外审/客户审核的应对策略与高频问题" }
  ],
  quality: { accuracy: "98%", lastVerified: "2026-06-01", verifiedBy: "注册审核员 + 质量管理者代表" },
  industry: ["通用", "离散制造", "流程工业", "电子半导体"],
  scenes: ["体系建立与文件编写", "内审策划与执行", "管理评审准备", "外审/客户审核应对", "不符合项整改"],
  useApps: [{ name: "业务知识库", id: "business-knowledge" }],
  useAgents: [{ name: "质量分析 Agent", id: "quality-analysis" }],
  case: {
    title: "某企业 ISO 监督审核一次通过",
    desc: "客户质量经理新接手体系，对条款不熟。加载本知识包后，内审全面自查并整改 12 项薄弱点，年度监督审核一次通过，无严重不符合项。",
    metrics: [{ num: "一次通过", label: "监督审核" }, { num: "12 项", label: "自查整改" }, { num: "40+", label: "文件模板" }]
  },
  pricing: { model: "按企业订阅", price: "3000", unit: "元/企业/年", note: "含标准更新与模板维护" },
  specs: [{ k: "条款覆盖", v: "全 10 章" }, { k: "文件模板", v: "40+" }, { k: "内审检查表", v: "全条款" }, { k: "校验", v: "注册审核员" }],
  changelog: [
    { version: "v4.0", date: "2026-06-05", content: "新增管理评审流程；整改案例扩充；审核应对指南。" }
  ]
},

/* ============== 行业通用包（general）============== */
"tpm-management": {
  name: "TPM 全员生产维护知识包",
  icon: "",
  category: "管理方法",
  categoryKey: "general",
  status: "live",
  version: "v3.0",
  updatedAt: "2026-05-28",
  provider: "思为交互管理顾问团队",
  providerType: "官方",
  tags: ["TPM", "自主保全", "专业保全", "OEE", "持续改善"],
  oneLine: "TPM 全员生产维护方法论：8 大支柱落地指南、自主保全、OEE 提升、改善课题模板。",
  overview: "TPM（全员生产维护）是制造业提升设备综合效率的经典方法，但很多企业推行流于形式。这个知识包把 TPM 8 大支柱的落地方法结构化：自主保全 7 步法、专业保全体系、个别改善课题模板、OEE 提升路径、培训体系。配套指标计算工具与改善案例库，让 TPM 真正落地见效而非纸面文章。",
  content: [
    { type: "8 大支柱", count: "完整体系", desc: "自主/专业/个别改善/品质维修/初期管理等支柱的落地方法" },
    { type: "自主保全", count: "7 步法", desc: "初期清扫源头对策标准制定总点检自主点检整顿自主管理" },
    { type: "改善课题", count: "50+ 模板", desc: "OEE 提升/故障降减/换模时间缩短等课题模板" },
    { type: "案例库", count: "80+ 个", desc: "各行业 TPM 推行的真实案例与效果数据" },
    { type: "培训体系", count: "全套", desc: "各级别人员的 TPM 培训课程与考核" }
  ],
  quality: { accuracy: "95%", lastVerified: "2026-05-20", verifiedBy: "TPM 顾问 + 3 位设备厂长" },
  industry: ["通用", "离散制造", "流程工业"],
  scenes: ["TPM 体系导入", "自主保全推行", "OEE 提升攻关", "改善课题开展", "全员培训"],
  useApps: [{ name: "工业知识库", id: "industrial-knowledge" }, { name: "培训学习平台", id: "training-platform" }],
  useAgents: [{ name: "预测性维护 Agent", id: "predictive-maintenance" }],
  case: {
    title: "某汽车零部件厂 TPM 推行",
    desc: "客户设备 OEE 长期 65% 左右停滞。引入本知识包指导 TPM 系统推行 8 个月，自主保全覆盖 90% 设备，OEE 提升至 78%，故障停机下降 40%。",
    metrics: [{ num: "65%78%", label: "OEE 提升" }, { num: "-40%", label: "故障停机" }, { num: "8 月", label: "见效周期" }]
  },
  pricing: { model: "按企业订阅", price: "5000", unit: "元/企业/年", note: "含顾问远程指导 4 次/年" },
  specs: [{ k: "支柱数", v: "8 大" }, { k: "课题模板", v: "50+" }, { k: "案例库", v: "80+" }, { k: "行业验证", v: "3 位厂长" }],
  changelog: [
    { version: "v3.0", date: "2026-05-28", content: "重构为 8 支柱体系；改善课题扩充；培训体系上线。" }
  ]
},

"lean-production": {
  name: "精益生产方法论知识包",
  icon: "",
  category: "管理方法",
  categoryKey: "general",
  status: "live",
  version: "v3.2",
  updatedAt: "2026-06-02",
  provider: "思为交互精益顾问团队",
  providerType: "官方",
  tags: ["精益", "5S", "价值流", "看板", "七大浪费"],
  oneLine: "精益生产全套工具与方法论：5S/价值流图/看板拉动/单元生产/七大浪费识别。",
  overview: "精益生产是制造业降本增效的经典方法论，但工具多、落地难。这个知识包把精益生产的全套工具结构化：5S 与目视化、价值流图分析、看板拉动系统、单元化生产、SMED 快速换模、七大浪费识别与消除、A3 报告。每个工具配套实施步骤、模板、行业案例，让精益从「口号」变成「可操作的方法」。",
  content: [
    { type: "工具集", count: "15+ 工具", desc: "5S/价值流/看板/SMED/单元生产/A3 等工具的实施步骤" },
    { type: "模板库", count: "60+ 模板", desc: "价值流图/看板计算/SMED 分析/A3 报告等模板" },
    { type: "浪费识别", count: "7 大浪费", desc: "过量/等待/搬运/加工/库存/动作/不良的识别与消除" },
    { type: "案例库", count: "100+ 个", desc: "各行业精益改善的真实案例与量化效果" }
  ],
  quality: { accuracy: "94%", lastVerified: "2026-05-25", verifiedBy: "精益顾问 + 2 位生产总监" },
  industry: ["通用", "离散制造", "汽车零部件", "电子半导体"],
  scenes: ["精益体系导入", "现场浪费识别", "产线效率提升", "库存降低攻关", "精益人才培养"],
  useApps: [{ name: "工业知识库", id: "industrial-knowledge" }, { name: "培训学习平台", id: "training-platform" }],
  useAgents: [{ name: "生产调度 Agent", id: "production-scheduling" }],
  case: {
    title: "某装备厂精益改善",
    desc: "客户在制品库存高、交期长。引入本知识包指导价值流分析与看板拉动 6 个月，在制品库存下降 45%，交期缩短 30%。",
    metrics: [{ num: "-45%", label: "在制品库存" }, { num: "-30%", label: "交期" }, { num: "100+", label: "案例库" }]
  },
  pricing: { model: "按企业订阅", price: "5000", unit: "元/企业/年", note: "含顾问现场诊断 2 次/年" },
  specs: [{ k: "工具数", v: "15+" }, { k: "模板", v: "60+" }, { k: "案例", v: "100+" }, { k: "校验", v: "精益顾问" }],
  changelog: [
    { version: "v3.2", date: "2026-06-02", content: "新增 SMED 与单元生产工具；案例库扩充至 100+。" }
  ]
},

"energy-management-rules": {
  name: "工业能耗管理规则包",
  icon: "",
  category: "管理方法",
  categoryKey: "general",
  status: "live",
  version: "v2.5",
  updatedAt: "2026-06-14",
  provider: "思为交互能源专家组",
  providerType: "官方",
  tags: ["能效对标", "能耗定额", "双碳", "GB17167", "节能改造"],
  one光: "工业能耗管理规则：能效对标/定额/计量/双碳核算/节能改造机会识别。",
  oneLine: "工业能耗管理规则：能效对标/定额/计量/双碳核算/节能改造机会识别。",
  overview: "能耗成本占工业总成本比重高，双碳目标下能耗管理更紧迫。这个知识包汇集工业能耗管理的全套规则：GB 17167 能源计量要求、能耗定额制定方法、能效对标数据库（水泥/钢铁/化工等行业标杆值）、双碳核算规则、节能改造机会识别清单。配合能耗优化 Agent 与指标计算 Skill，让能耗管理从「看账单」变成「主动优化」。",
  content: [
    { type: "能效标杆", count: "8 大行业", desc: "水泥/钢铁/化工/铝业等的能效标杆值与对标方法" },
    { type: "能耗定额", count: "制定方法", desc: "工序/设备/产品的能耗定额制定与考核规则" },
    { type: "双碳核算", count: "全流程", desc: "碳排放核算方法与减排路径规划" },
    { type: "节能机会", count: "60+ 清单", desc: "常见节能改造机会与投资回报分析" },
    { type: "计量规则", count: "GB 17167", desc: "能源计量器具配备与管理要求" }
  ],
  quality: { accuracy: "96%", lastVerified: "2026-06-10", verifiedBy: "能源管理师 + 节能诊断专家" },
  industry: ["水泥建材", "化工", "铝业", "钢铁冶金", "能源电力"],
  scenes: ["能效对标分析", "能耗定额制定", "双碳目标规划", "节能改造立项", "能源审计应对"],
  useApps: [{ name: "数据资产平台", id: "data-asset-platform" }, { name: "经营驾驶舱", id: "business-cockpit" }],
  useAgents: [{ name: "能耗优化 Agent", id: "energy-optim" }, { name: "环保合规 Agent", id: "environmental-compliance" }],
  useSkills: [{ name: "能耗优化模型", id: "energy-optimization" }, { name: "指标计算", id: "kpi-calc" }],
  case: {
    title: "某水泥厂能效对标提升",
    desc: "客户能耗水平行业中游，不知从何优化。加载本规则包后，对标行业标杆识别 8 项节能机会，6 个月实施 5 项，吨熟料能耗下降 3 kg标煤，年节能收益 400 万元。",
    metrics: [{ num: "-3 kg标煤", label: "吨熟料能耗" }, { num: "400万", label: "年节能收益" }, { num: "8 项", label: "节能机会" }]
  },
  pricing: { model: "按企业订阅", price: "4000", unit: "元/企业/年", note: "含标杆值更新与政策同步" },
  specs: [{ k: "行业标杆", v: "8 大" }, { k: "节能机会", v: "60+" }, { k: "核算规则", v: "双碳全流程" }, { k: "校验", v: "能源管理师" }],
  changelog: [
    { version: "v2.5", date: "2026-06-14", content: "新增双碳核算；节能机会扩充；标杆值更新。" }
  ]
}

};
