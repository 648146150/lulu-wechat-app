// ==========================================
// 数据存储工具 - 负责账单数据的增删改查
// 所有数据存储在手机本地（wx.Storage）
// ==========================================

// 存储的 key 名称
var STORAGE_KEY = 'bill_records';

// ==========================================
// 分类数据 - 内置固定分类，无需后端
// ==========================================

// 支出分类
var EXPENSE_CATEGORIES = [
  { name: '餐饮', emoji: '🍽️' },
  { name: '交通', emoji: '🚗' },
  { name: '购物', emoji: '🛍️' },
  { name: '娱乐', emoji: '🎮' },
  { name: '居家', emoji: '🏠' },
  { name: '医疗', emoji: '💊' },
  { name: '教育', emoji: '📚' },
  { name: '其他', emoji: '💸' }
];

// 收入分类
var INCOME_CATEGORIES = [
  { name: '工资', emoji: '💰' },
  { name: '奖金', emoji: '🎁' },
  { name: '兼职', emoji: '💼' },
  { name: '理财', emoji: '📈' },
  { name: '退款', emoji: '↩️' },
  { name: '其他', emoji: '📥' }
];

// ==========================================
// 基础操作
// ==========================================

/** 生成唯一 ID */
function generateId() {
  return 'bill_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
}

/** 读取全部记录 */
function getAllRecords() {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

/** 保存全部记录 */
function saveAllRecords(records) {
  wx.setStorageSync(STORAGE_KEY, records);
}

// ==========================================
// 工具函数
// ==========================================

/**
 * 把年份+月份转成前缀字符串，如 2026-06
 * @param {number} year
 * @param {number} month
 */
function makeMonthPrefix(year, month) {
  return year + '-' + (month < 10 ? '0' + month : '' + month);
}

/**
 * 构建分类名 -> emoji 的映射表
 */
function buildCategoryEmojiMap() {
  var map = {};
  EXPENSE_CATEGORIES.forEach(function(c) { map[c.name] = c.emoji; });
  INCOME_CATEGORIES.forEach(function(c) { map[c.name] = c.emoji; });
  return map;
}

// ==========================================
// 对外暴露的方法
// ==========================================

/** 添加一条记录 */
function addRecord(record) {
  var records = getAllRecords();
  record.id = generateId();
  record.createTime = new Date().toISOString();
  records.unshift(record);   // 最新记录在最前面
  saveAllRecords(records);
  return record;
}

/** 根据 id 删除一条记录 */
function deleteRecord(id) {
  var records = getAllRecords();
  var filtered = records.filter(function(r) { return r.id !== id; });
  saveAllRecords(filtered);
}

// ---------- 按月查询 ----------

/**
 * 获取指定月份的记录
 * @param {number} year
 * @param {number} month
 * @returns {Array}
 */
function getMonthRecords(year, month) {
  var records = getAllRecords();
  var prefix = makeMonthPrefix(year, month);
  return records.filter(function(r) {
    return r.date && r.date.startsWith(prefix);
  });
}

/**
 * 获取本月记录（兼容旧接口）
 * @returns {Array}
 */
function getCurrentMonthRecords() {
  var now = new Date();
  return getMonthRecords(now.getFullYear(), now.getMonth() + 1);
}

/**
 * 计算指定月份的收支汇总
 * @param {number} year
 * @param {number} month
 * @returns {{income: number, expense: number, balance: number}}
 */
function getMonthSummary(year, month) {
  var records = getMonthRecords(year, month);
  var totalIncome = 0;
  var totalExpense = 0;

  records.forEach(function(r) {
    if (r.type === 'income') {
      totalIncome += r.amount;
    } else {
      totalExpense += r.amount;
    }
  });

  return {
    income: totalIncome,
    expense: totalExpense,
    balance: totalIncome - totalExpense
  };
}

/**
 * 获取指定月份的分类支出排行（从高到低）
 * @param {number} year
 * @param {number} month
 * @returns {Array<{category, emoji, amount, percent}>}
 */
function getCategoryBreakdown(year, month) {
  var records = getMonthRecords(year, month);
  var emojiMap = buildCategoryEmojiMap();

  // 按分类汇总支出
  var expenseMap = {};
  records.forEach(function(r) {
    if (r.type === 'expense') {
      if (!expenseMap[r.category]) {
        expenseMap[r.category] = 0;
      }
      expenseMap[r.category] += r.amount;
    }
  });

  // 计算总支出
  var totalExpense = 0;
  Object.keys(expenseMap).forEach(function(cat) {
    totalExpense += expenseMap[cat];
  });

  // 转成数组
  var categories = Object.keys(expenseMap);
  var result = categories.map(function(cat) {
    return {
      category: cat,
      emoji: emojiMap[cat] || '📌',
      amount: expenseMap[cat],
      percent: totalExpense > 0 ? Math.round(expenseMap[cat] / totalExpense * 100) : 0
    };
  });

  // 按金额从高到低排序
  result.sort(function(a, b) { return b.amount - a.amount; });

  return {
    list: result,
    totalExpense: totalExpense
  };
}

// ---------- 按日期分组 ----------

/**
 * 获取所有记录，按日期分组。可传入已筛选的 records 数组。
 * @param {Array} [records] 可选：已筛选过的记录数组。不传则用全部记录。
 * @returns {Array<{date: string, records: Array}>}
 */
function getRecordsGroupedByDate(records) {
  var source = records || getAllRecords();
  var groups = {};

  source.forEach(function(r) {
    if (!groups[r.date]) {
      groups[r.date] = [];
    }
    groups[r.date].push(r);
  });

  // 转成数组，日期倒序
  var dates = Object.keys(groups);
  dates.sort(function(a, b) { return b.localeCompare(a); });

  return dates.map(function(date) {
    return {
      date: date,
      records: groups[date]
    };
  });
}

// ==========================================
// 导出
// ==========================================
module.exports = {
  // 分类
  EXPENSE_CATEGORIES: EXPENSE_CATEGORIES,
  INCOME_CATEGORIES: INCOME_CATEGORIES,
  // 方法
  getAllRecords: getAllRecords,
  addRecord: addRecord,
  deleteRecord: deleteRecord,
  getMonthRecords: getMonthRecords,
  getCurrentMonthRecords: getCurrentMonthRecords,
  getMonthSummary: getMonthSummary,
  getCategoryBreakdown: getCategoryBreakdown,
  getRecordsGroupedByDate: getRecordsGroupedByDate
};
