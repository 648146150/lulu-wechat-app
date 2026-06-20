var weather = require('../../utils/weather');
var storage = require('../../utils/storage');
var assetsStore = require('../../utils/assets-storage');
var periodStore = require('../../utils/period-storage');

var SK = 'dashboard_slots';
var DEF = ['bookkeeping','assets','steps','custom'];
function loadSlots(){ var s=wx.getStorageSync(SK); return (s&&s.length>=1)?s:DEF.slice(); }
function saveSlots(s){ wx.setStorageSync(SK,s); }

var TOOLS = {
  bookkeeping:{ icon:'📊',label:'记账本',color:'bookkeeping',page:'/pages/bookkeeping/index/index' },
  assets:{ icon:'💰',label:'总资产',color:'assets',page:'/pages/assets/assets' },
  steps:{ icon:'🚶',label:'步数',color:'steps',page:'/pages/steps/steps' },
  period:{ icon:'📅',label:'经期记录',color:'period',page:'/pages/period/period' },
  custom:{ icon:'⚙️',label:'自定义',color:'custom',page:'/pages/settings/settings' }
};

function cardVal(key){
  switch(key){
    case 'bookkeeping': var s=storage.getMonthSummary(new Date().getFullYear(),new Date().getMonth()+1); return {value:'¥'+s.expense.toFixed(0),sub:'本月支出'};
    case 'assets': var a=assetsStore.getSummary(); return {value:'¥'+a.netWorth.toFixed(0),sub:'净资产'};
    case 'steps': var st=wx.getStorageSync('today_steps')||0; return {value:st||'--',sub:'今日步数'};
    case 'period': var p=periodStore.getPrediction(); if(p&&p.daysUntil!==null)return{value:p.daysUntil+'天',sub:'距离下次'}; return {value:'--',sub:'暂无数据'};
    case 'custom': return {value:'+',sub:'管理工具'};
    default: return {value:'--',sub:''};
  }
}

Page({
  data: {
    timeText:'',dateText:'',weekdayText:'',
    weather:{temp:'',feelsLike:'',text:'',icon:'',city:'',windDir:'',windScale:'',humidity:''},
    cards:[], bookkeeping:{income:'0',expense:'0',balance:'0'}
  },
  onShow:function(){
    this.tick(); this.loadWeather(); this.loadCards(); this.loadBookkeeping();
    var that=this; if(this._t)clearInterval(this._t); this._t=setInterval(function(){that.tick();},10000);
  },
  onHide:function(){ if(this._t)clearInterval(this._t); },
  tick:function(){
    var n=new Date(),h=n.getHours(),m=n.getMinutes(),days=['日','一','二','三','四','五','六'];
    this.setData({ timeText:(h<10?'0'+h:h)+':'+(m<10?'0'+m:m), dateText:(n.getMonth()+1)+'月'+n.getDate()+'日', weekdayText:'星期'+days[n.getDay()] });
  },
  loadWeather:function(){
    var that=this;
    weather.fetchWeather(function(e,d){ if(!e&&d) that.setData({weather:d}); });
  },
  loadCards:function(){
    var slots=loadSlots();
    var cards=slots.map(function(k){ var t=TOOLS[k]||TOOLS.custom; var v=cardVal(k); return {key:k,icon:t.icon,label:t.label,color:t.color,page:t.page,value:v.value,sub:v.sub}; });
    this.setData({cards:cards});
  },
  loadBookkeeping:function(){
    var n=new Date(), s=storage.getMonthSummary(n.getFullYear(),n.getMonth()+1);
    this.setData({bookkeeping:{income:s.income.toFixed(0),expense:s.expense.toFixed(0),balance:s.balance.toFixed(0)}});
  },
  onCardTap:function(e){ var p=e.currentTarget.dataset.page; if(p) wx.navigateTo({url:p}); },
  onCardLongPress:function(e){
    var k=e.currentTarget.dataset.key, i=e.currentTarget.dataset.index;
    if(k==='custom') return;
    wx.navigateTo({url:'/pages/settings/settings?pick='+i});
  },
  goBookkeeping:function(){ wx.navigateTo({url:'/pages/bookkeeping/index/index'}); }
});