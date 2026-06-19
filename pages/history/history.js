// 账单列表页 - 按月份筛选，按日期分组，支持删除
var storage = require('../../utils/storage');

Page({
  data: {
    // 当前查看的年份和月份
    currentYear: 2026,
    currentMonth: 6,
    isCurrentMonth: true,
    // 当月收支汇总
    monthIncome: '0.00',
    monthExpense: '0.00',
    // 按日期分组
    groups: []
  },

  onShow: function() {
    this.loadData();
  },

  /** 加载数据 */
  loadData: function() {
    var year = this.data.currentYear;
    var month = this.data.currentMonth;

    // 当月汇总
    var summary = storage.getMonthSummary(year, month);
    this.setData({
      monthIncome: summary.income.toFixed(2),
      monthExpense: summary.expense.toFixed(2)
    });

    // 当月记录
    var monthRecords = storage.getMonthRecords(year, month);
    var groups = storage.getRecordsGroupedByDate(monthRecords);

    // 构建 emoji 映射
    var emojiMap = {};
    storage.EXPENSE_CATEGORIES.forEach(function(c) { emojiMap[c.name] = c.emoji; });
    storage.INCOME_CATEGORIES.forEach(function(c) { emojiMap[c.name] = c.emoji; });

    // 为每组计算当日汇总 + 补 emoji
    groups = groups.map(function(group) {
      var dayIncome = 0;
      var dayExpense = 0;

      var records = group.records.map(function(r) {
        if (r.type === 'income') {
          dayIncome += r.amount;
        } else {
          dayExpense += r.amount;
        }
        return {
          id: r.id,
          type: r.type,
          category: r.category,
          categoryEmoji: emojiMap[r.category] || '📌',
          amount: r.amount.toFixed(2),
          note: r.note || ''
        };
      });

      return {
        date: group.date,
        records: records,
        dayIncome: dayIncome.toFixed(2),
        dayExpense: dayExpense.toFixed(2)
      };
    });

    this.setData({ groups: groups });
  },

  /** 上一个月 */
  prevMonth: function() {
    var year = this.data.currentYear;
    var month = this.data.currentMonth;

    if (month === 1) {
      year -= 1;
      month = 12;
    } else {
      month -= 1;
    }

    this.setData({
      currentYear: year,
      currentMonth: month,
      isCurrentMonth: this.checkIsCurrentMonth(year, month)
    });
    this.loadData();
  },

  /** 下一个月 */
  nextMonth: function() {
    if (this.data.isCurrentMonth) return;

    var year = this.data.currentYear;
    var month = this.data.currentMonth;

    if (month === 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }

    this.setData({
      currentYear: year,
      currentMonth: month,
      isCurrentMonth: this.checkIsCurrentMonth(year, month)
    });
    this.loadData();
  },

  /** 是否当前月 */
  checkIsCurrentMonth: function(year, month) {
    var now = new Date();
    return year === now.getFullYear() && month === (now.getMonth() + 1);
  },

  /** 长按删除 */
  deleteRecord: function(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;

    wx.showModal({
      title: '删除确认',
      content: '确定要删除这条记录吗？',
      confirmColor: '#F44336',
      success: function(res) {
        if (res.confirm) {
          storage.deleteRecord(id);
          that.loadData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  goToIndex: function() {
    wx.navigateBack();
  },

  goToAdd: function() {
    wx.navigateTo({ url: '/pages/add/add' });
  }
});
