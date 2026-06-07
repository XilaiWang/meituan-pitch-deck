# 明信片 · 美团 2026 AI 黑客松

> **给异地子女的 AI 居家养老管家** — 把爸妈的日常翻译成温暖的明信片，一键变成真实的关怀。
>
> 🏆 美团 2026 AI 黑客松参赛作品

---

## 📍 项目概览

「明信片」是一个寄生在美团 App 内的 AI 居家养老管家。它帮助**异地子女**做三件事：

| 层 | 做什么 | 一句话 |
|---|---|---|
| 👀 **感知翻译** | AI 读懂爸妈的日常，写成温暖的明信片 | 生活 → 明信片 |
| 🫂 **托管照护** | 主动发现空巢父母的需求，替你操心 | 替你看、替你想 |
| 🚀 **履约闭环** | 美团本地生活网络解决需求，再回你一句"办妥了" | 替你办 + 反馈 |

**一句话：不是监控，不是报警。是一张会替你开口、替你操心、替你办到的明信片。**

---

## ⚡ 评审快速入口

| 你要看什么 | 打开这个 |
|---|---|
| **🎬 路演 Deck（推荐）** | `index.html` — 双击在 Chrome 中打开，19 页全屏动画演示 |
| **📊 可编辑 PPT** | `明信片-路演.pptx` — WPS / PowerPoint / Keynote 均可打开 |
| **📄 PDF 备份** | `明信片-路演.pdf` — 投影仪 / 无网络兜底 |
| **🎤 逐页讲稿** | `路演讲稿.md` — 19 页口播词 + 评委 Q&A 速答 |
| **🖥️ Live Demo 源代码** | → [chrisnch/meituan-life-postcard-agent](https://github.com/chrisnch/meituan-life-postcard-agent) |

> ⚠️ **重要提示：** 本仓库是**路演材料**（deck + 截图 + 脚本）。
> 产品的**真机 UI Demo**（React 前端 + OpenClaw Agent + Mock API）托管在队友仓库：
> **[github.com/chrisnch/meituan-life-postcard-agent](https://github.com/chrisnch/meituan-life-postcard-agent)**

---

## 🎬 如何放映

### 主放映：动画 HTML Deck

```bash
open index.html    # 或用 Chrome / Edge 直接打开
```

**操作：**
- `→` / `空格` — 前进
- `←` — 后退
- `F` — 全屏
- `1–9` / `0` — 跳页
- `Home` / `End` — 首尾页
- 点击屏幕右半边前进、左半边后退

**特性：** 16:9 自适应窗口 · GSAP 动画编排 · CSS iPhone 设备边框 · 尊重系统"减弱动态效果"

---

## 📖 叙事顺序（19 页）

```
S1  封面 · 明信片
S2  问题 · 异地子女的三重困难
S3  市场 · 3.2 亿老年人口，23.0%（国家统计局 2025）
S4  答案 · 感知→托管→履约，三层闭环
S5  入口 · 寄生在美团小团 AI 助手
S6  信任地基 · 评估师上门建档 + 本人签字
S7  看见 · 两张明信片（情感 vs 行动，物理隔离）
S8  洞察 · "还能吃 4 天"是算出来的，不是猜的
S9  调度 · 数据诚实声明（四级标签：mock/fallback/real_api未接入/simulated）
S10 闭环 · 下单→确认→"你帮了她"
S11 回扣 · 双端联动，情感高潮
S12 双向 · 父母端适老化 + 反向提需求
S13 技术架构 · 1 个 OpenClaw Agent + 3 个 Skill
S14 商业模式 · 订阅分层 ¥99/299/699/1299 元/月 + 履约抽佣
S15 成本对比 · 明信片 vs 请保姆（省 80–95%）
S16 谁需要 · 空巢·能自理·但需要被看见
S17 财务测算 · 三年 3→10→30 城，约 36 亿订阅年收入
S18 伦理与边界 · 三条红线 + 服务证据链
S19 收尾 · 妈妈在喝粥，你帮她补了一盒降压药
```

---

## 📁 仓库结构

```
meituan-pitch-deck/
│
├── 🎬 路演交付物（评审直接看这三个）
│   ├── index.html                  19 页自包含动画 Deck（打开即放映）
│   ├── 明信片-路演.pptx            可编辑 PPT（每页含演讲者备注）
│   ├── 明信片-路演.pdf             PDF 投影备份
│   └── 路演讲稿.md                 逐页口播 + 评委 Q&A
│
├── 📸 产品截图
│   └── assets/
│       ├── screens/                15 张纯屏幕截图（供 Deck CSS 边框包裹）
│       └── shots/                  22 张产品 UI 原图（含卡片特写）
│
├── 🛠️ 工程脚本（演示自动化流水线）
│   ├── capture-screens.mjs         从 Demo UI 自动采集截图（Playwright）
│   ├── capture-cards.mjs           采集明信片卡片特写
│   ├── render.mjs                  将 Deck 每页渲染为高分辨率 PNG
│   ├── sweep-live.mjs              19 页排版全量检查（越界/重叠检测）
│   └── build_exports.py            渲染图 → PPTX + PDF + 讲稿
│
└── 📦 依赖
    └── assets/vendor/gsap.min.js   GSAP 动画库（离线可放映）
```

---

## 🖥️ Live Demo 真机演示

路演现场配合**实时可操作的前端 Demo** 进行，Demo 源代码在队友仓库：

👉 **[github.com/chrisnch/meituan-life-postcard-agent](https://github.com/chrisnch/meituan-life-postcard-agent)**

**Demo 技术栈：**
- 前端：React 18 + Vite + GSAP + reactbits
- 后端：OpenClaw Agent + 3 个 Skill（life-postcard / nearby-care / service-booking）
- 模拟：Mock API Server（本地样例 + 降级样例）
- 数据流：生活事件 → Agent 调度 → 明信片生成 → 一键下单 → 双端通知

**本仓库中的截图即来自该 Demo 的真实运行画面。**

---

## 🔧 重新生成（修改 Deck 后）

```bash
# 1) 启动 Demo UI（在队友仓库）
cd meituan-life-postcard-agent
node scripts/mock-api-server.mjs          # :3001
cd apps/demo-ui && npm run dev            # :5173

# 2) 采集截图 → 渲染 Deck → 导出
cd meituan-pitch-deck
node capture-screens.mjs                  # 截取 15 张 UI 状态图
node render.mjs                           # 渲染 19 页 Deck 为 PNG
python3 build_exports.py                  # 生成 PPTX + PDF + 讲稿
```

---

## 📊 数据诚实声明

本项目遵守以下数据原则，Deck 内均已如实标注：

- **市场数据**来源：国家统计局 2025 年人口数据、民政部《2024 年度国家老龄事业发展公报》、国家卫健委口径，已联网核实
- **产品截图内**：生活事件为本地样例（mock_fixture）、附近药店当前为降级样例（fixture_fallback，real_api 尚未接入）、下单为模拟交易（simulated）
- **所有标签大方写在了屏幕上和 trace 面板中**，绝不假装真实数据

---

## 👥 团队 & 分工

| 角色 | 贡献 |
|---|---|
| **产品 & Demo UI** | Chris 团队 — React 前端 + OpenClaw Agent + 商业计划 |
| **路演 Deck & 设计** | Xilai Wang — 19 页动画 Deck + CSS 设计系统 + 截图自动化 + 排版验证 |
| **后端 & Agent** | Mock API Server + 3 个 OpenClaw Skill |

---

*🤖 路演 Deck 由 Claude Code 辅助生成 & 排版验证*
