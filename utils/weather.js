// ==========================================
// 天气工具 - 获取北京实时天气
// 使用高德天气 API（restapi.amap.com）
// 免费额度：5000次/天，个人使用完全足够
// 注册 Key：https://lbs.amap.com → 控制台 → 创建应用
// ==========================================

// 高德 API Key —— 去 https://lbs.amap.com 免费注册获取
// 创建 Key 时「服务平台」必须选「Web服务」
var API_KEY = '7d5b561a823a01cfdc5fdc788114b8ad';

// 北京的城市编码（adcode）
var BEIJING_ADCODE = '110000';

// 高德天气描述 -> emoji 映射
var WEATHER_EMOJI_MAP = {
  '晴': '☀️',
  '少云': '🌤️',
  '晴间多云': '⛅',
  '多云': '⛅',
  '阴': '☁️',
  '有风': '💨',
  '平静': '🌙',
  '微风': '🍃',
  '和风': '🍃',
  '清风': '🍃',
  '强风/劲风': '💨',
  '疾风': '💨',
  '大风': '💨',
  '烈风': '💨',
  '风暴': '🌪️',
  '狂爆风': '🌪️',
  '飓风': '🌪️',
  '热带风暴': '🌪️',
  '阵雨': '🌦️',
  '雷阵雨': '⛈️',
  '雷阵雨伴有冰雹': '⛈️',
  '小雨': '🌧️',
  '中雨': '🌧️',
  '大雨': '🌧️',
  '暴雨': '🌧️',
  '大暴雨': '🌧️',
  '特大暴雨': '🌧️',
  '冻雨': '🧊',
  '雨夹雪': '🌨️',
  '阵雪': '🌨️',
  '小雪': '🌨️',
  '中雪': '❄️',
  '大雪': '❄️',
  '暴雪': '❄️',
  '浮尘': '💨',
  '扬沙': '💨',
  '沙尘暴': '💨',
  '强沙尘暴': '💨',
  '雾': '🌫️',
  '浓雾': '🌫️',
  '强浓雾': '🌫️',
  '轻雾': '🌫️',
  '大雾': '🌫️',
  '特强浓雾': '🌫️',
  '霾': '🌫️',
  '中度霾': '🌫️',
  '重度霾': '🌫️',
  '严重霾': '🌫️',
  '热': '🔥',
  '冷': '🥶',
  '未知': '🌈'
};

/**
 * 根据天气文字匹配 emoji（支持模糊匹配）
 */
function getWeatherEmoji(text) {
  if (!text) return '🌈';
  if (WEATHER_EMOJI_MAP[text]) return WEATHER_EMOJI_MAP[text];
  // 模糊匹配：包含关键词即可
  if (text.indexOf('雨') !== -1) return '🌧️';
  if (text.indexOf('雪') !== -1) return '❄️';
  if (text.indexOf('云') !== -1) return '⛅';
  if (text.indexOf('晴') !== -1) return '☀️';
  if (text.indexOf('阴') !== -1) return '☁️';
  if (text.indexOf('风') !== -1) return '💨';
  if (text.indexOf('沙') !== -1) return '💨';
  if (text.indexOf('尘') !== -1) return '💨';
  if (text.indexOf('雾') !== -1) return '🌫️';
  if (text.indexOf('霾') !== -1) return '🌫️';
  if (text.indexOf('雷') !== -1) return '⛈️';
  return '🌈';
}

/**
 * 获取北京实时天气
 * @param {Function} callback - callback(err, weatherData)
 */
function fetchBeijingWeather(callback) {
  if (API_KEY === 'YOUR_KEY_HERE') {
    callback(new Error('请先设置高德 API Key'));
    return;
  }

  wx.request({
    url: 'https://restapi.amap.com/v3/weather/weatherInfo',
    data: {
      key: API_KEY,
      city: BEIJING_ADCODE,
      extensions: 'base'   // base=实时天气, all=天气预报
    },
    success: function(res) {
      if (res.statusCode === 200 && res.data.status === '1') {
        var live = res.data.lives[0];
        var result = {
          temp: live.temperature,
          feelsLike: live.temperature,     // 高德 base 接口无体感温度，用实际温度代替
          text: live.weather,
          icon: getWeatherEmoji(live.weather),
          windDir: live.winddirection,
          windScale: live.windpower,
          humidity: live.humidity
        };
        callback(null, result);
      } else {
        callback(new Error('天气接口返回错误：' + (res.data.info || '未知')));
      }
    },
    fail: function(err) {
      callback(err);
    }
  });
}

module.exports = {
  fetchBeijingWeather: fetchBeijingWeather
};
