// ==========================================
// 天气工具 - 自动定位获取实时天气
// 使用高德 API（restapi.amap.com）
// 免费额度：5000次/天
// ==========================================

var config = require('./config');
var API_KEY = config.AMAP_KEY;

var WEATHER_EMOJI_MAP = {
  '晴': '☀️', '少云': '🌤️', '晴间多云': '⛅', '多云': '⛅',
  '阴': '☁️', '微风': '🍃', '和风': '🍃', '清风': '🍃',
  '强风/劲风': '💨', '疾风': '💨', '大风': '💨', '烈风': '💨',
  '风暴': '🌪️', '狂爆风': '🌪️', '飓风': '🌪️', '热带风暴': '🌪️',
  '阵雨': '🌦️', '雷阵雨': '⛈️', '雷阵雨伴有冰雹': '⛈️',
  '小雨': '🌧️', '中雨': '🌧️', '大雨': '🌧️',
  '暴雨': '🌧️', '大暴雨': '🌧️', '特大暴雨': '🌧️', '冻雨': '🧊',
  '雨夹雪': '🌨️', '阵雪': '🌨️', '小雪': '🌨️',
  '中雪': '❄️', '大雪': '❄️', '暴雪': '❄️',
  '浮尘': '💨', '扬沙': '💨', '沙尘暴': '💨', '强沙尘暴': '💨',
  '雾': '🌫️', '浓雾': '🌫️', '强浓雾': '🌫️', '轻雾': '🌫️',
  '大雾': '🌫️', '特强浓雾': '🌫️',
  '霾': '🌫️', '中度霾': '🌫️', '重度霾': '🌫️', '严重霾': '🌫️',
  '热': '🔥', '冷': '🥶', '未知': '🌈'
};

function getWeatherEmoji(text) {
  if (!text) return '🌈';
  if (WEATHER_EMOJI_MAP[text]) return WEATHER_EMOJI_MAP[text];
  if (text.indexOf('雨') !== -1) return '🌧️';
  if (text.indexOf('雪') !== -1) return '❄️';
  if (text.indexOf('云') !== -1) return '⛅';
  if (text.indexOf('晴') !== -1) return '☀️';
  if (text.indexOf('阴') !== -1) return '☁️';
  if (text.indexOf('风') !== -1) return '💨';
  if (text.indexOf('沙') !== -1 || text.indexOf('尘') !== -1) return '💨';
  if (text.indexOf('雾') !== -1 || text.indexOf('霾') !== -1) return '🌫️';
  if (text.indexOf('雷') !== -1) return '⛈️';
  return '🌈';
}

/** 查询指定城市天气 */
function queryWeather(adcode, cityName, callback) {
  wx.request({
    url: 'https://restapi.amap.com/v3/weather/weatherInfo',
    data: { key: API_KEY, city: adcode, extensions: 'base' },
    success: function(res) {
      if (res.data.status === '1' && res.data.lives.length > 0) {
        var live = res.data.lives[0];
        callback(null, {
          city: cityName,
          temp: live.temperature,
          feelsLike: live.temperature,
          text: live.weather,
          icon: getWeatherEmoji(live.weather),
          windDir: live.winddirection,
          windScale: live.windpower,
          humidity: live.humidity
        });
      } else {
        callback(new Error('天气接口返回错误'));
      }
    },
    fail: function(err) { callback(err); }
  });
}

/** 格式化城市名，如 "北京·朝阳区" / "深圳·南山区" */
function formatCity(comp) {
  var city = (comp.city || comp.province || '北京').replace('市', '');
  var district = comp.district || '';
  if (district && district !== city && district !== city + '市') {
    return city + '·' + district;
  }
  return city;
}

/**
 * 获取天气（优先定位，失败回退北京）
 */
function fetchWeather(callback) {
  wx.getLocation({
    type: 'wgs84',
    success: function(locRes) {
      // 定位成功 → 逆地理编码得城市
      wx.request({
        url: 'https://restapi.amap.com/v3/geocode/regeo',
        data: {
          key: API_KEY,
          location: locRes.longitude + ',' + locRes.latitude
        },
        success: function(regeoRes) {
          if (regeoRes.data.status === '1' && regeoRes.data.regeocode) {
            var comp = regeoRes.data.regeocode.addressComponent;
            var city = formatCity(comp);
            var adcode = comp.adcode;
            if (adcode) {
              queryWeather(adcode, city, callback);
            } else {
              queryWeather('110000', '北京', callback);
            }
          } else {
            queryWeather('110000', '北京', callback);
          }
        },
        fail: function() { queryWeather('110000', '北京', callback); }
      });
    },
    fail: function() {
      // 定位失败/用户拒绝 → 默认北京
      queryWeather('110000', '北京', callback);
    }
  });
}

module.exports = { fetchWeather: fetchWeather };
