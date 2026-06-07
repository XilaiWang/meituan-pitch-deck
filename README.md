# 明信片 · 美团 2026 AI 黑客松 · 路演 deck

给异地子女的 AI 生活翻译器。这套路演材料配合**现场真机 live demo** 使用，截图作 demo 导引与投影兜底。

## 怎么放映

**主放映（推荐）：动画 HTML deck**

```
open index.html        # 双击或用 Chrome 打开
```

- `→` / `空格` 前进，`←` 后退，`F` 全屏，`1-9 / 0` 跳页，`Home/End` 首尾页
- 也可以点击屏幕右半边前进、左半边后退
- 16:9 自适应窗口，全程 GSAP 动画；尊重系统「减弱动态效果」设置

**兜底 / 提交：**

- `明信片-路演.pptx` —— WPS / PowerPoint / Keynote 可直接打开编辑，整页满图 16:9，每页带演讲者备注
- `明信片-路演.pdf` —— 投影仪 / 无网络环境兜底
- `路演讲稿.md` —— 19 页逐页口播讲稿 + 评委 Q&A 速答

## 叙事顺序（19 页）

1 封面 · 2 问题（三难）· 3 市场（3.2 亿 / 23%，2025 国家统计局）· 4 答案（感知→托管→履约闭环）· 5 入口（小团）·
6 信任地基（评估师建档）· 7 看见（两张明信片）· 8 洞察（还能吃 4 天）· 9 调度（诚实度证明）·
10 闭环（你帮了她）· 11 回扣（双端联动，情感高潮）· 12 双向（适老化 + 反向通道）·
13 技术架构 · 14 商业模式（订阅分层 99/299/699/1299 元/月）· 15 成本对比（明信片 vs 保姆）·
16 谁需要明信片（目标人群）· 17 财务测算（三年模型 ~36 亿）· 18 伦理三红线 + 证据链 · 19 收尾画面

> 命名：「明信片」为主 + 「美团 AI 居家养老管家」作品类描述。定价采用分层月费（与队友商业计划书一致，真机 demo 已同步为「关怀版 ¥299/月」）。市场/财务数据吸收并核实自队友《美团 AI 养老管家商业计划书》。

## 目录

```
index.html              主 deck（自包含 + GSAP）
明信片-路演.pptx         可编辑 PPT
明信片-路演.pdf          投影 PDF
路演讲稿.md              讲稿 + Q&A
assets/shots/           19 张真实产品截图（设备框）
assets/render/          16 页渲染图（PPTX/PDF 素材）
assets/vendor/gsap.min.js  本地内置 GSAP（离线可放映）
capture.mjs             截图采集脚本（Playwright 驱动 demo-ui）
render.mjs              把 deck 每页渲染成 PNG
build_exports.py        渲染图 → PPTX + PDF + 讲稿
```

## 重新生成（产品 UI 改了之后）

```
# 1) 起后端 + 前端（在 ~/Desktop/meituan-life-postcard-agent）
node scripts/mock-api-server.mjs        # :3001
cd apps/demo-ui && npm run dev          # :5173

# 2) 重新采集截图 → 渲染 → 导出
cd ~/Desktop/meituan-pitch-deck
node capture.mjs && node render.mjs && python3 build_exports.py
```

## 数据诚实声明

- 市场数据来自国家统计局 · 民政部《2024 年度国家老龄事业发展公报》、国家卫健委口径及公开行业报告，deck 内已标注来源。
- 产品内：生活事件为本地样例，附近药店当前为「降级样例」（real_api 尚未接入），下单为「模拟交易」，不产生真实订单 / 支付 / 履约。
