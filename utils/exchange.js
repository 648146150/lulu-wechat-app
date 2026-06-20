// ==========================================
// 汇率工具 - 获取实时汇率，支持外币→人民币换算
// 免费 API：open.er-api.com，无需 Key
// ==========================================

var CACHE_KEY = 'exchange_rates';
var CACHE_TIME_KEY = 'exchange_rates_time';
var CACHE_TTL = 4 * 60 * 60 * 1000; // 4 小时刷新一次

// 支持的币种
var CURRENCIES = [
  { code: 'CNY', name: '人民币', symbol: '¥' },
  { code: 'USD', name: '美元', symbol: '$' },
  { code: 'HKD', name: '港币', symbol: 'HK$' },
  { code: 'EUR', name: '欧元', symbol: '€' },
  { code: 'GBP', name: '英镑', symbol: '£' },
  { code: 'JPY', name: '日元', symbol: '¥' },
  { code: 'KRW', name: '韩元', symbol: '₩' },
  { code: 'AUD', name: '澳元', symbol: 'A$' },
  { code: 'TWD', name: '新台币', symbol: 'NT$' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$' },
  { code: 'THB', name: '泰铢', symbol: '฿' }
];

function getCodeMap() {
  var map = {};
  CURRENCIES.forEach(function(c) { map[c.code] = c; });
  return map;
}

/** 读取缓存的汇率 */
function getCachedRates() {
  var now = Date.now();
  var cacheTime = wx.getStorageSync(CACHE_TIME_KEY) || 0;
  if (now - cacheTime < CACHE_TTL) {
    var cached = wx.getStorageSync(CACHE_KEY);
    if (cached && cached.rates) return cached;
  }
  return null;
}

/** 保存汇率到缓存 */
function saveCache(rates) {
  wx.setStorageSync(CACHE_KEY, rates);
  wx.setStorageSync(CACHE_TIME_KEY, Date.now());
}

/**
 * 获取汇率（优先缓存，过期则请求）
 * @param {Function} cb - callback(err, rates)  rates: { USD: 0.137, ... }
 *   含义：1 CNY = rates[code] 单位外币
 */
function fetchRates(cb) {
  var cached = getCachedRates();
  if (cached) { cb(null, cached); return; }

  wx.request({
    url: 'https://open.er-api.com/v6/latest/CNY',
    timeout: 8000,
    success: function(res) {
      if (res.statusCode === 200 && res.data && res.data.result === 'success') {
        saveCache(res.data);
        cb(null, res.data);
      } else {
        cb(new Error('汇率接口异常'));
      }
    },
    fail: function(err) { cb(err); }
  });
}

/**
 * 将外币金额换算为人民币
 * @param {number} amount - 外币金额
 * @param {string} currency - 币种代码，如 'HKD'
 * @param {object} ratesData - API 返回的完整数据（含 rates 字段）
 * @returns {number} 人民币金额
 */
function toCNY(amount, currency, ratesData) {
  if (currency === 'CNY') return amount;
  if (!ratesData || !ratesData.rates) return amount;
  var rate = ratesData.rates[currency];
  if (!rate || rate === 0) return amount;
  // rates[code] = 1 CNY 可兑换多少外币
  // 外币→人民币 = 外币金额 / rate
  return parseFloat((amount / rate).toFixed(2));
}

/**
 * 获取货币符号
 */
function getSymbol(code) {
  var map = getCodeMap();
  return map[code] ? map[code].symbol : '?';
}

module.exports = {
  CURRENCIES: CURRENCIES,
  fetchRates: fetchRates,
  toCNY: toCNY,
  getSymbol: getSymbol,
  getCachedRates: getCachedRates
};
