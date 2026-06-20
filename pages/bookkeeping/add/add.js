var storage=require('../../../utils/storage');
Page({
  data:{ type:'expense',amount:'',categories:storage.EXPENSE_CATEGORIES,selectedCategory:'',note:'',date:'' },
  onLoad:function(){ var n=new Date(); this.setData({date:n.getFullYear()+'-'+(n.getMonth()+1<10?'0'+(n.getMonth()+1):n.getMonth()+1)+'-'+(n.getDate()<10?'0'+n.getDate():n.getDate())}); },
  switchType:function(e){
    var t=e.currentTarget.dataset.type;
    this.setData({type:t,categories:t==='income'?storage.INCOME_CATEGORIES:storage.EXPENSE_CATEGORIES,selectedCategory:''});
  },
  onAmount:function(e){ this.setData({amount:e.detail.value}); },
  selCat:function(e){ this.setData({selectedCategory:e.currentTarget.dataset.name}); },
  onNote:function(e){ this.setData({note:e.detail.value}); },
  onDate:function(e){ this.setData({date:e.detail.value}); },
  saveRecord:function(){
    var a=parseFloat(this.data.amount);
    if(isNaN(a)||a<=0){wx.showToast({title:'请输入正确的金额',icon:'none'});return;}
    if(!this.data.selectedCategory){wx.showToast({title:'请选择一个分类',icon:'none'});return;}
    storage.addRecord({type:this.data.type,amount:a,category:this.data.selectedCategory,note:this.data.note||'',date:this.data.date});
    wx.showToast({title:'保存成功',icon:'success'}); var that=this; setTimeout(function(){wx.navigateBack();},1500);
  },
  goHome:function(){ var p=getCurrentPages(); if(p.length>1)wx.navigateBack({delta:99}); else wx.reLaunch({url:'/pages/dashboard/dashboard'}); }
});