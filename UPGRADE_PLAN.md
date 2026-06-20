# 工具箱升级 · 整体实施方案

---

## 一、从「记账本」到「工具箱」

```
升级前                          升级后

app.json                        app.json
  记账本 3 页面                   仪表盘（首页）
                                ├── 记账本详情（3 子页面）
                                ├── 总资产详情（新建）
                                ├── 经期详情（新建）
                                └── 步数详情（新建）
```

底部 TabBar 精简为**首页一个入口**，其余从仪表盘卡片进入。

---

## 二、页面路由设计

```
仪表盘 (pages/dashboard/dashboard)
    │
    ├── 点记账卡片 → pages/bookkeeping/index/index  （现有，保持不变）
    │                   ├── 记账页 add
    │                   └── 账单列表 history
    │
    ├── 点资产卡片 → pages/assets/assets           （新建）
    │                   └── 添加/编辑资产
    │
    ├── 点经期卡片 → pages/period/period            （新建）
    │
    ├── 点步数卡片 → pages/steps/steps              （新建）
    │
    └── 点自定义 → pages/settings/settings         （新建，管理卡片槽位）
```

---

## 三、文件结构

```
new1/
├── app.js                            # 全局入口
├── app.json                          # 路由注册（新增 4 页面）
├── app.wxss                          # 全局样式
│
├── pages/
│   ├── dashboard/                    # 🆕 仪表盘首页
│   │   ├── dashboard.wxml            # 时间+天气+2×2卡片
│   │   ├── dashboard.js              # 加载天气、步数、快览数据
│   │   ├── dashboard.wxss            # 网格布局
│   │   └── dashboard.json
│   │
│   ├── bookkeeping/                  # ✅ 记账本（现有，不动）
│   │   ├── index/                    # 汇总页（复用）
│   │   ├── add/                      # 记账页（复用）
│   │   └── history/                  # 账单列表（复用）
│   │
│   ├── assets/                       # 🆕 总资产
│   │   ├── assets.wxml
│   │   ├── assets.js
│   │   ├── assets.wxss
│   │   └── assets.json
│   │
│   ├── period/                       # 🆕 经期记录
│   │   ├── period.wxml
│   │   ├── period.js
│   │   ├── period.wxss
│   │   └── period.json
│   │
│   ├── steps/                        # 🆕 步数
│   │   ├── steps.wxml
│   │   ├── steps.js
│   │   ├── steps.wxss
│   │   └── steps.json
│   │
│   └── settings/                     # 🆕 卡片自定义
│       ├── settings.wxml
│       ├── settings.js
│       ├── settings.wxss
│       └── settings.json
│
├── utils/
│   ├── storage.js                    # ✅ 记账本数据层（不动）
│   ├── weather.js                    # ✅ 天气（不动）
│   ├── config.js                     # ✅ API Key（不动）
│   ├── assets-storage.js             # 🆕 资产数据层
│   ├── period-storage.js             # 🆕 经期数据层
│   └── steps.js                      # 🆕 步数（云开发）
│
├── cloudfunctions/                   # 🆕 云函数目录
│   └── getWeRunData/                 # 解密微信运动数据
│       ├── index.js
│       └── package.json
│
├── preview/                          # 🆕 UI 预览（HTML 模拟）
│   └── index.html
│
├── signal.md                         # 需求文档
├── UPGRADE_PLAN.md                   # 本文档
└── README.md
```

---

## 四、数据设计

### 4.1 资产记录

```js
// 账户
{
  id: "asset_xxx",
  name: "工商银行储蓄卡",
  type: "bank" | "stock" | "fund" | "forex" | "cash" | "other",
  amount: 50000.00,         // 当前金额
  note: "工资卡",
  updateTime: "2026-06-20"
}

// 汇总
{
  totalAssets: 72000.00,
  totalLiabilities: 13680.00,
  netWorth: 58320.00
}
```

### 4.2 经期记录

```js
// 单条记录
{
  id: "period_xxx",
  startDate: "2026-06-20",   // 开始日期
  endDate: "2026-06-25",     // 结束日期
  cycleDays: 28,             // 本周期天数
  note: ""                   // 备注（痛经程度等）
}

// 预测
{
  predictedNext: "2026-07-18",  // 预测下次
  avgCycle: 28                   // 平均周期
}
```

### 4.3 卡片配置

```js
// 用户自定义的仪表盘槽位
{
  slots: [
    { position: 0, tool: "bookkeeping" },
    { position: 1, tool: "assets" },
    { position: 2, tool: "steps" },
    { position: 3, tool: "custom" }   // 用户可选任意工具
  ]
}
```

---

## 五、仪表盘卡片设计

### 5.1 卡片类型

| 卡片 | 图标 | 快览内容 | 点击跳转 |
|------|:--:|------|------|
| 记账本 | 📊 | 本月收入/支出 | bookkeeping/index |
| 总资产 | 💰 | 净资产 | assets |
| 步数 | 🚶 | 今日步数 | steps |
| 经期 | 📅 | 下次倒计时 | period |
| 自定义 | ➕ | 点击设置 | settings |

### 5.2 卡片交互

- 长按卡片 → 弹出「替换」菜单 → 选择其他工具
- 设置页（settings）也能管理槽位
- 4 槽位始终满，不可留空，不可超过 4 个

---

## 六、开发分期

### 🥇 一期 v2.0 · 工具箱上线

| 模块 | 任务 | 新/改 |
|------|------|:--:|
| 路由 | app.json 注册新页面，TabBar 精简为首页 | 🔧 |
| 仪表盘 | 时间、天气、2×2 卡片网格、点击跳转 | 🆕 |
| 记账本 | 移除底部导航，改为内部子页面导航 | 🔧 |
| 总资产 | 列表页 + 添加/编辑/删除 | 🆕 |
| 经期记录 | 日历标记 + 周期预测 | 🆕 |
| 步数 | 云函数解密 + 仪表盘显示 | 🆕 |
| 设置 | 卡片槽位替换 | 🆕 |

**发布**：v2.0 体验版

### 🥈 二期 v2.1 · 打磨

| 模块 | 任务 |
|------|------|
| 经期 | 推送提醒（微信订阅消息） |
| 资产 | 饼图分布 |
| 步数 | 7 天趋势图 |
| 仪表盘 | 更多可选卡片 |

---

## 七、HTML 预览文件规划

```
preview/index.html    ← 整体升级预览（仪表盘 + 各工具详情）
```

预览包含：
- 仪表盘（完整 UI）
- 记账本详情（从现有功能映射过来）
- 总资产详情（列表 + 添加表单）
- 经期详情（日历视图）
- 步数详情（步数 + 趋势）

用户可在浏览器中切换所有视图，确认设计后再翻译为 WXML。

---

## 八、兼容性说明

| 事项 | 处理 |
|------|------|
| 现有记账数据 | 完全兼容，storage.js 不动 |
| 现有天气 | 复用 weather.js，移到仪表盘顶部 |
| 现有页面 | 记账本三页面保留，只改入口（从 TabBar 改为卡片跳转） |
| 底部导航 | 现有自定义 tab-bar 删除，改用微信原生 TabBar（只有首页） |

---

> 文档版本 v1.0  
> 日期 2026-06-20
