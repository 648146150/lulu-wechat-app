var store=require('../../utils/assets-storage');
var TYPES=[{key:'bank',icon:'🏦',name:'储蓄'},{key:'stock',icon:'📈',name:'股票'},{key:'fund',icon:'💼',name:'基金'},{key:'forex',icon:'💱',name:'外汇'},{key:'cash',icon:'💵',name:'现金'},{key:'other',icon:'📦',name:'其他'}];
function ti(k){ for(var i=0;i<TYPES.length;i++)if(TYPES[i].key===k)return TYPES[i]; return TYPES[TYPES.length-1]; }
Page({
  data:{
    summary:{totalAssets:'0',totalLiabilities:'0',netWorth:'0',count:0},list:[],types:TYPES,
    showModal:false,editingId:null,form:{name:'',type:'bank',amountText:'',note:''}
  },
  onShow:function(){ this.load(); },
  load:function(){
    var s=store.getSummary(), l=store.getAll().map(function(a){
      var t=ti(a.type), pos=a.amount>=0;
      return {id:a.id,name:a.name,type:a.type,displayAmount:(pos?'¥':'-¥')+Math.abs(a.amount).toFixed(2),cls:pos?'green':'red',note:a.note||'',typeIcon:t.icon,typeName:t.name,amount:a.amount};
    });
    this.setData({summary:{totalAssets:s.totalAssets.toFixed(0),totalLiabilities:s.totalLiabilities.toFixed(0),netWorth:s.netWorth.toFixed(0),count:s.count},list:l});
  },
  onAdd:function(){ this.setData({showModal:true,editingId:null,form:{name:'',type:'bank',amountText:'',note:''}}); },
  onEdit:function(e){ var d=e.currentTarget.dataset; this.setData({showModal:true,editingId:d.id,form:{name:d.name,type:d.type,amountText:String(d.amount),note:d.note}}); },
  onDelete:function(e){ var id=e.currentTarget.dataset.id,that=this; wx.showModal({title:'删除确认',content:'确定删除这个账户吗？',confirmColor:'#F44336',success:function(r){ if(r.confirm){store.remove(id);that.load();wx.showToast({title:'已删除',icon:'success'});}}}); },
  onTypeSelect:function(e){ var f=this.data.form; f.type=e.currentTarget.dataset.type; this.setData({form:f}); },
  onField:function(e){ var f=this.data.form; f[e.currentTarget.dataset.field]=e.detail.value; this.setData({form:f}); },
  onSave:function(){
    var f=this.data.form, a=parseFloat(f.amountText);
    if(!f.name.trim()){wx.showToast({title:'请输入名称',icon:'none'});return;} if(isNaN(a)){wx.showToast({title:'请输入有效金额',icon:'none'});return;}
    if(this.data.editingId) store.update(this.data.editingId,{name:f.name.trim(),type:f.type,amount:a,note:f.note.trim()});
    else store.add({name:f.name.trim(),type:f.type,amount:a,note:f.note.trim()});
    this.setData({showModal:false}); this.load(); wx.showToast({title:this.data.editingId?'已保存':'已添加',icon:'success'});
  },
  closeModal:function(){ this.setData({showModal:false}); },
  prevent:function(){},
  goHome:function(){ var p=getCurrentPages(); if(p.length>1)wx.navigateBack({delta:99}); else wx.reLaunch({url:'/pages/dashboard/dashboard'}); }
});