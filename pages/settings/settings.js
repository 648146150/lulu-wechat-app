var SK='dashboard_slots', DEF=['bookkeeping','assets','steps','custom'];
function ld(){ var s=wx.getStorageSync(SK); return (s&&s.length>=1)?s:DEF.slice(); }
function sv(s){ wx.setStorageSync(SK,s); }

var TOOLS={
  bookkeeping:{icon:'📊',label:'记账本'},assets:{icon:'💰',label:'资产记录'},
  steps:{icon:'🚶',label:'步数'},period:{icon:'📅',label:'经期记录'},custom:{icon:'⚙️',label:'自定义'}
};

Page({
  data:{
    slots:[],tools:TOOLS,
    toolOptions:[
      {key:'bookkeeping',icon:'📊',label:'记账本',desc:'收支记录·月度统计'},
      {key:'assets',icon:'💰',label:'资产记录',desc:'多账户汇总·净资产'},
      {key:'steps',icon:'🚶',label:'步数',desc:'微信运动·每日统计'},
      {key:'period',icon:'📅',label:'经期记录',desc:'日历标记·周期预测'}
    ],
    showPicker:false,pickIndex:0
  },
  onShow:function(){ this.setData({slots:ld()}); },
  onLoad:function(o){
    if(o&&o.pick){ var that=this; setTimeout(function(){ that.setData({pickIndex:Number(o.pick),showPicker:true}); },300); }
  },
  onAdd:function(){
    var s=this.data.slots.slice(); if(s.length>=6) return;
    var used={}; s.forEach(function(x){used[x]=true;});
    var list=['period','bookkeeping','assets','steps'], add='period';
    for(var i=0;i<list.length;i++){ if(!used[list[i]]){add=list[i];break;} }
    s.splice(s.indexOf('custom'),0,add); sv(s); this.setData({slots:ld()});
  },
  onRemove:function(e){
    var i=e.currentTarget.dataset.index, s=this.data.slots.slice();
    if(s[i]==='custom'||s.length<=1)return; s.splice(i,1); sv(s); this.setData({slots:ld()});
  },
  onReplace:function(e){ this.setData({pickIndex:e.currentTarget.dataset.index,showPicker:true}); },
  onSelect:function(e){
    var k=e.currentTarget.dataset.key, i=this.data.pickIndex, s=this.data.slots.slice();
    if(s[i]==='custom')return this.setData({showPicker:false});
    var oi=s.indexOf(k); if(oi>=0&&oi!==i)s[oi]=s[i]; s[i]=k; sv(s);
    this.setData({showPicker:false,slots:ld()});
  },
  closePicker:function(){ this.setData({showPicker:false}); },
  prevent:function(){},
  goHome:function(){ var p=getCurrentPages(); if(p.length>1)wx.navigateBack({delta:99}); else wx.reLaunch({url:'/pages/dashboard/dashboard'}); }
});