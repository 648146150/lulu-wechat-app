// 记账页 - 添加收入/支出记录
var storage = require('../../utils/storage');

Page({
  data: {
    // 当前类型：expense（支出）或 income（收入）
    type: 'expense',
    // 金额（字符串，方便输入）
    amount: '',
    // 当前分类列表
    categories: storage.EXPENSE_CATEGORIES,
    // 选中的分类名
    selectedCategory: '',
    // 备注
    note: '',
    // 日期，默认今天
    date: ''
  },

  /** 页面加载时初始化 */
  onLoad: function() {
    // 设置默认日期为今天
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    // 补齐两位数
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    this.setData({
      date: year + '-' + month + '-' + day
    });
  },

  /** 切换收入/支出类型 */
  switchType: function(e) {
    var newType = e.currentTarget.dataset.type;
    var categories = newType === 'income'
      ? storage.INCOME_CATEGORIES
      : storage.EXPENSE_CATEGORIES;

    this.setData({
      type: newType,
      categories: categories,
      selectedCategory: ''  // 切换类型时清空已选分类
    });
  },

  /** 金额输入 */
  onAmountInput: function(e) {
    this.setData({
      amount: e.detail.value
    });
  },

  /** 选择分类 */
  selectCategory: function(e) {
    this.setData({
      selectedCategory: e.currentTarget.dataset.name
    });
  },

  /** 备注输入 */
  onNoteInput: function(e) {
    this.setData({
      note: e.detail.value
    });
  },

  /** 日期选择 */
  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
  },

  /** 保存记录 */
  saveRecord: function() {
    var that = this;
    var amount = parseFloat(this.data.amount);

    // --- 表单验证 ---
    if (isNaN(amount) || amount <= 0) {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      });
      return;
    }

    if (!this.data.selectedCategory) {
      wx.showToast({
        title: '请选择一个分类',
        icon: 'none'
      });
      return;
    }

    // --- 保存数据 ---
    storage.addRecord({
      type: this.data.type,
      amount: amount,
      category: this.data.selectedCategory,
      note: this.data.note || '',
      date: this.data.date
    });

    // --- 提示成功 ---
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });

    // 延迟返回首页，让用户看到提示
    setTimeout(function() {
      wx.navigateBack();
    }, 1500);
  },

  /** 跳转首页 */
  goToIndex: function() {
    wx.navigateBack();
  },

  /** 跳转账单页 */
  goToHistory: function() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  }
});
