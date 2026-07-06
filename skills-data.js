/* ============================================
 * Galileo OS · Skill 市场详情数据
 * 24 个 Skill 的完整深度数据
 * 数据结构：每个 Skill 包含 10 个深度字段
 * ============================================ */

window.SKILLS_DATA = {

/* ============== 数据处理（data）============== */
"data-cleaning": {
  name: "数据清洗",
  icon: "",
  category: "数据处理",
  categoryKey: "data",
  status: "live",
  version: "v3.1",
  updatedAt: "2026-06-18",
  provider: "思为交互数据团队",
  protocol: "Standard Skill API v2",
  tags: ["时序数据", "缺失填补", "异常剔除", "单位归一"],
  oneLine: "对工业时序数据、人工录入数据做缺失填补、异常剔除、单位归一、重复去重，输出可被模型消费的干净数据集。",
  overview: "工业现场的数据天然是脏的：传感器跳变、人工漏录、单位混乱、时间戳错位、重复上报。这个 Skill 提供一条标准化的数据清洗流水线，把原始数据清洗成可被算法模型、BI 报表、大模型推理直接消费的高质量数据集。它是整个 DataOps 数据中台的入口环节，也是为大模型提供「行业语境高质量燃料」的第一道工序。",
  capability: "支持时序数据与结构化数据两类输入。清洗策略可配置：缺失值支持前值填充/插值/均值/丢弃四种策略；异常值支持 3σ/箱线图/孤立森林/动态阈值四种检测算法；单位归一内置 200+ 工业单位换算库；去重基于时间窗口 + 主键联合判定。支持自定义清洗规则脚本（Python），可被流水线动态加载。",
  params: [
    { name: "source", type: "string", req: true, desc: "数据源标识，支持时序流 ID 或数据表名" },
    { name: "fields", type: "array<FieldConfig>", req: true, desc: "字段配置列表，每个字段指定类型、单位、清洗策略" },
    { name: "strategy", type: "CleanStrategy", req: true, desc: "清洗策略对象：missing/anomaly/dedup/normalize" },
    { name: "timeWindow", type: "string", req: false, desc: "时间窗口（如 '5min'），用于去重与聚合判定，默认 '1min'" },
    { name: "customRules", type: "string", req: false, desc: "自定义 Python 清洗规则脚本路径，可选" },
    { name: "outputFormat", type: "enum", req: false, desc: "输出格式：parquet/csv/json/stream，默认 parquet", enum: ["parquet", "csv", "json", "stream"] }
  ],
  input: [
    "工业时序数据流（IoT 采集的温度、压力、流量、振动等）",
    "人工录入数据表（质检记录、巡检记录、班报）",
    "第三方系统同步的业务数据（ERP 订单、MES 工单）"
  ],
  output: [
    "清洗后的结构化数据集（Parquet / JSON）",
    "数据质量报告（缺失率、异常率、清洗前后对比）",
    "被剔除异常点的明细日志（便于人工复核）"
  ],
  code: `// 调用示例：清洗水泥窑温度时序数据
const result = await galileo.skill("data-cleaning").invoke({
  source: "ts://cement_kiln/temp_zone_1",
  fields: [
    { name: "temperature", type: "number", unit: "C" },
    { name: "pressure",    type: "number", unit: "MPa" }
  ],
  strategy: {
    missing:  "interpolate",   // 缺失值插值
    anomaly:  "isolation_forest", // 孤立森林检测
    dedup:    "5min",          // 5 分钟窗口去重
    normalize: true            // 单位归一
  },
  outputFormat: "parquet"
});

console.log(result.qualityReport);
// { missingRate: 0.012, anomalyRate: 0.034, cleanedRows: 86400 }`,
  compose: {
    upstream: [{ icon: "", name: "PLC 读写", role: "提供原始时序数据" }, { icon: "", name: "Modbus 接入", role: "老旧仪表数据采集" }],
    downstream: [{ icon: "", name: "异常检测", role: "基于清洗数据做异常识别" }, { icon: "", name: "预测模型", role: "用干净数据训练预测" }, { icon: "", name: "主题域建模", role: "沉淀为可复用语义层" }]
  },
  case: {
    title: "某水泥厂窑尾温度数据治理",
    desc: "客户原有的窑尾温度数据缺失率达 8.7%，传感器偶发跳变导致能耗模型频繁误判。部署数据清洗 Skill 后，数据质量提升至 99.6%，下游能耗优化模型准确率提升 23%。",
    metrics: [{ num: "8.7%0.4%", label: "缺失率下降" }, { num: "+23%", label: "下游模型准确率" }, { num: "99.6%", label: "数据可用率" }]
  },
  pricing: { model: "按处理数据量计费", price: "0.02", unit: "元/万行", note: "月度结算，首月免费试用 500 万行" },
  specs: [
    { k: "最大吞吐", v: "50 万行/秒" },
    { k: "支持数据源", v: "时序流 / 关系表 / 文件" },
    { k: "延迟", v: "流式 < 500ms" },
    { k: "SLA", v: "99.9%" }
  ],
  changelog: [
    { version: "v3.1", date: "2026-06-18", content: "新增孤立森林异常检测算法；单位换算库扩充至 200+ 工业单位；流式模式延迟优化 40%。" },
    { version: "v3.0", date: "2026-03-22", content: "重构为 Standard Skill API v2；支持自定义 Python 清洗规则脚本；新增数据质量报告。" },
    { version: "v2.4", date: "2025-11-10", content: "新增 Parquet 输出格式；修复高并发下的内存泄漏问题。" }
  ]
},

"data-mapping": {
  name: "数据映射",
  icon: "",
  category: "数据处理",
  categoryKey: "data",
  status: "live",
  version: "v2.0",
  updatedAt: "2026-05-30",
  provider: "思为交互数据团队",
  protocol: "Standard Skill API v2",
  tags: ["字段映射", "语义对齐", "主数据治理"],
  oneLine: "把异构系统的字段做语义对齐与映射转换，打通 ERP 物料编码、MES 工单编码、WMS 库位编码之间的命名鸿沟。",
  overview: "多系统集成的第一道难关不是接口连通，而是「同一个东西在不同系统里叫不同的名字」。ERP 里的物料编码、MES 里的工单编码、WMS 里的库位编码，字段名、类型、取值口径常常各不相同。数据映射 Skill 提供可视化的字段映射配置 + 自动语义推断，让异构数据真正「说同一种语言」。",
  capability: "支持手动映射、规则映射、AI 语义推断三种模式。内置工业主数据标准模型（物料、设备、工单、人员、库位），可基于字段名相似度 + 样例值匹配自动推荐映射关系。支持类型转换、枚举字典翻译、单位换算、编码规则改写。映射规则可版本化管理、可回滚、可导出共享。",
  params: [
    { name: "sourceSchema", type: "Schema", req: true, desc: "源系统字段 Schema（名称、类型、样例值）" },
    { name: "targetSchema", type: "Schema", req: true, desc: "目标标准模型 Schema" },
    { name: "mode", type: "enum", req: true, desc: "映射模式：manual/rule/auto_suggest", enum: ["manual", "rule", "auto_suggest"] },
    { name: "rules", type: "array<MapRule>", req: false, desc: "手动/规则模式的映射规则列表" },
    { name: "dictionary", type: "object", req: false, desc: "枚举字典翻译表，可选" }
  ],
  input: ["源系统字段定义与样例数据", "目标主数据标准模型"],
  output: ["字段映射配置（可版本化）", "映射后的统一主数据视图", "未匹配字段的告警清单"],
  code: `// 自动推断 ERP 物料字段到标准模型的映射
const mapping = await galileo.skill("data-mapping").invoke({
  sourceSchema: { system: "SAP", fields: [
    { name: "MATNR", type: "string", sample: "1000234" },
    { name: "MAKTX", type: "string", sample: "POE-M02 注塑机料筒" }
  ]},
  targetSchema: { model: "standard_material" },
  mode: "auto_suggest"
});

// 返回推荐映射：MATNRmaterial_code, MAKTXmaterial_name`,
  compose: {
    upstream: [{ icon: "", name: "ERP 接口", role: "提供源系统 Schema" }, { icon: "", name: "MES 接口", role: "工单字段来源" }],
    downstream: [{ icon: "", name: "主题域建模", role: "基于映射构建语义层" }, { icon: "", name: "指标计算", role: "统一口径后算 KPI" }]
  },
  case: {
    title: "某集团多基地主数据统一",
    desc: "客户 6 个生产基地分别使用不同 ERP，物料编码规则各异，集团层面无法做产能协同分析。使用数据映射 Skill 在 3 天内完成 6 套物料主数据的语义对齐，集团级产能看板首次可用。",
    metrics: [{ num: "61", label: "编码体系统一" }, { num: "3 天", label: "对齐周期" }, { num: "12 万", label: "物料映射条目" }]
  },
  pricing: { model: "按映射字段数计费", price: "0.05", unit: "元/字段/月", note: "映射配置一次生成，按月订阅" },
  specs: [{ k: "AI 推断准确率", v: "92%+（Top3 命中）" }, { k: "支持系统", v: "SAP/用友/金蝶/Oracle" }, { k: "字典规模", v: "内置 5000+ 工业枚举" }],
  changelog: [
    { version: "v2.0", date: "2026-05-30", content: "新增 AI 语义推断模式；内置工业主数据标准模型；支持映射规则版本化。" },
    { version: "v1.5", date: "2026-01-12", content: "新增枚举字典翻译；性能优化 3 倍。" }
  ]
},

"anomaly-detection": {
  name: "异常检测",
  icon: "",
  category: "数据处理",
  categoryKey: "data",
  status: "live",
  version: "v2.8",
  updatedAt: "2026-06-20",
  provider: "思为交互算法团队",
  protocol: "Standard Skill API v2",
  tags: ["时序异常", "孤立森林", "动态阈值", "实时告警"],
  oneLine: "基于统计分布、孤立森林、时序预测等多策略，自动识别设备参数、产品质量、能耗曲线中的异常点并告警。",
  overview: "工业场景的「异常」形态千差万别：有的是突变（设备故障瞬间）、有的是漂移（性能缓慢退化）、有的是周期异常（节律紊乱）。单一算法很难覆盖所有形态。这个 Skill 内置多策略融合引擎，自动选择或组合统计法、孤立森林、LSTM 时序预测、动态基线，给出每个异常点的置信度与可能原因。",
  capability: "支持实时流式检测与批量离线检测两种模式。实时模式延迟 < 1 秒，支持滑动窗口自适应基线；批量模式可回溯历史数据挖掘隐藏异常。每个异常输出包含：异常时间、严重等级、偏离基线的幅度、可能关联的变量、建议处置动作（若配置了规则）。告警可直推钉钉/企微/飞书。",
  params: [
    { name: "metricStream", type: "string", req: true, desc: "待检测的时序指标流 ID" },
    { name: "strategy", type: "enum", req: true, desc: "检测策略：statistical/isolation_forest/lstm/dynamic/auto", enum: ["statistical", "isolation_forest", "lstm", "dynamic", "auto"] },
    { name: "sensitivity", type: "number", req: false, desc: "灵敏度 0-1，默认 0.85，越高越敏感", def: "0.85" },
    { name: "baselineWindow", type: "string", req: false, desc: "基线学习窗口，如 '7d'，默认 '7d'", def: "7d" },
    { name: "alertChannel", type: "string", req: false, desc: "告警推送通道：dingtalk/wechat/feishu/webhook" }
  ],
  input: ["实时时序指标流（温度/压力/振动/流量/能耗等）", "历史数据（用于基线学习）"],
  output: ["异常事件列表（时间/等级/置信度/偏离幅度）", "实时告警消息", "异常原因关联分析"],
  code: `// 检测空压机振动异常，auto 策略自动选算法
const anomalies = await galileo.skill("anomaly-detection").invoke({
  metricStream: "ts://air_compressor_3/vibration",
  strategy: "auto",
  sensitivity: 0.9,
  baselineWindow: "14d",
  alertChannel: "dingtalk"
});

// 实时输出：[{ time, severity: "high", confidence: 0.96,
//   deviation: "+340%", cause: "bearing_wear" }]`,
  compose: {
    upstream: [{ icon: "", name: "数据清洗", role: "先清洗再做异常检测更准" }, { icon: "", name: "PLC 读写", role: "提供实时数据流" }],
    downstream: [{ icon: "", name: "IM 通知", role: "异常告警推送" }, { icon: "", name: "设备维护规则", role: "触发维修工单" }, { icon: "", name: "实时大屏", role: "异常闪烁联动" }]
  },
  case: {
    title: "某化工厂反应釜安全预警",
    desc: "反应釜压力与温度的微小异常往往预示着安全隐患。部署异常检测 Skill 后，在一次潜在超压事故前 42 分钟发出预警，操作人员及时介入，避免了一次可能造成数百万损失的事故。",
    metrics: [{ num: "42 分钟", label: "提前预警时间" }, { num: "96%", label: "异常识别准确率" }, { num: "<1s", label: "实时检测延迟" }]
  },
  pricing: { model: "按检测指标数计费", price: "30", unit: "元/指标/月", note: "包含实时流式检测与告警推送" },
  specs: [{ k: "实时延迟", v: "< 1 秒" }, { k: "支持策略", v: "5 种可融合" }, { k: "告警通道", v: "钉钉/企微/飞书/Webhook" }],
  changelog: [
    { version: "v2.8", date: "2026-06-20", content: "新增 LSTM 时序预测策略；异常原因关联分析上线；告警延迟优化至 <1s。" },
    { version: "v2.5", date: "2026-02-08", content: "新增动态基线自适应；灵敏度参数可调。" }
  ]
},

"subject-modeling": {
  name: "主题域建模",
  icon: "",
  category: "数据处理",
  categoryKey: "data",
  status: "beta",
  version: "v1.2",
  updatedAt: "2026-06-05",
  provider: "思为交互数据团队",
  protocol: "Standard Skill API v2",
  tags: ["主题域", "语义层", "数据中台", "DataOps"],
  oneLine: "按工业业务主题（生产、设备、质量、能源、供应链）自动构建数据主题域模型，沉淀成可复用的语义层资产。",
  overview: "数据中台建设的核心是「主题域建模」——把分散在各业务系统里的数据，按业务主题重新组织成统一、可理解、可复用的语义层。这是让 BI 自助分析、大模型推理、跨系统协同成为可能的基础设施。这个 Skill 把数据架构师的经验沉淀为自动化建模能力。",
  capability: "内置 5 大工业主题域标准模型（生产、设备、质量、能源、供应链），支持基于源系统 Schema 自动推荐主题域归属、实体关系、维度层级。生成的语义层可被 BI 报表、指标计算、大模型推理直接消费，实现「定义一次，处处可用」。支持模型版本化与影响分析。",
  params: [
    { name: "sources", type: "array<Schema>", req: true, desc: "多个源系统的 Schema 集合" },
    { name: "domain", type: "enum", req: true, desc: "主题域：production/equipment/quality/energy/supply", enum: ["production", "equipment", "quality", "energy", "supply"] },
    { name: "autoRelate", type: "boolean", req: false, desc: "是否自动推断实体关系，默认 true", def: "true" }
  ],
  input: ["多个源系统的 Schema 与样例数据", "选定的业务主题域"],
  output: ["主题域模型（实体/关系/维度/度量）", "语义层定义（可被 BI/模型消费）", "数据血缘与影响分析图"],
  code: `// 构建生产主题域模型
const model = await galileo.skill("subject-modeling").invoke({
  sources: [erpSchema, mesSchema, iotSchema],
  domain: "production",
  autoRelate: true
});
// 输出：生产主题域的实体关系图 + 语义层 JSON`,
  compose: {
    upstream: [{ icon: "", name: "数据映射", role: "先做字段对齐" }, { icon: "", name: "数据清洗", role: "干净数据建模更准" }],
    downstream: [{ icon: "", name: "BI 报表", role: "基于语义层自助分析" }, { icon: "", name: "指标计算", role: "统一口径算 KPI" }, { icon: "", name: "经营分析", role: "跨域融合分析" }]
  },
  case: {
    title: "某锂盐企业数据中台建设",
    desc: "客户原本每个报表都要从底层表手写 SQL，开发周期长、口径不一致。构建主题域模型后，业务人员可自助拖拽生成报表，报表开发周期从 2 周缩短至 2 小时。",
    metrics: [{ num: "2 周2 小时", label: "报表开发周期" }, { num: "5 大", label: "主题域覆盖" }, { num: "100%", label: "口径一致性" }]
  },
  pricing: { model: "内测邀约制", price: "—", unit: "", note: "当前仅对受邀客户开放，联系商务咨询开通" },
  specs: [{ k: "内置主题域", v: "5 大工业标准域" }, { k: "实体识别", v: "自动 + 人工校正" }, { k: "血缘追踪", v: "字段级" }],
  changelog: [
    { version: "v1.2", date: "2026-06-05", content: "新增数据血缘与影响分析；支持模型版本化。" },
    { version: "v1.0", date: "2026-03-01", content: "首发版本，5 大工业主题域标准模型。" }
  ]
},

/* ============== 算法模型（algo）============== */
"scheduling-algo": {
  name: "排产算法",
  icon: "",
  category: "算法模型",
  categoryKey: "algo",
  status: "live",
  version: "v2.4",
  updatedAt: "2026-06-15",
  provider: "思为交互算法团队",
  protocol: "Standard Skill API v2",
  tags: ["APS", "混合整数规划", "多约束", "换模优化"],
  oneLine: "综合订单优先级、设备产能、物料约束、换模时间，求解最优生产排程，输出可执行的车间工单序列。",
  overview: "排产是离散制造业最经典的优化难题：要在订单交期、设备产能、物料齐套、换模成本、人员班次等多重约束下，找到一个「最优」或「足够好」的生产顺序。这个 Skill 基于混合整数规划（MIP）+ 启发式规则的混合求解器，能在分钟级给出可执行的车间工单序列，并量化呈现排产质量（利用率、准交率、换模次数）。",
  capability: "支持多车间、多工序、多设备的复杂排产场景。约束建模支持：订单优先级与交期、设备产能与节拍、物料齐套与库存、换模时间矩阵、人员班次与技能、合批与分批。优化目标可选：最短完工、最低换模成本、最高利用率、最高准交率，支持多目标加权。求解策略：小规模用 MIP 精确求解，大规模用启发式 + 局部搜索。输出排产甘特图数据与利用率报告。",
  params: [
    { name: "orders", type: "array<Order>", req: true, desc: "订单列表（编号/产品/数量/交期/优先级）" },
    { name: "resources", type: "array<Resource>", req: true, desc: "设备资源（清单/可用工时/节拍/换模矩阵）" },
    { name: "constraints", type: "Constraints", req: true, desc: "约束条件（物料/班次/合批/工艺路径）" },
    { name: "objective", type: "enum", req: true, desc: "优化目标：makespan/changeover/utilization/ondelivery", enum: ["makespan", "changeover", "utilization", "ondelivery"] },
    { name: "horizon", type: "string", req: false, desc: "排程周期，如 '7d'，默认 '7d'", def: "7d" },
    { name: "solverMode", type: "enum", req: false, desc: "求解模式：exact（精确）/heuristic（启发式）/auto，默认 auto", def: "auto", enum: ["exact", "heuristic", "auto"] }
  ],
  input: ["订单列表（来自 ERP）", "设备产能与工艺路径（来自 MES）", "物料齐套状态（来自 WMS）", "约束配置"],
  output: ["排产工单序列（工单设备起止时间）", "排产甘特图数据", "设备利用率 / 订单准交率报告", "未排原因与冲突说明"],
  code: `// 注塑车间 7 天排产，目标：最低换模 + 最高准交
const schedule = await galileo.skill("scheduling-algo").invoke({
  orders: erpOrders,          // 23 个订单
  resources: injectionMachines, // 8 台注塑机
  constraints: {
    material: wmsKitted,
    shift: "2 shifts",
    moldChange: moldMatrix     // 换模时间矩阵
  },
  objective: "changeover",     // 优先最低换模
  horizon: "7d",
  solverMode: "auto"
});

console.log(schedule.summary);
// { utilization: 0.87, onDelivery: 0.94, changeovers: 31 }`,
  compose: {
    upstream: [{ icon: "", name: "ERP 接口", role: "订单来源" }, { icon: "", name: "WMS 接口", role: "物料齐套" }, { icon: "", name: "MES 接口", role: "产能与工艺" }],
    downstream: [{ icon: "", name: "MES 接口", role: "下发工单" }, { icon: "", name: "BI 报表", role: "排产甘特图可视化" }, { icon: "", name: "IM 通知", role: "排产结果推送" }]
  },
  case: {
    title: "OPC 老李 · 注塑车间排产",
    desc: "这正是 OPC 老李的招牌案例。某注塑厂原排产靠人工经验，换模频繁、准交率仅 76%。老李用此 Skill 结合 30 年注塑经验配置约束模板，3 天完成排产模块上线，换模次数下降 40%，准交率提升至 94%。该方案随后打包为「通用注塑排产大师 Agent」上架，持续分润。",
    metrics: [{ num: "76%94%", label: "订单准交率" }, { num: "-40%", label: "换模次数" }, { num: "3 天", label: "上线周期（OPC 交付）" }]
  },
  pricing: { model: "按求解次数计费", price: "0.5", unit: "元/次求解", note: "大规模排产按工单数阶梯计费，详情咨询商务" },
  specs: [{ k: "求解规模", v: "支持 1000+ 工单" }, { k: "求解时间", v: "典型 < 90 秒" }, { k: "求解器", v: "MIP + 启发式混合" }, { k: "SLA", v: "99.9%" }],
  changelog: [
    { version: "v2.4", date: "2026-06-15", content: "新增换模时间矩阵支持；多目标加权优化；求解性能提升 35%。" },
    { version: "v2.0", date: "2026-01-20", content: "重构为混合求解器；支持多车间协同排程。" },
    { version: "v1.0", date: "2025-08-15", content: "首发版本，单车间启发式排产。" }
  ]
},

"prediction-model": {
  name: "预测模型",
  icon: "",
  category: "算法模型",
  categoryKey: "algo",
  status: "live",
  version: "v2.1",
  updatedAt: "2026-06-10",
  provider: "思为交互算法团队",
  protocol: "Standard Skill API v2",
  tags: ["时序预测", "需求预测", "故障预测", "置信区间"],
  oneLine: "需求预测、产量预测、故障预测——基于历史数据训练时间序列与回归模型，给出未来 N 步的概率区间预测。",
  overview: "预测是工业决策的核心：备多少料、排多少人、什么时候保养设备。这个 Skill 提供端到端的预测能力：自动特征工程、模型选型、训练、评估、部署、在线推理。支持单步预测、多步滚动预测、概率区间预测，并内置模型漂移检测与自动重训机制。",
  capability: "内置 6 种预测算法：ARIMA、Prophet、LSTM、Transformer 时序、XGBoost 回归、LightGBM。支持自动特征工程（滞后特征、滚动统计、周期特征、外部变量）。模型选型基于交叉验证自动挑选最优算法。输出包含点预测值 + 80%/95% 置信区间。支持 A/B 模型对比与冠军挑战机制。",
  params: [
    { name: "history", type: "TimeSeries", req: true, desc: "历史时序数据（时间戳 + 目标值 + 特征）" },
    { name: "horizon", type: "number", req: true, desc: "预测步数（如预测未来 7 天）" },
    { name: "algorithm", type: "enum", req: false, desc: "算法：auto/arima/prophet/lstm/xgboost，默认 auto", def: "auto", enum: ["auto", "arima", "prophet", "lstm", "xgboost"] },
    { name: "features", type: "array<string>", req: false, desc: "外部特征列名，如节假日、天气、订单量" },
    { name: "confidence", type: "number", req: false, desc: "置信区间：0.8 或 0.95，默认 0.95", def: "0.95" }
  ],
  input: ["历史时序数据（带时间戳）", "外部特征变量（可选）"],
  output: ["未来 N 步预测值", "80%/95% 置信区间", "模型评估报告（MAPE/RMSE/R²）"],
  code: `// 预测未来 14 天的某产品需求
const forecast = await galileo.skill("prediction-model").invoke({
  history: demandHistory,   // 过去 2 年日销量
  horizon: 14,
  algorithm: "auto",
  features: ["holiday", "promotion"],
  confidence: 0.95
});

console.log(forecast.points);
// [{ date: "2026-07-04", value: 1280, lower: 1100, upper: 1460 }]`,
  compose: {
    upstream: [{ icon: "", name: "数据清洗", role: "清洗后的历史数据" }, { icon: "", name: "主题域建模", role: "结构化特征来源" }],
    downstream: [{ icon: "", name: "排产算法", role: "基于需求预测排产" }, { icon: "", name: "WMS 接口", role: "备件库存计划" }, { icon: "", name: "经营分析", role: "预测驱动决策" }]
  },
  case: {
    title: "某食品厂需求预测降低库存",
    desc: "食品保质期短，库存积压即报废。客户原靠人工经验备货，呆滞库存率 12%。部署预测模型后，结合促销与节假日特征，备货准确率提升至 91%，呆滞库存率降至 3.8%。",
    metrics: [{ num: "12%3.8%", label: "呆滞库存率" }, { num: "91%", label: "备货准确率" }, { num: "MAPE 8.2%", label: "预测误差" }]
  },
  pricing: { model: "按训练 + 推理计费", price: "0.3", unit: "元/千次推理", note: "训练按 GPU 时长另计" },
  specs: [{ k: "支持算法", v: "6 种自动选型" }, { k: "最大历史长度", v: "1000 万行" }, { k: "推理延迟", v: "< 200ms" }],
  changelog: [
    { version: "v2.1", date: "2026-06-10", content: "新增 Transformer 时序算法；模型漂移检测与自动重训。" },
    { version: "v2.0", date: "2026-02-28", content: "自动特征工程上线；A/B 模型对比机制。" }
  ]
},

"cv-recognition": {
  name: "CV 视觉识别",
  icon: "",
  category: "算法模型",
  categoryKey: "algo",
  status: "live",
  version: "v3.5",
  updatedAt: "2026-06-22",
  provider: "思为交互算法团队",
  protocol: "Standard Skill API v2",
  tags: ["缺陷检测", "目标检测", "图像分类", "边缘推理"],
  oneLine: "缺陷检测、表计读数、安全帽识别、堆垛计数——把摄像头画面转化为结构化业务事件，毫秒级响应。",
  overview: "计算机视觉是工业 AI 落地最广的场景。这个 Skill 把主流 CV 任务（目标检测、图像分类、分割、OCR）封装为统一接口，支持云端推理与边缘盒子推理。内置 30+ 工业预训练模型（缺陷、安全、计量、计数），也支持客户自有模型接入。毫秒级响应，满足产线节拍。",
  capability: "支持目标检测（YOLO 系列）、图像分类（ResNet/EfficientNet）、实例分割（Mask R-CNN）、OCR（PaddleOCR）。模型可云端 GPU 推理，也可下发到边缘 AI 盒子本地推理。支持模型版本管理、A/B 测试、置信度阈值调优。批量图像处理与视频流实时检测两种模式。",
  params: [
    { name: "task", type: "enum", req: true, desc: "任务类型：detection/classification/segmentation/ocr", enum: ["detection", "classification", "segmentation", "ocr"] },
    { name: "model", type: "string", req: true, desc: "模型 ID（市场预训练模型或自有模型）" },
    { name: "image", type: "ImageInput", req: true, desc: "输入图像（URL/Base64/视频流 ID）" },
    { name: "threshold", type: "number", req: false, desc: "置信度阈值 0-1，默认 0.5", def: "0.5" },
    { name: "edge", type: "boolean", req: false, desc: "是否边缘推理，默认 false（云端）", def: "false" }
  ],
  input: ["图像（JPG/PNG，URL 或 Base64）", "视频流（RTSP/RTMP）"],
  output: ["检测结果（检测框 + 类别 + 置信度）", "分类标签 + 概率", "分割掩膜（分割任务）"],
  code: `// 注塑件缺陷检测，边缘推理
const result = await galileo.skill("cv-recognition").invoke({
  task: "detection",
  model: "injection-defect-v2",  // 预训练注塑缺陷模型
  image: { streamId: "rtsp://camera_line_2" },
  threshold: 0.6,
  edge: true                     // 边缘盒子推理，<50ms
});

// [{ box: [120,80,200,160], class: "short_shot", confidence: 0.91 }]`,
  compose: {
    upstream: [{ icon: "", name: "OPC UA 接入", role: "触发拍照信号" }, { icon: "", name: "边缘控制", role: "边缘 AI 盒子" }],
    downstream: [{ icon: "", name: "质检规则", role: "基于缺陷判定合格" }, { icon: "", name: "IM 通知", role: "缺陷告警推送" }, { icon: "", name: "BI 报表", role: "良率分析" }]
  },
  case: {
    title: "某电子厂 PCB 缺陷检测",
    desc: "PCB 焊点缺陷原靠人工显微镜目检，漏检率 5%、每人每小时仅能检 60 片。部署 CV 识别 Skill + 边缘 AI 盒子后，检测速度提升至每片 0.8 秒，漏检率降至 0.3%，节约 12 名质检员。",
    metrics: [{ num: "0.8 秒/片", label: "检测速度" }, { num: "5%0.3%", label: "漏检率" }, { num: "-12 人", label: "质检人力" }]
  },
  pricing: { model: "按推理次数计费", price: "0.01", unit: "元/次推理", note: "边缘推理按盒子授权，详情咨询商务" },
  specs: [{ k: "推理延迟", v: "云端 80ms / 边缘 <50ms" }, { k: "预训练模型", v: "30+ 工业场景" }, { k: "支持格式", v: "JPG/PNG/RTSP/RTMP" }],
  changelog: [
    { version: "v3.5", date: "2026-06-22", content: "新增 YOLOv8 模型；边缘推理性能提升 2 倍；新增 OCR 能力。" },
    { version: "v3.0", date: "2026-04-10", content: "支持客户自有模型接入；A/B 测试机制。" }
  ]
},

"energy-optimization": {
  name: "能耗优化模型",
  icon: "",
  category: "算法模型",
  categoryKey: "algo",
  status: "beta",
  version: "v1.8",
  updatedAt: "2026-06-08",
  provider: "思为交互算法团队",
  protocol: "Standard Skill API v2",
  tags: ["能耗优化", "工艺约束", "参数寻优", "绿色生产"],
  oneLine: "在工艺约束与产量目标下求解最低能耗的运行参数组合，适用于窑炉、压缩机、冷冻站等高耗能设备群。",
  overview: "高耗能设备（水泥窑、空分、冷冻站、压缩机群）的运行参数组合往往有上百万种，人工经验只能找到「能用」的参数，找不到「最省」的参数。这个 Skill 基于工艺机理模型 + 数据驱动的混合优化，在满足产量与质量约束的前提下，求解能耗最低的参数组合。",
  capability: "内置水泥窑、空分、冷冻站、压缩空气系统 4 类高耗能设备的机理模型。支持自定义工艺约束（产量下限、质量窗口、安全边界）。优化算法采用贝叶斯优化 + 遗传算法混合策略，能在 10-30 次迭代内收敛到较优解。输出参数建议 + 预测能耗节省 + 置信度。",
  params: [
    { name: "equipmentType", type: "enum", req: true, desc: "设备类型：kiln/air_separation/chiller/compressor", enum: ["kiln", "air_separation", "chiller", "compressor"] },
    { name: "currentState", type: "State", req: true, desc: "当前运行状态（各传感器读数）" },
    { name: "constraints", type: "Constraints", req: true, desc: "工艺约束（产量/质量/安全边界）" },
    { name: "historyData", type: "TimeSeries", req: false, desc: "历史运行数据，用于训练数据驱动模型" }
  ],
  input: ["设备当前运行状态（实时传感器读数）", "工艺约束配置", "历史运行数据（可选）"],
  output: ["最优参数建议组合", "预测能耗节省比例", "参数调整的置信度与风险"],
  code: `// 水泥窑能耗优化
const opt = await galileo.skill("energy-optimization").invoke({
  equipmentType: "kiln",
  currentState: kilnSensors,    // 温度/风量/煤粉/转速
  constraints: {
    outputMin: 2800,            // 日产下限（吨）
    qualityWindow: { ... }      // 熟料强度窗口
  }
});

console.log(opt.recommendation);
// { params: { airFlow: 135000, coalFeed: 18.2, rpm: 3.8 },
//   saving: "4.2%", confidence: 0.89 }`,
  compose: {
    upstream: [{ icon: "", name: "数据清洗", role: "清洗历史工况数据" }, { icon: "", name: "PLC 读写", role: "实时状态采集" }],
    downstream: [{ icon: "", name: "PLC 读写", role: "下发参数到设备" }, { icon: "", name: "经营分析", role: "能耗成本归因" }, { icon: "", name: "实时大屏", role: "能耗实时监控" }]
  },
  case: {
    title: "某水泥厂窑炉能耗优化",
    desc: "客户 5000t/d 生产线原靠人工设定风煤配比，煤耗 108 kg标煤/吨熟料。部署能耗优化 Skill 后，AI 实时推荐最优参数组合，煤耗降至 103.5，年节约标煤约 8000 吨，对应成本节省超 600 万元。",
    metrics: [{ num: "108103.5", label: "kg标煤/吨熟料" }, { num: "600 万", label: "年节约成本" }, { num: "4.2%", label: "能耗降幅" }]
  },
  pricing: { model: "内测邀约制 + 节能分润", price: "—", unit: "", note: "按节能效果分成，详情咨询商务" },
  specs: [{ k: "支持设备", v: "窑炉/空分/冷冻/压缩" }, { k: "收敛迭代", v: "10-30 次" }, { k: "推理延迟", v: "< 2 秒" }],
  changelog: [
    { version: "v1.8", date: "2026-06-08", content: "新增空分设备机理模型；贝叶斯优化收敛速度提升 40%。" },
    { version: "v1.5", date: "2026-03-15", content: "新增节能分润计费模式；风险预警机制。" }
  ]
},

/* ============== 行业知识（know）============== */
"process-knowledge": {
  name: "工艺知识库",
  icon: "",
  category: "行业知识",
  categoryKey: "know",
  status: "live",
  version: "v2.6",
  updatedAt: "2026-06-12",
  provider: "思为交互知识团队",
  protocol: "RAG Skill API",
  tags: ["工艺知识", "RAG", "知识图谱", "工艺问答"],
  oneLine: "把老师傅的配方、参数窗口、故障处理经验结构化为可检索的工艺知识图谱，供 Agent 实时检索与推理。",
  overview: "工业最宝贵的资产不在系统里，而在老专家的脑子里。这个 Skill 用 RAG（检索增强生成）+ 知识图谱技术，把工艺手册、SOP、故障案例、老师傅访谈录音、历史处置记录，结构化为可被大模型实时检索的工艺知识库。Agent 遇到工艺问题时，先检索知识再给建议，让 AI 的回答「有依据、可追溯」。",
  capability: "支持多种知识源接入：PDF/Word 手册、Excel 配方表、录音转写、图片（OCR）、视频（关键帧）。自动抽取实体（参数/设备/缺陷/处置）与关系，构建工艺知识图谱。检索时支持语义检索 + 图谱推理 + 关键词召回三路融合。每个回答附带知识来源引用，可追溯、可校验。知识库可持续增量更新。",
  params: [
    { name: "query", type: "string", req: true, desc: "自然语言提问，如「窑尾温度持续偏高怎么处理」" },
    { name: "domain", type: "string", req: true, desc: "行业域，如 cement/injection/chemical，决定检索范围" },
    { name: "topK", type: "number", req: false, desc: "返回相关片段数，默认 5", def: "5" },
    { name: "withCitation", type: "boolean", req: false, desc: "是否返回来源引用，默认 true", def: "true" }
  ],
  input: ["自然语言提问", "行业域限定"],
  output: ["工艺建议（带步骤与参数）", "知识来源引用（文档/页码/章节）", "相关知识片段"],
  code: `// 查询水泥窑温度异常的处置方法
const answer = await galileo.skill("process-knowledge").invoke({
  query: "窑尾温度持续 320 度偏高，如何调整",
  domain: "cement",
  topK: 5,
  withCitation: true
});

// answer.suggestion: "建议分两步：1) 降低煤粉喂料量 5%...
//  answer.citations: [{ doc: "水泥窑工艺手册.pdf", page: 142 }]`,
  compose: {
    upstream: [{ icon: "", name: "行业 SOP", role: "SOP 知识源" }, { icon: "", name: "设备维护规则", role: "故障处置知识" }],
    downstream: [{ icon: "", name: "工艺指导 Agent", role: "为 Agent 提供工艺大脑" }, { icon: "", name: "异常检测", role: "异常时自动检索处置" }]
  },
  case: {
    title: "某水泥厂传承老师傅经验",
    desc: "客户 3 位 30 年经验的老工艺师陆续退休，工艺经验面临断层。把他们 40 年的处置记录、访谈录音、批注手册导入知识库后，新工程师通过 Agent 提问即可获得「老法师级」建议，经验得以永续传承。",
    metrics: [{ num: "30 年", label: "经验数字化" }, { num: "92%", label: "建议采纳率" }, { num: "<3 秒", label: "检索响应" }]
  },
  pricing: { model: "按检索次数计费", price: "0.1", unit: "元/次检索", note: "知识库接入按文档量一次性收费" },
  specs: [{ k: "支持格式", v: "PDF/Word/Excel/音视频/图片" }, { k: "检索延迟", v: "< 3 秒" }, { k: "召回准确率", v: "92%+" }],
  changelog: [
    { version: "v2.6", date: "2026-06-12", content: "新增知识图谱推理；多路融合检索；引用可追溯。" },
    { version: "v2.0", date: "2026-01-25", content: "支持音视频知识源；增量更新机制。" }
  ]
},

"quality-rules": {
  name: "质检规则",
  icon: "",
  category: "行业知识",
  categoryKey: "know",
  status: "live",
  version: "v2.2",
  updatedAt: "2026-05-25",
  provider: "思为交互知识团队",
  protocol: "Rule Skill API",
  tags: ["质检判定", "规则引擎", "自动放行", "降级返工"],
  oneLine: "把行业标准、企业内控、客户规范沉淀为可执行的质检规则集，自动判定批次合格、降级、返工。",
  overview: "质检判定逻辑复杂：同一指标在不同标准（国标/行标/企标/客户规范）下阈值不同，同一批次可能涉及多个指标的组合判定。这个 Skill 把判定逻辑沉淀为可配置、可版本化、可追溯的规则集，让质检 Agent 能像老师傅一样做综合判定，而不是简单的单指标超限报警。",
  capability: "规则引擎支持单指标判定、多指标组合判定、加权评分、趋势判定、批次追溯判定。规则可按客户/产品/工序分别配置，支持版本管理与生效日期。判定结果支持：合格放行、降级、返工、报废、特采申请。所有判定留痕，可生成质检报告与追溯链。",
  params: [
    { name: "inspectData", type: "object", req: true, desc: "检测数据（指标 + 实测值 + 样本数）" },
    { name: "ruleSet", type: "string", req: true, desc: "规则集 ID（按产品/客户/标准绑定）" },
    { name: "batchInfo", type: "object", req: false, desc: "批次信息（批次号/工序/客户），用于规则匹配" }
  ],
  input: ["检测数据（来自检测设备或人工录入）", "规则集配置"],
  output: ["判定结论（合格/降级/返工/报废）", "判定依据（命中了哪条规则）", "质检报告与追溯记录"],
  code: `// 注塑件出厂质检判定
const verdict = await galileo.skill("quality-rules").invoke({
  inspectData: {
    dimensions: { length: 100.2, width: 50.1 },  // mm
    appearance: { scratch: 0, color: "OK" },
    weight: 85.3
  },
  ruleSet: "injection-customerA-v3",
  batchInfo: { batch: "B20260630", customer: "A" }
});

// verdict.result: "pass", verdict.reason: "全部指标在窗口内"`,
  compose: {
    upstream: [{ icon: "", name: "CV 视觉识别", role: "外观缺陷数据" }, { icon: "", name: "PLC 读写", role: "尺寸/重量采集" }],
    downstream: [{ icon: "", name: "MES 接口", role: "质检结果回写" }, { icon: "", name: "BI 报表", role: "良率分析" }, { icon: "", name: "IM 通知", role: "异常放行审批" }]
  },
  case: {
    title: "某锂盐企业质检自动化",
    desc: "客户原质检判定靠人工对照标准，慢且易出错。沉淀 300+ 条质检规则后，95% 的批次实现自动判定放行，仅 5% 的边界案例需人工复核，质检周期从 4 小时压缩至 20 分钟。",
    metrics: [{ num: "95%", label: "自动判定率" }, { num: "4h20min", label: "质检周期" }, { num: "300+", label: "规则条目" }]
  },
  pricing: { model: "按判定次数计费", price: "0.05", unit: "元/次判定", note: "规则配置按项目一次性收费" },
  specs: [{ k: "规则规模", v: "单规则集 1000+ 条" }, { k: "判定延迟", v: "< 100ms" }, { k: "可追溯", v: "批次级" }],
  changelog: [
    { version: "v2.2", date: "2026-05-25", content: "新增加权评分判定；特采申请流程；规则版本管理。" },
    { version: "v2.0", date: "2026-02-15", content: "多客户多标准隔离；追溯链生成。" }
  ]
},

"maintenance-rules": {
  name: "设备维护规则",
  icon: "",
  category: "行业知识",
  categoryKey: "know",
  status: "live",
  version: "v2.0",
  updatedAt: "2026-06-01",
  provider: "思为交互知识团队",
  protocol: "Rule Skill API",
  tags: ["预测维护", "TPM", "故障树", "保养计划"],
  oneLine: "把点检标准、润滑周期、故障树、备件替换逻辑编码为规则引擎，自动生成保养计划与维修工单。",
  overview: "设备维护从「坏了再修」到「按规则预防」是第一步，再到「按状态预测」是第二步。这个 Skill 把设备维护的所有规则（点检周期、润滑标准、故障树、备件替换逻辑）编码为可执行规则引擎，自动生成保养计划、触发维修工单、推荐备件，是预测性维护 Agent 的规则大脑。",
  capability: "支持周期型规则（每 N 天/小时保养）、条件型规则（振动超阈值触发）、故障树型规则（多症状组合判定故障源）。规则可按设备型号分别配置。输出包含：保养任务清单、维修工单（含故障原因与处置建议）、备件推荐清单。所有工单状态可追踪。",
  params: [
    { name: "deviceState", type: "object", req: true, desc: "设备状态（运行时长/传感器读数/告警历史）" },
    { name: "ruleSet", type: "string", req: true, desc: "维护规则集 ID（按设备型号绑定）" },
    { name: "maintenanceHistory", type: "array", req: false, desc: "历史维护记录，避免重复派单" }
  ],
  input: ["设备实时状态（来自 IoT）", "维护规则集", "历史维护记录"],
  output: ["保养任务清单（周期型）", "维修工单（异常触发型）", "备件推荐清单"],
  code: `// 空压机维护任务生成
const tasks = await galileo.skill("maintenance-rules").invoke({
  deviceState: {
    runtimeHours: 8200,
    vibration: 5.2,
    temperature: 78
  },
  ruleSet: "air-compressor-model-x"
});

// tasks: [
//   { type: "periodic", action: "更换机油", due: "7d" },
//   { type: "alarm", action: "检查轴承", priority: "high",
//     cause: "振动持续偏高", parts: ["轴承-6205"] }
// ]`,
  compose: {
    upstream: [{ icon: "", name: "异常检测", role: "异常触发维护规则" }, { icon: "", name: "PLC 读写", role: "设备状态采集" }],
    downstream: [{ icon: "", name: "WMS 接口", role: "备件库存查询" }, { icon: "", name: "IM 通知", role: "工单推送维修人员" }, { icon: "", name: "MES 接口", role: "维修停机同步" }]
  },
  case: {
    title: "某铝业设备预测性维护",
    desc: "客户 200+ 台关键设备原靠定期保养，过度维修与突发故障并存。部署维护规则 + 异常检测后，30% 的周期保养被状态触发取代，突发故障下降 60%，备件库存周转提升 2 倍。",
    metrics: [{ num: "-60%", label: "突发故障率" }, { num: "×2", label: "备件周转" }, { num: "30%", label: "状态触发占比" }]
  },
  pricing: { model: "按设备数计费", price: "50", unit: "元/设备/月", note: "包含规则引擎与工单管理" },
  specs: [{ k: "规则类型", v: "周期/条件/故障树" }, { k: "支持设备规模", v: "万台+" }, { k: "工单延迟", v: "实时" }],
  changelog: [
    { version: "v2.0", date: "2026-06-01", content: "新增故障树推理；备件推荐；工单全流程追踪。" },
    { version: "v1.5", date: "2026-03-08", content: "支持多设备型号规则隔离。" }
  ]
},

"industry-sop": {
  name: "行业 SOP",
  icon: "",
  category: "行业知识",
  categoryKey: "know",
  status: "soon",
  version: "v1.0",
  updatedAt: "2026-06-25",
  provider: "思为交互知识团队",
  protocol: "Workflow Skill API",
  tags: ["标准作业", "流程驱动", "合规留痕", "培训"],
  oneLine: "开停机、换产、清洗、应急处置等标准作业流程的结构化模板，可被 Agent 按步骤驱动执行与留痕。",
  overview: "标准作业流程（SOP）在工厂里通常是纸面文档或 PDF，执行靠人记忆，合规靠事后抽查。这个 Skill 把 SOP 结构化为可执行的流程模板，Agent 能按步骤逐步驱动（提示下一步、采集确认、记录耗时），全流程自动留痕，既是执行工具也是合规证据。",
  capability: "内置 5 类工业 SOP 模板：开停机、换产换模、清洗清场、应急处置、巡检。每个 SOP 可定义步骤序列、每步的确认方式（拍照/签名/数值）、超时规则、跳步审批。执行记录自动归档，支持合规审计与培训复盘。",
  params: [
    { name: "sopType", type: "enum", req: true, desc: "SOP 类型：startup/shutdown/changeover/cleaning/emergency/inspection", enum: ["startup", "shutdown", "changeover", "cleaning", "emergency", "inspection"] },
    { name: "equipment", type: "string", req: true, desc: "目标设备 ID" },
    { name: "operator", type: "string", req: false, desc: "操作人 ID，用于留痕" }
  ],
  input: ["SOP 类型与目标设备", "操作人信息"],
  output: ["步骤化执行指引", "每步确认记录（照片/签名/数值）", "完整执行档案（合规留痕）"],
  code: `// 驱动水泥磨开机 SOP
const session = await galileo.skill("industry-sop").start({
  sopType: "startup",
  equipment: "cement_mill_2",
  operator: "EMP-1024"
});

// session.currentStep: { seq: 3, action: "检查润滑系统",
//   confirmBy: "photo", timeout: "10min" }`,
  compose: {
    upstream: [{ icon: "", name: "工艺知识库", role: "提供 SOP 知识源" }],
    downstream: [{ icon: "", name: "IM 通知", role: "步骤确认推送" }, { icon: "", name: "BI 报表", role: "SOP 执行率统计" }]
  },
  case: { title: "即将上架", desc: "该 Skill 正在内测打磨，已在 2 家水泥厂完成 POC，预计 2026 Q3 正式发布。", metrics: [{ num: "Q3 2026", label: "预计发布" }, { num: "5 类", label: "SOP 模板" }, { num: "2 家", label: "POC 客户" }] },
  pricing: { model: "即将上架", price: "—", unit: "", note: "内测邀约中，联系商务咨询" },
  specs: [{ k: "SOP 模板", v: "5 类工业标准" }, { k: "确认方式", v: "拍照/签名/数值" }, { k: "合规留痕", v: "全流程归档" }],
  changelog: [{ version: "v1.0", date: "2026-06-25", content: "首发内测版本，5 类 SOP 模板，2 家 POC 客户验证中。" }]
},

/* ============== 设备控制（device）============== */
"plc-readwrite": {
  name: "PLC 读写",
  icon: "",
  category: "设备控制",
  categoryKey: "device",
  status: "live",
  version: "v3.2",
  updatedAt: "2026-06-18",
  provider: "思为交互 IoT 团队",
  protocol: "IoT Skill API",
  tags: ["PLC", "西门子", "三菱", "点位读写"],
  oneLine: "对接主流 PLC（西门子、三菱、欧姆龙、汇川），支持点位读取、批量写入、定时轮询，把底层控制能力暴露给上层 Agent。",
  overview: "PLC 是工业设备的「大脑」，但传统上它是个黑盒——数据出不来、指令下不去。这个 Skill 把主流品牌 PLC 的读写能力封装为统一接口，Agent 无需关心底层协议差异，只需声明要读哪个点位、写什么值。这是「哑设备通网」、实现闭环控制的基础。",
  capability: "支持西门子 S7 系列（S7Comm/S7Comm-Plus）、三菱（MC 协议）、欧姆龙（Fins）、汇川、Modbus 等 10+ 主流 PLC 协议。支持点位读取（单点/批量）、点位写入、定时轮询（最低 100ms）、订阅推送（变化触发）。内置点位地址表管理、连接池、断线重连、读写权限控制。",
  params: [
    { name: "deviceId", type: "string", req: true, desc: "PLC 设备 ID（在地址表中注册）" },
    { name: "operation", type: "enum", req: true, desc: "操作：read/write/poll/subscribe", enum: ["read", "write", "poll", "subscribe"] },
    { name: "points", type: "array<Point>", req: true, desc: "点位列表（地址/数据类型/读写值）" },
    { name: "interval", type: "number", req: false, desc: "轮询间隔（毫秒），仅 poll 模式，默认 1000", def: "1000" }
  ],
  input: ["PLC 设备连接信息", "点位地址表"],
  output: ["读取的点位值", "写入结果（成功/失败）", "订阅变化的推送事件"],
  code: `// 读取西门子 S7-1500 的 8 个点位
const values = await galileo.skill("plc-readwrite").invoke({
  deviceId: "s7-1500-line-1",
  operation: "read",
  points: [
    { address: "DB1.DBX0.0", type: "bool" },    // 运行状态
    { address: "DB1.DBD4",   type: "float" },   // 实时温度
    { address: "DB1.DBD8",   type: "float" }    // 实时压力
  ]
});
// values: { "DB1.DBX0.0": true, "DB1.DBD4": 185.3, "DB1.DBD8": 2.1 }`,
  compose: {
    upstream: [],
    downstream: [{ icon: "", name: "数据清洗", role: "原始点位数据清洗" }, { icon: "", name: "异常检测", role: "基于点位值检测异常" }, { icon: "", name: "实时大屏", role: "实时状态展示" }, { icon: "", name: "能耗优化模型", role: "下发优化参数" }]
  },
  case: {
    title: "某铝业「哑设备」联网改造",
    desc: "客户 80 台关键设备中 60% 是 5 年以上老 PLC，数据无法上云。使用 PLC 读写 Skill 在 1 周内完成全部联网，OEE 数据首次可视化，发现 12 台设备稼动率不足 60%，针对性优化后平均稼动率提升 18%。",
    metrics: [{ num: "80 台", label: "设备联网" }, { num: "1 周", label: "改造周期" }, { num: "+18%", label: "稼动率提升" }]
  },
  pricing: { model: "按点位数计费", price: "1", unit: "元/点位/月", note: "包含连接管理与数据采集" },
  specs: [{ k: "支持协议", v: "10+ 主流 PLC" }, { k: "最低轮询间隔", v: "100ms" }, { k: "并发点位", v: "10 万+" }, { k: "SLA", v: "99.95%" }],
  changelog: [
    { version: "v3.2", date: "2026-06-18", content: "新增汇川 PLC 支持；连接池性能优化；断线重连机制升级。" },
    { version: "v3.0", date: "2026-01-30", content: "重构为统一 IoT Skill API；新增订阅推送模式。" }
  ]
},

"opcua-access": {
  name: "OPC UA 接入",
  icon: "",
  category: "设备控制",
  categoryKey: "device",
  status: "live",
  version: "v2.5",
  updatedAt: "2026-06-14",
  provider: "思为交互 IoT 团队",
  protocol: "IoT Skill API",
  tags: ["OPC UA", "工业互联", "证书认证", "节点订阅"],
  oneLine: "基于 OPC UA 协议与设备/系统做安全双向通信，支持节点订阅、证书认证、地址空间浏览，是工业互联的标准底座。",
  overview: "OPC UA 是工业互联的国际化标准协议，比传统 PLC 协议更安全（证书认证）、更标准（统一信息模型）、更可扩展。这个 Skill 提供完整的 OPC UA 客户端能力，是构建标准化、跨品牌工业互联的基础组件，尤其适合新建设备或对安全要求高的场景。",
  capability: "支持 OPC UA 标准的全部核心服务：节点读写、订阅（数据变化 + 事件）、历史数据访问、方法调用、地址空间浏览。安全支持证书认证 + 用户名密码 + 加密传输。支持自动发现 OPC UA 服务器。可浏览地址空间自动生成点位映射。",
  params: [
    { name: "endpoint", type: "string", req: true, desc: "OPC UA 端点 URL，如 opc.tcp://192.168.1.10:4840" },
    { name: "security", type: "SecurityConfig", req: true, desc: "安全配置（证书/密码/加密模式）" },
    { name: "operation", type: "enum", req: true, desc: "操作：browse/read/write/subscribe/call", enum: ["browse", "read", "write", "subscribe", "call"] },
    { name: "nodes", type: "array<string>", req: false, desc: "节点 ID 列表（read/write/subscribe 操作）" }
  ],
  input: ["OPC UA 端点与安全证书", "目标节点 ID"],
  output: ["节点值/结构", "订阅变化事件", "地址空间结构（browse）"],
  code: `// 订阅 OPC UA 节点变化
const sub = await galileo.skill("opcua-access").invoke({
  endpoint: "opc.tcp://10.0.1.50:4840",
  security: { mode: "SignAndEncrypt", cert: certPath },
  operation: "subscribe",
  nodes: ["ns=2;s=Temperature", "ns=2;s=Pressure"]
});
// 节点变化时实时推送事件`,
  compose: {
    upstream: [],
    downstream: [{ icon: "", name: "数据清洗", role: "节点数据清洗" }, { icon: "", name: "异常检测", role: "节点异常检测" }, { icon: "", name: "MES 接口", role: "标准化数据对接 MES" }]
  },
  case: {
    title: "某汽车零部件厂标准化互联",
    desc: "客户新工厂 30 台设备全部支持 OPC UA，使用此 Skill 在 3 天内完成统一互联与数据采集，相比传统 PLC 协议集成，开发量减少 70%，且天然支持安全认证与跨品牌互通。",
    metrics: [{ num: "3 天", label: "互联周期" }, { num: "-70%", label: "集成开发量" }, { num: "30 台", label: "跨品牌设备" }]
  },
  pricing: { model: "按连接数计费", price: "20", unit: "元/连接/月", note: "包含安全证书管理与订阅" },
  specs: [{ k: "OPC UA 规范", v: "1.05 完整支持" }, { k: "安全模式", v: "None/Sign/SignAndEncrypt" }, { k: "订阅并发", v: "5 万节点" }],
  changelog: [
    { version: "v2.5", date: "2026-06-14", content: "支持 OPC UA 1.05；自动发现服务器；地址空间自动映射。" },
    { version: "v2.0", date: "2026-02-20", content: "历史数据访问；方法调用支持。" }
  ]
},

"modbus-access": {
  name: "Modbus 接入",
  icon: "",
  category: "设备控制",
  categoryKey: "device",
  status: "live",
  version: "v2.8",
  updatedAt: "2026-05-28",
  provider: "思为交互 IoT 团队",
  protocol: "IoT Skill API",
  tags: ["Modbus TCP", "Modbus RTU", "老旧设备", "寄存器"],
  oneLine: "对接 Modbus TCP/RTU 协议的仪表、变频器、温控仪，支持寄存器映射、轮询、异常码解析，覆盖存量老旧设备。",
  overview: "尽管 OPC UA 是未来标准，但工厂里大量存量设备（仪表、变频器、温控仪、电能表）还在用 Modbus 协议。这个 Skill 专门覆盖这些「不会被换掉的老设备」，让它们也能接入 Galileo OS，避免「哑设备」永远哑下去。",
  capability: "同时支持 Modbus TCP 与 Modbus RTU（串口/网关转换）。支持保持寄存器（HR）、输入寄存器（IR）、线圈（COIL）、离散输入（DI）四类数据。寄存器映射表可配置（地址/数据类型/缩放/单位）。支持批量轮询、异常码解析（非法地址/设备忙等）、断线重连。",
  params: [
    { name: "connection", type: "Connection", req: true, desc: "连接配置（TCP: IP+端口 / RTU: 串口参数）" },
    { name: "registerMap", type: "array<Register>", req: true, desc: "寄存器映射表（地址/类型/缩放/单位）" },
    { name: "operation", type: "enum", req: true, desc: "操作：read/write/poll", enum: ["read", "write", "poll"] },
    { name: "interval", type: "number", req: false, desc: "轮询间隔（毫秒），默认 2000", def: "2000" }
  ],
  input: ["Modbus 连接配置", "寄存器映射表"],
  output: ["解析后的物理量值（带单位）", "异常码与告警"],
  code: `// 轮询电表的有功功率与电压
const data = await galileo.skill("modbus-access").invoke({
  connection: { type: "TCP", ip: "192.168.1.88", port: 502, slaveId: 1 },
  registerMap: [
    { address: 0x1000, type: "float", scale: 1,    unit: "kW", name: "power" },
    { address: 0x1002, type: "float", scale: 0.1,  unit: "V",  name: "voltage" }
  ],
  operation: "poll",
  interval: 2000
});
// data: { power: 128.5, voltage: 380.2 }`,
  compose: {
    upstream: [],
    downstream: [{ icon: "", name: "数据清洗", role: "原始寄存器值清洗" }, { icon: "", name: "能耗优化模型", role: "能耗数据来源" }, { icon: "", name: "指标计算", role: "能耗 KPI 计算" }]
  },
  case: {
    title: "某化工园区能耗全采集",
    desc: "客户园区 200+ 块电表、80 台变频器全是 Modbus 协议，原靠人工抄表。使用此 Skill + 边缘网关，2 周完成全量自动采集，能耗数据首次实现分钟级 granularity，发现 3 处长期跑冒滴漏。",
    metrics: [{ num: "280 台", label: "设备全采集" }, { num: "2 周", label: "实施周期" }, { num: "3 处", label: "跑冒滴漏发现" }]
  },
  pricing: { model: "按设备数计费", price: "5", unit: "元/设备/月", note: "包含寄存器映射与轮询" },
  specs: [{ k: "协议支持", v: "Modbus TCP/RTU" }, { k: "寄存器类型", v: "HR/IR/COIL/DI" }, { k: "并发设备", v: "5000+" }],
  changelog: [
    { version: "v2.8", date: "2026-05-28", content: "异常码完整解析；批量轮询性能优化 3 倍。" },
    { version: "v2.5", date: "2026-03-20", content: "RTU 网关转换支持；断线重连机制。" }
  ]
},

"edge-control": {
  name: "边缘控制",
  icon: "",
  category: "设备控制",
  categoryKey: "device",
  status: "beta",
  version: "v1.5",
  updatedAt: "2026-06-03",
  provider: "思为交互 IoT 团队",
  protocol: "Edge Skill API",
  tags: ["边缘计算", "断网续跑", "本地决策", "低延迟"],
  oneLine: "在边缘网关上做本地规则计算与下发，断网时仍可执行控制策略，保障生产连续性，降低云上延迟。",
  overview: "工业控制对延迟和可靠性极其敏感——云端一来一回几百毫秒的延迟，在某些场景下就可能导致质量事故或安全事故；网络一旦中断，控制策略不能停。这个 Skill 把规则计算与控制下发下沉到边缘网关，本地决策、本地执行，云上只做策略管理与监控。",
  capability: "在思为认证的边缘 AI 盒子上运行本地规则引擎。支持阈值规则、PID 控制、状态机、简单 ML 模型推理。断网时自动切换为本地自治模式，按预设策略持续控制；网络恢复后自动同步离线期间的状态与日志。策略从云上下发，支持灰度发布与回滚。",
  params: [
    { name: "gatewayId", type: "string", req: true, desc: "边缘网关 ID" },
    { name: "strategy", type: "Strategy", req: true, desc: "本地控制策略（规则/PID/状态机）" },
    { name: "inputs", type: "array<string>", req: true, desc: "输入点位 ID 列表" },
    { name: "outputs", type: "array<string>", req: true, desc: "输出控制点位 ID 列表" }
  ],
  input: ["本地传感器实时数据", "云端下发的控制策略"],
  output: ["本地控制指令（实时下发）", "执行日志与状态（同步云端）"],
  code: `// 下发温度 PID 控制策略到边缘网关
await galileo.skill("edge-control").deploy({
  gatewayId: "edge-gw-plant1",
  strategy: {
    type: "pid",
    input: "reactor_temp",
    output: "cooling_valve",
    params: { kp: 2.0, ki: 0.5, kd: 0.1, setpoint: 85 }
  }
});
// 网关本地执行，断网时仍保持 85°C 恒温控制`,
  compose: {
    upstream: [{ icon: "", name: "PLC 读写", role: "提供输入/输出点位" }, { icon: "", name: "Modbus 接入", role: "仪表数据源" }],
    downstream: [{ icon: "", name: "CV 视觉识别", role: "边缘 AI 推理" }, { icon: "", name: "实时大屏", role: "边缘状态监控" }]
  },
  case: {
    title: "某化工厂反应釜断网保护",
    desc: "客户反应釜温控原依赖云端下发，一次网络故障导致 4 分钟失控，险些酿成事故。部署边缘控制后，温控策略在网关本地运行，断网期间仍稳定控制，后续再无此类隐患。",
    metrics: [{ num: "<50ms", label: "本地控制延迟" }, { num: "100%", label: "断网可用率" }, { num: "0", label: "断网失控事件" }]
  },
  pricing: { model: "按网关授权计费", price: "—", unit: "", note: "硬件盒子 + 授权，详情咨询商务" },
  specs: [{ k: "控制延迟", v: "本地 < 50ms" }, { k: "策略类型", v: "规则/PID/状态机/ML" }, { k: "断网自治", v: "完全自主运行" }],
  changelog: [
    { version: "v1.5", date: "2026-06-03", content: "新增 ML 模型边缘推理；灰度发布与回滚。" },
    { version: "v1.0", date: "2026-04-22", content: "首发版本，规则引擎 + PID 控制 + 断网自治。" }
  ]
},

/* ============== 集成连接（integ）============== */
"erp-integration": {
  name: "ERP 接口",
  icon: "",
  category: "集成连接",
  categoryKey: "integ",
  status: "live",
  version: "v3.0",
  updatedAt: "2026-06-16",
  provider: "思为交互集成团队",
  protocol: "Integration Skill API",
  tags: ["SAP", "用友", "金蝶", "订单同步"],
  oneLine: "对接 SAP、用友、金蝶等主流 ERP，同步销售订单、采购单、BOM、库存，打通经营层与执行层的数据闭环。",
  overview: "ERP 是企业的经营大脑，但它的数据往往是「T+1」甚至更慢的快照，与车间实时执行脱节。这个 Skill 提供主流 ERP 的标准化对接能力，让订单、BOM、库存等经营数据能实时流入 Galileo OS，与生产执行数据形成闭环。",
  capability: "支持 SAP（RFC/OData/IDoc）、用友 NCC、金蝶云星空、Oracle EBS 的标准接口。预置 30+ 常用业务对象（销售订单、采购单、BOM、库存、物料主数据、客户主数据）的同步模板。支持实时同步（消息推送）与定时全量同步两种模式。数据映射规则可配置，支持双向同步（订单下发 + 报工回写）。",
  params: [
    { name: "system", type: "enum", req: true, desc: "ERP 系统：sap/yonyou/kingdee/oracle", enum: ["sap", "yonyou", "kingdee", "oracle"] },
    { name: "connection", type: "Connection", req: true, desc: "连接配置（地址/账号/认证）" },
    { name: "object", type: "string", req: true, desc: "业务对象：sales_order/purchase/bom/inventory/material" },
    { name: "syncMode", type: "enum", req: false, desc: "同步模式：realtime/batch，默认 realtime", def: "realtime", enum: ["realtime", "batch"] }
  ],
  input: ["ERP 连接配置", "同步范围（业务对象 + 过滤条件）"],
  output: ["同步的业务数据（标准化格式）", "同步日志与异常告警"],
  code: `// 实时同步 SAP 销售订单
const orders = await galileo.skill("erp-integration").invoke({
  system: "sap",
  connection: sapConn,
  object: "sales_order",
  syncMode: "realtime",
  filter: { createdAfter: "2026-07-01" }
});`,
  compose: {
    upstream: [],
    downstream: [{ icon: "", name: "排产算法", role: "订单驱动排产" }, { icon: "", name: "数据映射", role: "ERP 字段对齐" }, { icon: "", name: "经营分析", role: "业财数据融合" }]
  },
  case: {
    title: "某装备制造商订单到工单闭环",
    desc: "客户原 SAP 订单与车间 MES 工单靠人工转单，延迟 1 天且易错。使用 ERP 接口 Skill 后，订单实时同步并自动触发排产，从接单到开工缩短至 2 小时，错单率降为 0。",
    metrics: [{ num: "24h2h", label: "接单到开工" }, { num: "0", label: "错单率" }, { num: "实时", label: "数据同步" }]
  },
  pricing: { model: "按连接 + 同步量计费", price: "2000", unit: "元/连接/月", note: "超量按同步条数阶梯计费" },
  specs: [{ k: "支持系统", v: "SAP/用友/金蝶/Oracle" }, { k: "预置对象", v: "30+ 业务对象" }, { k: "同步模式", v: "实时 + 批量" }],
  changelog: [
    { version: "v3.0", date: "2026-06-16", content: "新增 Oracle EBS 支持；双向同步；实时消息推送。" },
    { version: "v2.5", date: "2026-03-25", content: "金蝶云星空对接；预置模板扩充至 30+。" }
  ]
},

"mes-integration": {
  name: "MES 接口",
  icon: "",
  category: "集成连接",
  categoryKey: "integ",
  status: "live",
  version: "v2.4",
  updatedAt: "2026-06-09",
  provider: "思为交互集成团队",
  protocol: "Integration Skill API",
  tags: ["MES", "工单下发", "报工回收", "在制品"],
  oneLine: "对接制造执行系统，下发工单、回收报工、同步在制品状态，让 Agent 实时掌握车间执行进度。",
  overview: "MES 是车间执行的核心系统，掌管工单流转、报工、在制品状态。这个 Skill 让 Galileo OS 的 Agent 能与 MES 双向交互：把排产结果下发为工单，把车间实际执行进度回收到 Agent 的决策上下文，形成「计划-执行-反馈」闭环。",
  capability: "支持与主流 MES（自研、用友、宝信、中控）以及 Galileo OS 自带轻量 MES 的对接。核心能力：工单下发与状态同步、报工数据回收（产量/工时/质量）、在制品位置与状态查询、工序流转事件订阅。支持工单拆分、合批、紧急插单等复杂场景。",
  params: [
    { name: "system", type: "string", req: true, desc: "MES 系统标识（或 galileo-native）" },
    { name: "operation", type: "enum", req: true, desc: "操作：dispatch/report/wip_query/subscribe", enum: ["dispatch", "report", "wip_query", "subscribe"] },
    { name: "workOrder", type: "WorkOrder", req: false, desc: "工单数据（dispatch 操作）" }
  ],
  input: ["MES 连接配置", "工单数据（下发时）"],
  output: ["下发结果", "报工数据（产量/工时/质量）", "在制品状态"],
  code: `// 下发工单到 MES
await galileo.skill("mes-integration").invoke({
  system: "galileo-native",
  operation: "dispatch",
  workOrder: {
    id: "WO-20260703-001",
    product: "注塑件-A", quantity: 500,
    route: ["注塑", "检验", "包装"], dueDate: "2026-07-05"
  }
});`,
  compose: {
    upstream: [{ icon: "", name: "排产算法", role: "排产结果下发工单" }, { icon: "", name: "ERP 接口", role: "订单来源" }],
    downstream: [{ icon: "", name: "BI 报表", role: "执行进度可视化" }, { icon: "", name: "实时大屏", role: "车间状态大屏" }, { icon: "", name: "IM 通知", role: "工单状态推送" }]
  },
  case: {
    title: "某电子厂排产执行闭环",
    desc: "客户排产与执行脱节，计划员不知道车间实际进度，频繁重排。MES 接口打通后，Agent 实时感知执行偏差，自动触发重排建议，计划准确率从 68% 提升至 91%。",
    metrics: [{ num: "68%91%", label: "计划准确率" }, { num: "实时", label: "执行反馈" }, { num: "-70%", label: "重排频次" }]
  },
  pricing: { model: "按工单量计费", price: "0.1", unit: "元/工单", note: "包含下发与报工回收" },
  specs: [{ k: "对接系统", v: "自研/用友/宝信/中控" }, { k: "工单规模", v: "万级/日" }, { k: "同步延迟", v: "实时" }],
  changelog: [
    { version: "v2.4", date: "2026-06-09", content: "新增工单拆分/合批；在制品状态订阅。" },
    { version: "v2.0", date: "2026-02-10", content: "支持中控 MES；紧急插单流程。" }
  ]
},

"wms-integration": {
  name: "WMS 接口",
  icon: "",
  category: "集成连接",
  categoryKey: "integ",
  status: "live",
  version: "v2.2",
  updatedAt: "2026-05-22",
  provider: "思为交互集成团队",
  protocol: "Integration Skill API",
  tags: ["WMS", "库存同步", "物料追溯", "备件调度"],
  oneLine: "对接仓储管理系统，同步入库、出库、移库、库存，支撑物料追溯、齐套分析与备件调度。",
  overview: "WMS 掌管物料与成品的物理流转。这个 Skill 让 Agent 实时掌握库存状态，支撑齐套分析（排产前确认物料是否齐全）、备件调度（维修时定位备件位置）、物料追溯（质量问题时追溯批次流向）。",
  capability: "支持主流 WMS（自研、SAP EWM、富勒、科箭）对接。核心能力：实时库存查询、出入库流水同步、批次追溯（正向/反向）、库位状态查询、齐套分析（给定工单判断物料是否齐全）。",
  params: [
    { name: "system", type: "string", req: true, desc: "WMS 系统标识" },
    { name: "operation", type: "enum", req: true, desc: "操作：inventory/inbound/outbound/trace/kitted", enum: ["inventory", "inbound", "outbound", "trace", "kitted"] },
    { name: "material", type: "string", req: false, desc: "物料编码（inventory/trace 操作）" }
  ],
  input: ["WMS 连接配置", "查询条件（物料/批次/库位）"],
  output: ["库存快照", "出入库流水", "批次追溯链", "齐套分析结果"],
  code: `// 查询排产工单的物料齐套情况
const kitted = await galileo.skill("wms-integration").invoke({
  system: "galileo-native",
  operation: "kitted",
  material: "WO-20260703-001"  // 工单号
});
// kitted: { ready: false, missing: [{code:"M-102", short: 200}] }`,
  compose: {
    upstream: [{ icon: "", name: "排产算法", role: "排产前齐套校验" }, { icon: "", name: "设备维护规则", role: "备件定位" }],
    downstream: [{ icon: "", name: "ERP 接口", role: "采购补货" }, { icon: "", name: "质检规则", role: "批次质量追溯" }]
  },
  case: {
    title: "某锂盐企业批次追溯",
    desc: "客户产品涉及安全关键属性，一旦出现问题需快速追溯。WMS 接口打通后，从成品到原料的全链路追溯从 2 天缩短至 30 秒，满足合规审计要求。",
    metrics: [{ num: "2 天30 秒", label: "追溯响应" }, { num: "100%", label: "批次覆盖率" }, { num: "合规", label: "审计通过" }]
  },
  pricing: { model: "按查询量计费", price: "0.02", unit: "元/次查询", note: "出入库同步按条数计费" },
  specs: [{ k: "对接系统", v: "自研/SAP EWM/富勒/科箭" }, { k: "追溯粒度", v: "批次级" }, { k: "查询延迟", v: "< 500ms" }],
  changelog: [
    { version: "v2.2", date: "2026-05-22", content: "新增齐套分析；反向追溯；库位状态实时。" },
    { version: "v2.0", date: "2026-01-18", content: "支持富勒 WMS；批次追溯链。" }
  ]
},

"im-notification": {
  name: "钉钉 / 企微 / 飞书通知",
  icon: "",
  category: "集成连接",
  categoryKey: "integ",
  status: "live",
  version: "v3.3",
  updatedAt: "2026-06-19",
  provider: "思为交互集成团队",
  protocol: "Integration Skill API",
  tags: ["钉钉", "企微", "飞书", "告警触达"],
  oneLine: "把 Agent 产生的告警、工单、日报、审批推送到企业 IM，支持群机器人、应用消息、工作通知多种触达方式。",
  overview: "工业场景的告警、工单、审批如果不及时触达人，再智能的系统也只是个孤岛。这个 Skill 把主流企业 IM（钉钉、企微、飞书）的触达能力封装为统一接口，Agent 一次调用，消息直达人的手机。这是让 AI 决策真正「驱动人行动」的最后一公里。",
  capability: "支持钉钉、企业微信、飞书三大平台。触达方式：群机器人（Webhook）、应用消息（需企业应用授权）、工作通知、待办事项。消息类型：文本、Markdown、卡片（可带按钮交互）、图片。支持 @ 指定人、消息回执确认、重试机制、消息模板管理。",
  params: [
    { name: "platform", type: "enum", req: true, desc: "平台：dingtalk/wechat/feishu", enum: ["dingtalk", "wechat", "feishu"] },
    { name: "channel", type: "enum", req: true, desc: "通道：robot/app/work_notification", enum: ["robot", "app", "work_notification"] },
    { name: "message", type: "Message", req: true, desc: "消息内容（类型 + 标题 + 正文 + 按钮）" },
    { name: "targets", type: "array<string>", req: false, desc: "接收人（手机号/用户ID/@人），robot 通道可省略" }
  ],
  input: ["消息内容与格式", "目标接收人"],
  output: ["送达回执", "已读状态（应用消息）", "按钮交互回调（卡片消息）"],
  code: `// 设备告警推送到钉钉群，带"立即处理"按钮
await galileo.skill("im-notification").invoke({
  platform: "dingtalk",
  channel: "robot",
  message: {
    type: "card",
    title: " 空压机振动超限",
    body: "**设备：** AC-3\\n**振动：** 5.8 mm/s（阈值 4.5）\\n**建议：** 检查轴承",
    buttons: [{ text: "立即处理", action: "assign_maintenance" }]
  }
});`,
  compose: {
    upstream: [{ icon: "", name: "异常检测", role: "异常触发告警" }, { icon: "", name: "设备维护规则", role: "工单触发推送" }],
    downstream: []
  },
  case: {
    title: "某水泥厂告警触达提速",
    desc: "客户原告警靠短信，打开率仅 40%、响应慢。改用 IM 卡片消息 + 互动按钮后，告警打开率 96%，平均响应时间从 18 分钟降至 4 分钟。",
    metrics: [{ num: "96%", label: "告警打开率" }, { num: "184 分钟", label: "响应时间" }, { num: "+互动", label: "按钮直接派单" }]
  },
  pricing: { model: "按发送量计费", price: "0.005", unit: "元/条", note: "应用消息按平台授权费另计" },
  specs: [{ k: "支持平台", v: "钉钉/企微/飞书" }, { k: "消息类型", v: "文本/Markdown/卡片/图片" }, { k: "送达率", v: "99.5%+" }],
  changelog: [
    { version: "v3.3", date: "2026-06-19", content: "卡片消息支持交互按钮；消息模板管理；重试机制优化。" },
    { version: "v3.0", date: "2026-04-05", content: "三大平台统一接口；@人 与回执确认。" }
  ]
},

/* ============== 报表看板（report）============== */
"kpi-calc": {
  name: "指标计算",
  icon: "",
  category: "报表看板",
  categoryKey: "report",
  status: "live",
  version: "v2.7",
  updatedAt: "2026-06-11",
  provider: "思为交互数据团队",
  protocol: "Analytics Skill API",
  tags: ["OEE", "良率", "能耗强度", "KPI"],
  oneLine: "OEE、良率、能耗强度、库存周转——把行业标准 KPI 的计算口径封装为可复用算子，避免每个项目重复造轮子。",
  overview: "每个工厂都在算 OEE、良率、能耗强度，但口径常常各不相同——同一个 OEE，在不同车间算出来差异巨大，根本无法横向对标。这个 Skill 把行业标准 KPI 的计算口径（ISO 标准 + 行业最佳实践）封装为可复用算子，定义一次，处处一致，让 KPI 真正可比、可信、可对标。",
  capability: "内置 40+ 工业 KPI 算子：OEE（含可用率/性能/质量分解）、良率、一次合格率、能耗强度、单位成本、库存周转、准交率、人均产值等。每个算子口径可配置但默认遵循 ISO 22400 标准。支持实时流式计算与批量计算。结果带计算明细，可下钻核查。",
  params: [
    { name: "kpi", type: "string", req: true, desc: "KPI 标识：oee/yield/energy_intensity/ondelivery 等" },
    { name: "scope", type: "Scope", req: true, desc: "计算范围（设备/产线/车间/工厂 + 时间窗口）" },
    { name: "data", type: "TimeSeries", req: true, desc: "原始指标数据（停机/节拍/产量/缺陷等）" },
    { name: "breakdown", type: "boolean", req: false, desc: "是否返回分解明细，默认 false", def: "false" }
  ],
  input: ["原始指标数据（停机、节拍、产量、缺陷、能耗）", "计算范围与时间窗口"],
  output: ["KPI 计算结果", "分解明细（如 OEE 的可用率/性能/质量）", "计算口径说明"],
  code: `// 计算注塑车间 1 号线 6 月 OEE
const oee = await galileo.skill("kpi-calc").invoke({
  kpi: "oee",
  scope: { line: "injection-line-1", period: "2026-06" },
  data: juneProductionData,
  breakdown: true
});
// oee: { value: 0.78, availability: 0.92, performance: 0.88, quality: 0.96 }`,
  compose: {
    upstream: [{ icon: "", name: "数据清洗", role: "原始数据清洗" }, { icon: "", name: "主题域建模", role: "统一数据口径" }],
    downstream: [{ icon: "", name: "BI 报表", role: "KPI 可视化" }, { icon: "", name: "实时大屏", role: "KPI 大屏展示" }, { icon: "", name: "经营分析", role: "KPI 归因" }]
  },
  case: {
    title: "某集团 OEE 口径统一",
    desc: "客户 6 个工厂 OEE 口径各异，集团无法对标。统一使用指标计算 Skill 后，首次实现跨工厂 OEE 横向对比，发现 2 个工厂潜力巨大，针对性提升后整体 OEE 提升 8 个百分点。",
    metrics: [{ num: "+8pp", label: "整体 OEE 提升" }, { num: "40+", label: "标准 KPI 算子" }, { num: "100%", label: "口径一致" }]
  },
  pricing: { model: "按计算次数计费", price: "0.01", unit: "元/次计算", note: "批量计算按 KPI 数 × 周期计费" },
  specs: [{ k: "内置 KPI", v: "40+ 工业标准" }, { k: "遵循标准", v: "ISO 22400" }, { k: "计算延迟", v: "实时 < 1s" }],
  changelog: [
    { version: "v2.7", date: "2026-06-11", content: "新增能耗强度 KPI；实时流式计算；口径可配置。" },
    { version: "v2.5", date: "2026-03-30", content: "KPI 算子扩充至 40+；分解明细输出。" }
  ]
},

"bi-report": {
  name: "BI 报表",
  icon: "",
  category: "报表看板",
  categoryKey: "report",
  status: "live",
  version: "v3.1",
  updatedAt: "2026-06-21",
  provider: "思为交互数据团队",
  protocol: "Analytics Skill API",
  tags: ["BI", "自助分析", "多维报表", "下钻联动"],
  oneLine: "把数据主题域渲染为多维报表，支持下钻、联动、定时推送、权限过滤，业务人员自助拖拽即可生成。",
  overview: "传统 BI 报表开发周期长，业务人员每次要报表都依赖 IT 排期。这个 Skill 基于语义层（主题域模型）提供自助式 BI 能力，业务人员拖拽维度和度量即可生成报表，支持下钻、联动、筛选，让数据分析从「IT 驱动」变成「业务自助」。",
  capability: "基于主题域语义层自动生成可拖拽的多维分析工作台。支持图表：表格、柱图、折线、饼图、漏斗、桑基图、地图、组合图。交互：下钻、上卷、联动、切片、筛选、时间对比。报表可定时邮件/IM 推送，可导出 Excel/PDF/图片。支持行级权限控制。",
  params: [
    { name: "dataSource", type: "string", req: true, desc: "语义层/主题域标识" },
    { name: "dimensions", type: "array<string>", req: true, desc: "分析维度（如 时间/产线/产品）" },
    { name: "measures", type: "array<Measure>", req: true, desc: "度量（KPI + 聚合方式）" },
    { name: "chartType", type: "enum", req: false, desc: "图表类型，默认 table", def: "table", enum: ["table", "bar", "line", "pie", "funnel", "combo"] },
    { name: "filters", type: "array<Filter>", req: false, desc: "筛选条件" }
  ],
  input: ["语义层/主题域", "维度与度量配置"],
  output: ["交互式报表", "图表渲染数据", "导出文件（Excel/PDF）"],
  code: `// 生成各产线 6 月 OEE 对比报表
const report = await galileo.skill("bi-report").invoke({
  dataSource: "production_domain",
  dimensions: ["line"],
  measures: [{ kpi: "oee", agg: "avg" }],
  chartType: "bar",
  filters: [{ field: "month", op: "=", value: "2026-06" }]
});`,
  compose: {
    upstream: [{ icon: "", name: "主题域建模", role: "提供语义层" }, { icon: "", name: "指标计算", role: "KPI 数据源" }],
    downstream: []
  },
  case: {
    title: "某装备制造商报表自助化",
    desc: "客户原报表全靠 IT 写 SQL 开发，平均交付 2 周，IT 积压 80+ 报表需求。上线 BI 报表 Skill 后，业务人员自助生成，IT 仅维护语义层，报表需求积压清零。",
    metrics: [{ num: "2 周自助", label: "报表交付" }, { num: "0", label: "IT 需求积压" }, { num: "+15 种", label: "图表类型" }]
  },
  pricing: { model: "按用户数计费", price: "100", unit: "元/用户/月", note: "查看免费，编辑按用户收费" },
  specs: [{ k: "图表类型", v: "15+" }, { k: "数据规模", v: "亿行（列式存储）" }, { k: "权限", v: "行级控制" }],
  changelog: [
    { version: "v3.1", date: "2026-06-21", content: "新增桑基图与地图；时间对比分析；行级权限。" },
    { version: "v3.0", date: "2026-04-15", content: "重构为基于语义层；自助拖拽分析。" }
  ]
},

"realtime-dashboard": {
  name: "实时大屏",
  icon: "",
  category: "报表看板",
  categoryKey: "report",
  status: "live",
  version: "v2.5",
  updatedAt: "2026-06-13",
  provider: "思为交互数据团队",
  protocol: "Analytics Skill API",
  tags: ["指挥中心", "领导驾驶舱", "实时刷新", "多屏拼接"],
  oneLine: "面向车间指挥中心、领导驾驶舱的实时大屏组件，秒级刷新，支持多屏拼接与告警闪烁联动。",
  overview: "实时大屏是车间指挥中心和领导驾驶舱的核心——它要把关键指标、设备状态、告警事件以直观的方式秒级呈现。这个 Skill 提供工业大屏的可视化组件库与编排能力，支持多屏拼接、告警闪烁联动、参观展示模式，让指挥中心真正「看得清、反应快」。",
  capability: "内置 20+ 工业大屏组件：实时指标卡、设备状态地图、3D 厂区漫游、告警滚动条、趋势曲线、产能进度条、排行榜。支持多屏拼接布局、秒级数据刷新、告警闪烁与声音联动。提供「日常模式」与「参观模式」两套主题，参观模式视觉效果更炫。",
  params: [
    { name: "layout", type: "Layout", req: true, desc: "大屏布局（网格 + 组件配置）" },
    { name: "dataBindings", type: "object", req: true, desc: "组件与数据源的绑定关系" },
    { name: "refreshRate", type: "number", req: false, desc: "刷新频率（秒），默认 1", def: "1" },
    { name: "theme", type: "enum", req: false, desc: "主题：daily/showcase，默认 daily", def: "daily", enum: ["daily", "showcase"] }
  ],
  input: ["大屏布局配置", "实时数据源"],
  output: ["实时渲染的大屏画面", "告警联动事件"],
  code: `// 配置车间指挥中心大屏
const dashboard = await galileo.skill("realtime-dashboard").deploy({
  layout: { screens: 4, grid: "3x3" },
  dataBindings: {
    "kpi-card-1": { source: "kpi-calc", params: { kpi: "oee" }},
    "device-map": { source: "plc-readwrite", params: { poll: "all" }},
    "alert-bar":  { source: "anomaly-detection" }
  },
  refreshRate: 1,
  theme: "showcase"
});`,
  compose: {
    upstream: [{ icon: "", name: "指标计算", role: "KPI 数据" }, { icon: "", name: "PLC 读写", role: "设备状态" }, { icon: "", name: "异常检测", role: "告警源" }],
    downstream: []
  },
  case: {
    title: "某铝业智能指挥中心",
    desc: "客户原指挥中心靠多块独立屏幕拼凑，信息割裂。部署实时大屏后，8 块屏统一呈现 200 台设备状态、关键 KPI、实时告警，调度效率提升 40%，参观接待效果大幅提升。",
    metrics: [{ num: "8 块屏", label: "统一呈现" }, { num: "+40%", label: "调度效率" }, { num: "1 秒", label: "刷新延迟" }]
  },
  pricing: { model: "按大屏授权计费", price: "5000", unit: "元/大屏/月", note: "包含组件库与渲染服务" },
  specs: [{ k: "组件数", v: "20+" }, { k: "刷新延迟", v: "< 1 秒" }, { k: "多屏支持", v: "可拼接" }],
  changelog: [
    { version: "v2.5", date: "2026-06-13", content: "新增 3D 厂区漫游；参观模式；告警声音联动。" },
    { version: "v2.0", date: "2026-03-12", content: "多屏拼接；组件库扩充至 20+。" }
  ]
},

"business-analysis": {
  name: "经营分析",
  icon: "",
  category: "报表看板",
  categoryKey: "report",
  status: "beta",
  version: "v1.3",
  updatedAt: "2026-06-06",
  provider: "思为交互数据团队",
  protocol: "Analytics Skill API",
  tags: ["经营报告", "归因分析", "管理层决策", "业财融合"],
  oneLine: "把财务、销售、生产、能耗数据融合，自动产出经营分析报告与归因解读，辅助管理层决策。",
  overview: "管理层的痛点不是没数据，而是数据散落在财务、销售、生产、能耗各个系统里，没有人把这些数据串起来讲清楚「这个月到底发生了什么、为什么、怎么办」。这个 Skill 自动融合多域数据，生成带归因解读的经营分析报告，让管理层从「看数据」升级到「懂经营」。",
  capability: "融合财务（收入/成本/利润）、销售（订单/交付）、生产（产量/OEE/良率）、能耗（单耗/成本）多域数据。自动生成经营分析报告：本期概览、同比环比、归因分析（哪些因素驱动了变化）、异常预警、建议行动。报告可月度/周度自动产出，支持自然语言提问式分析。",
  params: [
    { name: "period", type: "string", req: true, desc: "分析周期，如 '2026-06'" },
    { name: "domains", type: "array<string>", req: false, desc: "融合域：finance/sales/production/energy，默认全部", def: "all" },
    { name: "format", type: "enum", req: false, desc: "输出格式：report/brief/q&a，默认 report", def: "report", enum: ["report", "brief", "qa"] }
  ],
  input: ["多域经营数据（财务/销售/生产/能耗）", "分析周期"],
  output: ["经营分析报告（含归因解读）", "关键变化与异常预警", "建议行动清单"],
  code: `// 生成 6 月经营分析报告
const report = await galileo.skill("business-analysis").invoke({
  period: "2026-06",
  domains: ["finance", "sales", "production", "energy"],
  format: "report"
});
// 输出：Markdown 报告，含归因「利润下降主因：能耗成本上升 12%，
//       其中窑炉煤耗超标，建议参考能耗优化 Skill」`,
  compose: {
    upstream: [{ icon: "", name: "主题域建模", role: "多域数据基础" }, { icon: "", name: "指标计算", role: "KPI 输入" }, { icon: "", name: "预测模型", role: "趋势预测" }],
    downstream: [{ icon: "", name: "BI 报表", role: "报告附图表" }, { icon: "", name: "IM 通知", role: "报告推送管理层" }]
  },
  case: {
    title: "某水泥厂月度经营会革命",
    desc: "客户月度经营会原靠财务手工汇总 3 天，且只有数字没有归因。使用经营分析 Skill 后，报告自动产出含归因解读，经营会从「念数字」变成「讨论行动方案」，决策质量显著提升。",
    metrics: [{ num: "3 天自动", label: "报告生成" }, { num: "+归因", label: "从数字到原因" }, { num: "自然语言", label: "提问式分析" }]
  },
  pricing: { model: "内测邀约制", price: "—", unit: "", note: "当前对受邀客户开放，联系商务咨询" },
  specs: [{ k: "融合域", v: "财务/销售/生产/能耗" }, { k: "归因算法", v: "Shapley + 规则" }, { k: "输出格式", v: "报告/简报/问答" }],
  changelog: [
    { version: "v1.3", date: "2026-06-06", content: "新增自然语言提问式分析；归因算法升级。" },
    { version: "v1.0", date: "2026-04-28", content: "首发版本，多域融合 + 自动报告生成。" }
  ]
}

};
