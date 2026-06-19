// 生成记账本小程序介绍 PPT
const pptxgen = require("pptxgenjs");
const pptx = new pptxgen();

// ===== 全局设置 =====
pptx.layout = "LAYOUT_WIDE";
pptx.author = "zeqi";
pptx.title = "微信记账本小程序";

// ===== 配色方案 =====
const GREEN = "4CAF50";
const DARK_GREEN = "2E7D32";
const RED = "F44336";
const DARK = "333333";
const GRAY = "999999";
const LIGHT_BG = "F5F5F5";
const WHITE = "FFFFFF";
const LIGHT_GREEN_BG = "E8F5E9";

// ===== 通用样式 =====
const TITLE_OPTS = { fontSize: 36, color: DARK, bold: true, fontFace: "Microsoft YaHei" };
const BODY_OPTS = { fontSize: 16, color: DARK, fontFace: "Microsoft YaHei" };
const SMALL_OPTS = { fontSize: 13, color: GRAY, fontFace: "Microsoft YaHei" };

// ====== Slide 1: 封面 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: DARK_GREEN };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: GREEN } });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: "93%", w: "100%", h: 0.08, fill: { color: GREEN } });
  slide.addText("💰", { x: 0, y: 1.2, w: "100%", h: 1.5, fontSize: 72, align: "center", color: WHITE });
  slide.addText("微信记账本小程序", {
    x: 0.5, y: 2.6, w: "100%", h: 1.0, fontSize: 48, bold: true, color: WHITE, align: "center", fontFace: "Microsoft YaHei"
  });
  slide.addText("个人记账 · 本地存储 · 极简设计", {
    x: 0.5, y: 3.5, w: "100%", h: 0.6, fontSize: 20, color: "C8E6C9", align: "center", fontFace: "Microsoft YaHei"
  });
  slide.addText("2026年6月  |  zeqi", {
    x: 0.5, y: 4.8, w: "100%", h: 0.5, fontSize: 14, color: "A5D6A7", align: "center", fontFace: "Microsoft YaHei"
  });
}

// ====== Slide 2: 项目概览 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: WHITE };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } });
  slide.addText("项目概览", { x: 0.6, y: 0.3, w: 8, h: 0.7, ...TITLE_OPTS });

  const cards = [
    { x: 0.6, y: 1.4, title: "📱 平台", desc: "微信小程序\n原生框架开发\n无需下载安装" },
    { x: 4.3, y: 1.4, title: "💾 存储", desc: "本地存储\nwx.setStorageSync\n离线可用，秒级响应" },
    { x: 8.0, y: 1.4, title: "🎯 用户", desc: "个人及家庭\n日常记账使用\n简单易上手" },
    { x: 0.6, y: 3.8, title: "🛠️ 技术", desc: "JavaScript + WXML + WXSS\n无第三方依赖\n纯原生组件" }
  ];

  cards.forEach(c => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: c.y, w: 3.3, h: 2.0, fill: { color: LIGHT_GREEN_BG }, rectRadius: 0.15
    });
    slide.addText(c.title, { x: c.x + 0.2, y: c.y + 0.15, w: 2.9, h: 0.5, fontSize: 20, bold: true, color: DARK_GREEN, fontFace: "Microsoft YaHei" });
    slide.addText(c.desc, { x: c.x + 0.2, y: c.y + 0.7, w: 2.9, h: 1.1, fontSize: 15, color: DARK, fontFace: "Microsoft YaHei" });
  });
}

// ====== Slide 3: 页面架构 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: WHITE };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } });
  slide.addText("页面架构", { x: 0.6, y: 0.3, w: 8, h: 0.7, ...TITLE_OPTS });

  const pages = [
    { x: 0.6, y: 1.5, emoji: "🏠", name: "首页", desc: "月份切换\n收支汇总\n分类排行\n最近记录", color: GREEN },
    { x: 4.3, y: 1.5, emoji: "➕", name: "记账页", desc: "收支切换\n金额输入\n分类选择\n日期备注", color: "FF9800" },
    { x: 8.0, y: 1.5, emoji: "📋", name: "账单列表", desc: "月份筛选\n日期分组\n收支明细\n长按删除", color: "2196F3" }
  ];

  pages.forEach(p => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: p.y, w: 3.3, h: 3.0, fill: { color: LIGHT_BG }, rectRadius: 0.15,
      line: { color: p.color, width: 1.5 }
    });
    slide.addText(p.emoji, { x: p.x, y: p.y + 0.1, w: 3.3, h: 0.8, fontSize: 44, align: "center" });
    slide.addText(p.name, { x: p.x + 0.3, y: p.y + 0.9, w: 2.7, h: 0.4, fontSize: 22, bold: true, color: p.color, align: "center", fontFace: "Microsoft YaHei" });
    slide.addText(p.desc, { x: p.x + 0.3, y: p.y + 1.4, w: 2.7, h: 1.4, fontSize: 14, color: "666666", align: "center", fontFace: "Microsoft YaHei" });
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.5, y: 5.1, w: 9.5, h: 0.7, fill: { color: DARK }, rectRadius: 0.1
  });
  slide.addText("🏠 首页       ➕ 记账       📋 账单", {
    x: 1.5, y: 5.1, w: 9.5, h: 0.7, fontSize: 16, color: WHITE, align: "center", fontFace: "Microsoft YaHei"
  });
  slide.addText("▲ 自定义底部导航栏（三页面切换）", {
    x: 1.5, y: 5.85, w: 9.5, h: 0.4, fontSize: 13, color: GRAY, align: "center", fontFace: "Microsoft YaHei"
  });
}

// ====== Slide 4: 首页功能 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: WHITE };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } });
  slide.addText("首页 — 月份切换 + 收支汇总", { x: 0.6, y: 0.3, w: 11, h: 0.7, ...TITLE_OPTS });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.4, w: 6.0, h: 0.9, fill: { color: WHITE },
    line: { color: "DDDDDD", width: 1 }, rectRadius: 0.1
  });
  slide.addText("◀    2026年6月    ▶", {
    x: 0.6, y: 1.4, w: 6.0, h: 0.9, fontSize: 22, bold: true, color: DARK, align: "center", fontFace: "Microsoft YaHei"
  });
  slide.addText("支持翻看任意历史月份，不能翻到未来", {
    x: 0.6, y: 2.35, w: 6.0, h: 0.35, fontSize: 13, color: GRAY, align: "center", fontFace: "Microsoft YaHei"
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 3.0, w: 6.0, h: 1.4, fill: { color: GREEN }, rectRadius: 0.15
  });
  slide.addText("收入 +3,500    支出 -2,180    结余 +1,320", {
    x: 0.6, y: 3.0, w: 6.0, h: 1.4, fontSize: 16, color: WHITE, align: "center", fontFace: "Microsoft YaHei"
  });
  slide.addText("本月收支实时汇总，收入/支出/结余一目了然", {
    x: 0.6, y: 4.45, w: 6.0, h: 0.35, fontSize: 13, color: GRAY, align: "center", fontFace: "Microsoft YaHei"
  });

  const features = [
    "✅ 顶部左右箭头切换月份",
    "✅ 绿色卡片显示收入/支出/结余",
    "✅ 自动计算，无需手动统计",
    "✅ 默认显示当前月份",
    "✅ 未来月份不可翻（灰色箭头）"
  ];
  slide.addText(features.join("\n"), {
    x: 7.2, y: 1.4, w: 5.0, h: 3.4, fontSize: 15, color: "444444", fontFace: "Microsoft YaHei", lineSpacing: 28
  });
}

// ====== Slide 5: 分类支出排行 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: WHITE };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } });
  slide.addText("首页 — 分类支出排行", { x: 0.6, y: 0.3, w: 11, h: 0.7, ...TITLE_OPTS });

  const cats = [
    { name: "🍽️ 餐饮", pct: 42, amt: "¥ 915" },
    { name: "🚗 交通", pct: 25, amt: "¥ 545" },
    { name: "🛍️ 购物", pct: 18, amt: "¥ 392" },
    { name: "🎮 娱乐", pct: 10, amt: "¥ 218" },
    { name: "🏠 居家", pct: 5, amt: "¥ 110" }
  ];

  cats.forEach((cat, i) => {
    const y = 1.3 + i * 0.85;
    slide.addText(cat.name, { x: 0.6, y: y, w: 2.0, h: 0.4, fontSize: 15, bold: true, color: DARK, fontFace: "Microsoft YaHei" });
    slide.addText(cat.amt, { x: 2.6, y: y, w: 1.2, h: 0.4, fontSize: 14, color: DARK, fontFace: "Microsoft YaHei" });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 3.9, y: y + 0.05, w: 4.8, h: 0.3, fill: { color: "F0F0F0" }, rectRadius: 0.05
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 3.9, y: y + 0.05, w: 4.8 * cat.pct / 100, h: 0.3,
      fill: { color: RED }, rectRadius: 0.05
    });
    slide.addText(cat.pct + "%", { x: 8.8, y: y, w: 1.0, h: 0.4, fontSize: 14, color: GRAY, fontFace: "Microsoft YaHei" });
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 5.6, w: 9.2, h: 0.7, fill: { color: LIGHT_GREEN_BG }, rectRadius: 0.1
  });
  slide.addText("💡 当月每个分类自动汇总金额和占比，进度条一目了然，花钱最多的分类排在前面", {
    x: 0.8, y: 5.6, w: 8.8, h: 0.7, fontSize: 14, color: DARK_GREEN, fontFace: "Microsoft YaHei"
  });
}

// ====== Slide 6: 记账流程 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: WHITE };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } });
  slide.addText("记账页 — 添加流程", { x: 0.6, y: 0.3, w: 11, h: 0.7, ...TITLE_OPTS });

  const steps = [
    { x: 0.5, emoji: "1️⃣", title: "选类型", desc: "支出 / 收入\n一键切换" },
    { x: 2.8, emoji: "2️⃣", title: "输金额", desc: "数字键盘\n¥ 自动补全" },
    { x: 5.1, emoji: "3️⃣", title: "选分类", desc: "八种分类\n图标网格" },
    { x: 7.4, emoji: "4️⃣", title: "填信息", desc: "备注+日期\n可选填" },
    { x: 9.7, emoji: "✅", title: "保存", desc: "表单验证\n自动返回" }
  ];

  steps.forEach(s => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: s.x, y: 1.5, w: 2.0, h: 2.8, fill: { color: LIGHT_GREEN_BG }, rectRadius: 0.15,
      line: { color: GREEN, width: 1 }
    });
    slide.addText(s.emoji, { x: s.x, y: 1.6, w: 2.0, h: 0.7, fontSize: 32, align: "center" });
    slide.addText(s.title, { x: s.x + 0.1, y: 2.3, w: 1.8, h: 0.4, fontSize: 17, bold: true, color: DARK_GREEN, align: "center", fontFace: "Microsoft YaHei" });
    slide.addText(s.desc, { x: s.x + 0.1, y: 2.8, w: 1.8, h: 0.8, fontSize: 13, color: "555555", align: "center", fontFace: "Microsoft YaHei" });
    if (s.x < 9) {
      slide.addText("→", { x: s.x + 2.1, y: 2.4, w: 0.5, h: 0.5, fontSize: 24, color: GREEN, align: "center" });
    }
  });

  slide.addText("表单验证：金额必须 > 0 且为有效数字，必须选择分类，否则提示错误", {
    x: 0.6, y: 4.8, w: 11, h: 0.5, fontSize: 14, color: GRAY, fontFace: "Microsoft YaHei"
  });

  slide.addText("内置分类", { x: 0.6, y: 5.4, w: 3, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: "Microsoft YaHei" });
  slide.addText("支出：🍽️餐饮 🚗交通 🛍️购物 🎮娱乐 🏠居家 💊医疗 📚教育 💸其他", {
    x: 0.6, y: 5.8, w: 11, h: 0.4, fontSize: 13, color: "555555", fontFace: "Microsoft YaHei"
  });
  slide.addText("收入：💰工资 🎁奖金 💼兼职 📈理财 ↩️退款 📥其他", {
    x: 0.6, y: 6.2, w: 11, h: 0.4, fontSize: 13, color: "555555", fontFace: "Microsoft YaHei"
  });
}

// ====== Slide 7: 账单列表 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: WHITE };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } });
  slide.addText("账单列表 — 按月筛选 + 日期分组", { x: 0.6, y: 0.3, w: 11, h: 0.7, ...TITLE_OPTS });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.3, w: 5.5, h: 0.7, fill: { color: WHITE },
    line: { color: "DDDDDD", width: 1 }, rectRadius: 0.1
  });
  slide.addText("◀ 2026年6月 ▶    收 3,500 | 支 2,180", {
    x: 0.6, y: 1.3, w: 5.5, h: 0.7, fontSize: 14, color: DARK, align: "center", fontFace: "Microsoft YaHei"
  });

  // 模拟日期分组
  const groups = [
    { date: "2026-06-19", summary: "收入 0 | 支出 -80", items: [
      { emoji: "🍽️", cat: "餐饮", amt: "-50" },
      { emoji: "🚗", cat: "交通", amt: "-30" }
    ]},
    { date: "2026-06-18", summary: "收入 +3,500 | 支出 0", items: [
      { emoji: "💰", cat: "工资", amt: "+3,500" }
    ]}
  ];

  let dy = 2.4;
  groups.forEach(group => {
    slide.addText(group.date + "    " + group.summary, {
      x: 0.8, y: dy, w: 5.5, h: 0.35, fontSize: 12, bold: true, color: DARK, fontFace: "Microsoft YaHei"
    });
    dy += 0.4;
    group.items.forEach(item => {
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8, y: dy, w: 5.3, h: 0.5, fill: { color: WHITE },
        line: { color: "EEEEEE", width: 0.5 }, rectRadius: 0.05
      });
      slide.addText(item.emoji + "  " + item.cat, {
        x: 1.0, y: dy, w: 2.5, h: 0.5, fontSize: 13, color: DARK, fontFace: "Microsoft YaHei"
      });
      slide.addText(item.amt, {
        x: 3.5, y: dy, w: 2.5, h: 0.5, fontSize: 14, bold: true,
        color: item.amt.startsWith("-") ? RED : GREEN, align: "right", fontFace: "Microsoft YaHei"
      });
      dy += 0.6;
    });
    dy += 0.15;
  });

  const features = [
    "✅ 按月份筛选，默认当月",
    "✅ 按日期分组显示",
    "✅ 每日收入/支出小计",
    "✅ 收入绿色，支出红色",
    "✅ 长按记录弹出删除确认",
    "✅ 删除后即时刷新列表"
  ];
  slide.addText(features.join("\n"), {
    x: 7.2, y: 1.3, w: 5.0, h: 4.0, fontSize: 15, color: "444444", fontFace: "Microsoft YaHei", lineSpacing: 26
  });

  slide.addText("💡 长按任意记录可删除，删除前弹窗确认防止误操作", {
    x: 0.6, y: 5.8, w: 11, h: 0.5, fontSize: 13, color: GRAY, fontFace: "Microsoft YaHei"
  });
}

// ====== Slide 8: 数据存储架构 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: WHITE };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } });
  slide.addText("数据存储架构", { x: 0.6, y: 0.3, w: 11, h: 0.7, ...TITLE_OPTS });

  // 架构图：三层
  const layers = [
    { y: 1.5, label: "pages/*  页面层", desc: "首页 · 记账 · 账单列表", emoji: "📄" },
    { y: 2.8, label: "utils/storage.js  数据层", desc: "增删改查 · 按月筛选 · 分类统计", emoji: "🗄️" },
    { y: 4.1, label: "wx.setStorageSync()  存储层", desc: "微信原生本地存储 API · 沙箱隔离", emoji: "💾" }
  ];

  layers.forEach(l => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: l.y, w: 5.5, h: 1.0, fill: { color: WHITE },
      line: { color: GREEN, width: 1.5 }, rectRadius: 0.1
    });
    slide.addText(l.emoji + "  " + l.label, { x: 1.0, y: l.y + 0.1, w: 5.0, h: 0.4, fontSize: 15, bold: true, color: DARK_GREEN, fontFace: "Microsoft YaHei" });
    slide.addText(l.desc, { x: 1.0, y: l.y + 0.5, w: 5.0, h: 0.35, fontSize: 12, color: GRAY, fontFace: "Microsoft YaHei" });
    // 箭头（除最后一层）
    if (l.y < 4) {
      slide.addText("▼", { x: 2.8, y: l.y + 1.05, w: 1, h: 0.4, fontSize: 18, color: GREEN, align: "center" });
    }
  });

  // 右侧数据结构
  slide.addText("数据结构", { x: 7.2, y: 1.5, w: 5, h: 0.5, fontSize: 18, bold: true, color: DARK, fontFace: "Microsoft YaHei" });

  const jsonStr = [
    "{",
    "  id: \"bill_xxx_xxx\",",
    "  type: \"expense\",",
    "  amount: 50.00,",
    "  category: \"餐饮\",",
    "  note: \"午饭\",",
    "  date: \"2026-06-19\",",
    "  createTime: \"2026-06-19T10:30:00Z\"",
    "}"
  ].join("\n");

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 7.2, y: 2.1, w: 5.0, h: 3.2, fill: { color: "263238" }, rectRadius: 0.1
  });
  slide.addText(jsonStr, {
    x: 7.4, y: 2.2, w: 4.6, h: 3.0, fontSize: 13, color: "A5D6A7", fontFace: "Consolas", lineSpacing: 18
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 5.7, w: 11.5, h: 0.8, fill: { color: LIGHT_GREEN_BG }, rectRadius: 0.1
  });
  slide.addText("💡 所有数据存在手机微信沙箱内，不经过服务器，单小程序上限10MB，记账数据足够使用数百万条", {
    x: 0.8, y: 5.75, w: 11, h: 0.7, fontSize: 14, color: DARK_GREEN, fontFace: "Microsoft YaHei"
  });
}

// ====== Slide 9: 技术栈 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: WHITE };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: GREEN } });
  slide.addText("技术栈 & 项目信息", { x: 0.6, y: 0.3, w: 11, h: 0.7, ...TITLE_OPTS });

  const techs = [
    ["框架", "微信小程序原生框架"],
    ["语言", "JavaScript · WXML · WXSS"],
    ["存储", "wx.Storage（本地键值对）"],
    ["工具", "微信开发者工具"],
    ["版本管理", "Git"],
    ["依赖", "零第三方库"],
    ["代码量", "~1700 行"],
    ["页面数", "3 页面 + 工具模块"]
  ];

  techs.forEach((row, i) => {
    const y = 1.4 + i * 0.55;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.6, y: y, w: 2.2, h: 0.45, fill: { color: GREEN }, rectRadius: 0.05
    });
    slide.addText(row[0], { x: 0.6, y: y, w: 2.2, h: 0.45, fontSize: 14, bold: true, color: WHITE, align: "center", fontFace: "Microsoft YaHei" });
    slide.addText(row[1], { x: 2.9, y: y, w: 4.5, h: 0.45, fontSize: 14, color: DARK, fontFace: "Microsoft YaHei" });
  });

  slide.addText("项目文件结构", { x: 8.0, y: 1.4, w: 4, h: 0.5, fontSize: 16, bold: true, color: DARK, fontFace: "Microsoft YaHei" });
  const fileTree = [
    "📁 new1/",
    "  ├── app.js / .json / .wxss",
    "  ├── utils/storage.js",
    "  ├── pages/",
    "  │   ├── index/    (首页)",
    "  │   ├── add/      (记账)",
    "  │   └── history/  (账单)",
    "  └── project.config.json"
  ].join("\n");

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.0, y: 2.0, w: 4.5, h: 3.5, fill: { color: LIGHT_BG }, rectRadius: 0.1
  });
  slide.addText(fileTree, {
    x: 8.2, y: 2.1, w: 4.1, h: 3.3, fontSize: 13, color: "444444", fontFace: "Consolas", lineSpacing: 17
  });
}

// ====== Slide 10: 结束页 ======
{
  const slide = pptx.addSlide();
  slide.background = { fill: DARK_GREEN };
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: GREEN } });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: "93%", w: "100%", h: 0.08, fill: { color: GREEN } });

  slide.addText("谢谢", {
    x: 0, y: 2.0, w: "100%", h: 1.5, fontSize: 64, bold: true, color: WHITE, align: "center", fontFace: "Microsoft YaHei"
  });
  slide.addText("微信记账本小程序 · 第一版", {
    x: 0, y: 3.6, w: "100%", h: 0.6, fontSize: 20, color: "C8E6C9", align: "center", fontFace: "Microsoft YaHei"
  });
  slide.addText("2026年6月  |  zeqi", {
    x: 0, y: 4.4, w: "100%", h: 0.5, fontSize: 14, color: "A5D6A7", align: "center", fontFace: "Microsoft YaHei"
  });
}

// ====== 生成 ======
pptx.writeFile({ fileName: "D:/new1/记账本小程序介绍.pptx" })
  .then(() => console.log("✅ PPT 已生成：D:/new1/记账本小程序介绍.pptx"))
  .catch(err => console.error("❌ 生成失败：", err));
