// 首页 - 显示指定月份收支汇总、分类排行、最近记录
var storage = require('../../utils/storage');

Page({
  data: {
    // 当前查看的年份和月份
    currentYear: 2026,
    currentMonth: 6,
    // 是否当前月份（用于禁用"下个月"箭头）
    isCurrentMonth: true,
    // 收支汇总
    summary: {
      income: '0.00',
      expense: '0.00',
      balance: '0.00'
    },
    // 分类支出
    categoryList: [],
    categoryTotal: '0.00',
    // 最近 5 条记录
    recentRecords: []
  },

  onShow: function() {
    // 每次显示时重新加载
    this.loadData();
  },

  /** 加载所有数据 */
  loadData: function() {
    var year = this.data.currentYear;
    var month = this.data.currentMonth;

    // 1. 收支汇总
    var summary = storage.getMonthSummary(year, month);
    this.setData({
      summary: {
        income: summary.income.toFixed(2),
        expense: summary.expense.toFixed(2),
        balance: summary.balance.toFixed(2)
      }
    });

    // 2. 分类支出排行
    var breakdown = storage.getCategoryBreakdown(year, month);
    var categoryList = breakdown.list.map(function(item) {
      return {
        category: item.category,
        emoji: item.emoji,
        amount: item.amount,
        amountText: item.amount.toFixed(2),
        percent: item.percent
      };
    });
    this.setData({
      categoryList: categoryList,
      categoryTotal: breakdown.totalExpense.toFixed(2)
    });

    // 3. 当月记录（取最近5条）
    var monthRecords = storage.getMonthRecords(year, month);
    var emojiMap = this.getCategoryMap();
    var recentRecords = monthRecords.slice(0, 5).map(function(r) {
      return {
        id: r.id,
        type: r.type,
        category: r.category,
        categoryEmoji: emojiMap[r.category] || '📌',
        amount: r.amount.toFixed(2),
        date: r.date
      };
    });
    this.setData({
      recentRecords: recentRecords
    });
  },

  /** 获取 emoji 映射 */
  getCategoryMap: function() {
    var map = {};
    storage.EXPENSE_CATEGORIES.forEach(function(c) { map[c.name] = c.emoji; });
    storage.INCOME_CATEGORIES.forEach(function(c) { map[c.name] = c.emoji; });
    return map;
  },

  /** 切换到上一个月 */
  prevMonth: function() {
    var year = this.data.currentYear;
    var month = this.data.currentMonth;

    if (month === 1) {
      year = year - 1;
      month = 12;
    } else {
      month = month - 1;
    }

    this.setData({
      currentYear: year,
      currentMonth: month,
      isCurrentMonth: this.checkIsCurrentMonth(year, month)
    });
    this.loadData();
  },

  /** 切换到下一个月（不能超过当前月份） */
  nextMonth: function() {
    if (this.data.isCurrentMonth) return;

    var year = this.data.currentYear;
    var month = this.data.currentMonth;

    if (month === 12) {
      year = year + 1;
      month = 1;
    } else {
      month = month + 1;
    }

    this.setData({
      currentYear: year,
      currentMonth: month,
      isCurrentMonth: this.checkIsCurrentMonth(year, month)
    });
    this.loadData();
  },

  /** 判断给定的年月是不是当前月份 */
  checkIsCurrentMonth: function(year, month) {
    var now = new Date();
    return year === now.getFullYear() && month === (now.getMonth() + 1);
  },

  /** 跳转记账页 */
  goToAdd: function() {
    wx.navigateTo({ url: '/pages/add/add' });
  },

  /** 跳转账单页 */
  goToHistory: function() {
    wx.navigateTo({ url: '/pages/history/history' });
  }
});
