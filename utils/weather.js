var KEY = require('./config').AMAP_KEY;
var EMOJI = { '晴':'☀️','多云':'⛅','阴':'☁️','小雨':'🌧️','中雨':'🌧️','大雨':'🌧️','暴雨':'🌧️','雷阵雨':'⛈️','阵雨':'🌦️','小雪':'🌨️','中雪':'❄️','大雪':'❄️','雾':'🌫️','霾':'🌫️' };
function toEmoji(t){ if(EMOJI[t])return EMOJI[t]; if(t.indexOf('雨')!==-1)return'🌧️'; if(t.indexOf('雪')!==-1)return'❄️'; if(t.indexOf('云')!==-1)return'⛅'; if(t.indexOf('晴')!==-1)return'☀️'; if(t.indexOf('阴')!==-1)return'☁️'; if(t.indexOf('雾')!==-1||t.indexOf('霾')!==-1)return'🌫️'; return'🌈'; }
function fmt(comp){
  var raw=comp.city||comp.province||'北京';
  if(Array.isArray(raw))raw=raw[0]||'北京';
  if(typeof raw!=='string')raw=String(raw);
  var c=raw.replace('市',''), d=comp.district||'';
  if(Array.isArray(d))d=d[0]||'';
  if(typeof d!=='string')d=String(d);
  if(d&&d!==c&&d!==c+'市')return c+'·'+d; return c;
}
function query(adcode,cityName,cb){
  wx.request({
    url:'https://restapi.amap.com/v3/weather/weatherInfo',
    data:{ key:KEY, city:adcode, extensions:'base' },
    success:function(r){
      if(r.data.status==='1'&&r.data.lives.length>0){
        var l=r.data.lives[0];
        cb(null,{ city:cityName, temp:l.temperature, feelsLike:l.temperature, text:l.weather, icon:toEmoji(l.weather), windDir:l.winddirection, windScale:l.windpower, humidity:l.humidity });
      }else{ cb(new Error('weather fail')); }
    },
    fail:function(e){ cb(e); }
  });
}
function fetchWeather(cb){
  wx.getLocation({
    type:'wgs84',
    success:function(loc){
      wx.request({
        url:'https://restapi.amap.com/v3/geocode/regeo',
        data:{ key:KEY, location:loc.longitude+','+loc.latitude },
        success:function(r){
          if(r.data.status==='1'&&r.data.regeocode){
            var comp=r.data.regeocode.addressComponent;
            var city=fmt(comp), adcode=comp.adcode;
            if(adcode) query(adcode,city,cb); else query('110000','北京',cb);
          }else{ query('110000','北京',cb); }
        },
        fail:function(){ query('110000','北京',cb); }
      });
    },
    fail:function(){ query('110000','北京',cb); }
  });
}
module.exports = { fetchWeather:fetchWeather };
