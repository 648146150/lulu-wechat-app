var store=require('../../utils/assets-storage');
var exchange=require('../../utils/exchange');
var TYPES=[{key:'bank',icon:'🏦',name:'储蓄'},{key:'stock',icon:'📈',name:'股票'},{key:'fund',icon:'💼',name:'基金'},{key:'forex',icon:'💱',name:'外汇'},{key:'cash',icon:'💵',name:'现金'},{key:'other',icon:'📦',name:'其他'}];
function ti(k){ for(var i=0;i<TYPES.length;i++)if(TYPES[i].key===k)return TYPES[i]; return TYPES[TYPES.length-1]; }

Page({
  data:{
    summary:{totalAssets:'0',totalLiabilities:'0',netWorth:'0',count:0},list:[],
    types:TYPES, currencies:exchange.CURRENCIES, ratesData:null,
    showModal:false,editingId:null, rateText:'',
    form:{name:'',type:'bank',currency:'CNY',amountText:'',note:''}
  },
  onShow:function(){ this.load(); },
  load:function(){
    var that=this;
    exchange.fetchRates(function(err,ratesData){
      var s=store.getSummary(ratesData);
      var l=store.getAll().map(function(a){
        var t=ti(a.type), pos=a.amount>=0, cur=a.currency||'CNY', curName='';
        var curInfo=exchange.CURRENCIES.filter(function(c){return c.code===cur;})[0];
        if(curInfo)curName=curInfo.name;
        var displayAmount=(pos?'¥':'-¥')+Math.abs(a.amount).toFixed(2);
        // 外汇显示原币+人民币等值
        var cnyNote='', rateNote='';
        if(a.type==='forex'&&cur!=='CNY'&&ratesData&&ratesData.rates){
          var cny=store.toCNY(Math.abs(a.amount),cur,ratesData);
          cnyNote='≈ ¥'+cny.toFixed(0);
          var rx=ratesData.rates[cur]; if(rx) rateNote='1 '+cur+' ≈ '+(1/rx).toFixed(4)+' CNY';
        }
        return {id:a.id,name:a.name,type:a.type,currency:cur,currencyNote:a.type==='forex'?exchange.getSymbol(cur)+' '+curName:'',
          displayAmount:displayAmount,cls:pos?'green':'red',cnyNote:cnyNote,rateNote:rateNote,
          note:a.note||'',typeIcon:t.icon,typeName:t.name,amount:a.amount};
      });
      that.setData({
        summary:{totalAssets:s.totalAssets.toFixed(0),totalLiabilities:s.totalLiabilities.toFixed(0),netWorth:s.netWorth.toFixed(0),count:s.count},
        list:l, ratesData:ratesData
      });
    });
  },
  onAdd:function(){ this.setData({showModal:true,editingId:null,form:{name:'',type:'bank',currency:'CNY',amountText:'',note:''}}); },
  onEdit:function(e){
    var d=e.currentTarget.dataset, code=d.currency||'CNY', rateText='';
    if(code!=='CNY'&&this.data.ratesData&&this.data.ratesData.rates){
      var r=this.data.ratesData.rates[code]; if(r) rateText='1 '+code+' ≈ '+(1/r).toFixed(4)+' CNY';
    }
    this.setData({showModal:true,editingId:d.id,rateText:rateText,form:{name:d.name,type:d.type,currency:code,amountText:String(d.amount),note:d.note}});
  },
  onDelete:function(e){ var id=e.currentTarget.dataset.id,that=this; wx.showModal({title:'删除确认',content:'确定删除这个账户吗？',confirmColor:'#F44336',success:function(r){ if(r.confirm){store.remove(id);that.load();wx.showToast({title:'已删除',icon:'success'});}}}); },
  onTypeSelect:function(e){ var f=this.data.form; f.type=e.currentTarget.dataset.type; if(f.type!=='forex'){f.currency='CNY';this.setData({rateText:''});} this.setData({form:f}); },
  onCurrencySelect:function(e){
    var f=this.data.form, code=e.currentTarget.dataset.code; f.currency=code;
    var rateText='';
    if(code!=='CNY'&&this.data.ratesData&&this.data.ratesData.rates){
      var r=this.data.ratesData.rates[code];
      if(r) rateText='1 '+code+' ≈ '+(1/r).toFixed(4)+' CNY';
    }
    this.setData({form:f, rateText:rateText});
  },
  onField:function(e){ var f=this.data.form; f[e.currentTarget.dataset.field]=e.detail.value; this.setData({form:f}); },
  onSave:function(){
    var f=this.data.form, a=parseFloat(f.amountText);
    if(!f.name.trim()){wx.showToast({title:'请输入名称',icon:'none'});return;} if(isNaN(a)){wx.showToast({title:'请输入有效金额',icon:'none'});return;}
    if(this.data.editingId) store.update(this.data.editingId,{name:f.name.trim(),type:f.type,amount:a,currency:f.currency,note:f.note.trim()});
    else store.add({name:f.name.trim(),type:f.type,amount:a,currency:f.currency,note:f.note.trim()});
    this.setData({showModal:false}); this.load(); wx.showToast({title:this.data.editingId?'已保存':'已添加',icon:'success'});
  },
  closeModal:function(){ this.setData({showModal:false}); },
  prevent:function(){},
  goHome:function(){ var p=getCurrentPages(); if(p.length>1)wx.navigateBack({delta:99}); else wx.reLaunch({url:'/pages/dashboard/dashboard'}); }
});
