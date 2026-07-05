# Galileo OS 官网 · 国际化设计 v2

> 基于《思为交互"工业智能计划"战略方案》与《Galileo OS 开放端 PRD》输出。
> 首页为导航型门面，详细内容下沉到 7 个独立二级详情页。

## 📁 文件结构

```
idmakers-website/
├── index.html          # 首页（导航型门面：定位宣言 + 平台概览卡 + 产品入口 + 关键数字）
├── platform.html       # 二级页：工业操作系统（六大引擎详解）
├── agents.html         # 二级页：Agent 市场（数字化员工详解，18 个 Agent）
├── skills.html         # 二级页：Skill 市场（可组合能力详解，24 个 Skill）
├── solutions.html      # 二级页：解决方案（七大场景方案 + 三种交付路径）
├── industries.html     # 二级页：行业模板（12+ 行业 Know-How，5 个重点行业深度展开）
├── partner-opc.html    # 二级页：OPC 合作模式（四步闭环 + 分润机制 + 老李案例）
├── developers.html     # 二级页：开发者中心（上架分润 + 开放路由）
├── styles.css          # 国际化设计系统（v2，克制风格）
└── README.md           # 本说明
```

## 🚀 本地预览

```bash
cd /Users/leejason/ZCodeProject/idmakers-website

# 方式 1：直接双击 index.html

# 方式 2：命令行
open index.html

# 方式 3：本地服务器（推荐）
python3 -m http.server 8080
# 浏览器访问 http://localhost:8080
```

## 🎨 设计系统 v2（国际化克制风格）

| 维度 | 设计选择 | 参考对标 |
|---|---|---|
| **配色** | 深海军蓝 `#0F1419` + 青绿强调 `#00D9A3`，灰阶层次丰富 | Palantir / Linear |
| **字重** | 标题 600（非 700/800），正文 400，克制专业 | Siemens / Stripe |
| **留白** | 大间距（section 120px），内容呼吸感强 | Apple / Vercel |
| **阴影** | 极度克制，主要靠边框和留白分层 | Notion / Figma |
| **圆角** | 10-20px，精致不夸张 | Linear |
| **响应式** | PC 优先，平板/移动端适配 | — |

## 🗺️ 信息架构（首页 → 二级页）

```
首页 index.html（精炼门面）
  │
  ├─▶ 平台 platform.html       （OS 底座 · 六大引擎）
  ├─▶ Agent 市场 agents.html   （数字化员工 · 18 个 Agent）
  ├─▶ Skill 市场 skills.html   （可组合能力 · 24 个 Skill）
  ├─▶ 解决方案 solutions.html  （七大场景 · 三种交付路径）
  ├─▶ 行业模板 industries.html （12+ 行业 Know-How）
  ├─▶ OPC 生态 partner-opc.html（独立实施专家 · 四步闭环）
  └─▶ 开发者 developers.html   （上架分润 · 开放路由）
```

## 📄 各页内容要点

### 首页 `index.html`（精炼门面）
- 新定位宣言（三大变革）
- 平台三大支柱概览卡（OS + Agent工厂 + OPC）
- 产品导航概览卡（解决方案/Agent/Skill/行业模板）
- 关键数字（3天POC / 30秒造物 / 6个月ROI）
- 差异化对比表（精简版）
- OPC 招募 banner

### `platform.html` — 工业操作系统
- 平台战略克制原则
- **六大引擎详解**（IoT中枢/数据中台/模型编排/AI造物/数字孪生/AIOps）
- 引擎协同闭环
- 数据中台深度
- 部署方式

### `agents.html` — Agent 市场
- 18 个 Agent 完整清单（6 大业务域）
- Agent 工作流（感知→理解→决策→执行→反馈）
- Agent 来源（官方/OPC/开发者）
- 全民造物案例

### `skills.html` — Skill 市场
- 24 个 Skill（6 大类）
- Skill 组合流程
- Skill 详情结构示例
- 开发者上架流程

### `solutions.html` — 解决方案
- 七大核心场景方案（含状态徽章）
- 方案详情结构示例（以生产管理展开）
- 四步打造专属工厂
- 三种交付路径（自造/OPC/官方）

### `industries.html` — 行业模板
- 12+ 行业覆盖
- **5 个重点行业深度展开**（水泥/化工/锂盐/注塑/电子）
- OPC × 行业模板协同（老李案例交叉引用）

### `partner-opc.html` — OPC 合作模式
- OPC 定义（传统困局 vs 解法）
- 谁适合做 OPC（4 类人群）
- **四步闭环战斗流**（喝茶拿单→AI生成→一键发包→经验变现）
- 分润机制（实施费 + 永续资产分润）
- 老李真实案例
- OPC vs 其他角色对比表

### `developers.html` — 开发者中心
- 为什么在 Galileo OS 上架
- 你能上架什么（Skill/Agent/API）
- 上架流程（开发→审核→上架→分润）
- 分润机制
- 大模型与算法结盟

## ✅ 对标 Galileo OS 开放端 PRD

- [x] 平台名称：Galileo OS（思为交互）
- [x] 顶部导航固定：操作系统/Agent/Skill/解决方案/行业模板/OPC/开发者/登录注册
- [x] 顶部导航固定：操作系统/Agent/Skill/解决方案/行业模板/OPC/开发者/登录注册
- [x] 首页：平台能力总览、解决方案、Agent、Skill、行业模板、OPC、生态集成入口
- [x] 解决方案列表/详情字段（痛点/能力/价值/部署/角色/门槛）
- [x] Agent 列表/详情字段（岗位/输入/输出/工作流/依赖/安全边界）
- [x] Skill 列表/详情字段（分类/输入输出/组合/权限）
- [x] 行业模板分类与详情字段
- [x] 状态徽章（可申请/内测中/需邀约/即将开放）

## 🔧 后续可对接

- 各 CTA（`#`）接入真实登录/注册/邀请码流程
- 后台配置的列表数据接入
- 数据埋点（view_home / view_detail / click_use / invite_popup 等）
- 企业微信二维码、客服电话真实信息
- 国际化（i18n）多语言切换
