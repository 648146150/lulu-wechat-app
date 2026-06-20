var store=require('../../utils/period-storage');
Page({
  data:{ prediction:{daysUntil:null,predictedDate:'',avgCycle:0,lastStart:''}, calYear:2026,calMonth:6,isCurrentMonth:true, weekHeaders:['日','一','二','三','四','五','六'], calDays:[], history:[] },
  onShow:function(){ var n=new Date(); this.setData({calYear:n.getFullYear(),calMonth:n.getMonth()+1,isCurrentMonth:true}); this.load(); },
  load:function(){ this.setData({prediction:store.getPrediction(),history:store.getAll().slice(0,10)}); this.renderCal(); },
  renderCal:function(){
    var y=this.data.calYear,m=this.data.calMonth, pd=store.getMonthPeriodDays(y,m), pred=store.getPrediction();
    var today=store.formatDate(new Date()), predDays={};
    if(pred.predictedDate){ var p=new Date(pred.predictedDate); for(var i=-1;i<=1;i++){ var d=new Date(p); d.setDate(d.getDate()+i); predDays[store.formatDate(d)]=true; } }
    var dim=new Date(y,m,0).getDate(), fd=new Date(y,m-1,1).getDay(), cal=[];
    for(var i=0;i<fd;i++) cal.push({day:'',date:'',cls:'empty'});
    for(var d=1;d<=dim;d++){
      var ds=y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d), cls='';
      if(pd[ds]) cls='period'; else if(predDays[ds]) cls='predicted'; if(ds===today) cls+=' today';
      cal.push({day:d,date:ds,cls:cls});
    }
    this.setData({calDays:cal});
  },
  onDayTap:function(e){
    var date=e.currentTarget.dataset.date; if(!date)return;
    var that=this;
    wx.showActionSheet({itemList:['标记为经期开始','标记为经期结束','取消'],success:function(r){
      if(r.tapIndex===2)return;
      if(r.tapIndex===0) store.addRecord(date,date); else store.addRecord(store.getAll().length>0?store.getAll()[0].startDate:date,date);
      that.load(); wx.showToast({title:'已记录',icon:'success'});
    }});
  },
  onDelete:function(e){ var id=e.currentTarget.dataset.id,that=this; wx.showModal({title:'删除确认',content:'确定删除？',confirmColor:'#F44336',success:function(r){if(r.confirm){store.removeRecord(id);that.load();}}}); },
  prevMonth:function(){ var y=this.data.calYear,m=this.data.calMonth; if(m===1){y--;m=12;}else{m--;} var n=new Date(); this.setData({calYear:y,calMonth:m,isCurrentMonth:y===n.getFullYear()&&m===n.getMonth()+1},function(){this.renderCal();}); },
  nextMonth:function(){ if(this.data.isCurrentMonth)return; var y=this.data.calYear,m=this.data.calMonth; if(m===12){y++;m=1;}else{m++;} var n=new Date(); this.setData({calYear:y,calMonth:m,isCurrentMonth:y===n.getFullYear()&&m===n.getMonth()+1},function(){this.renderCal();}); },
  goHome:function(){ var p=getCurrentPages(); if(p.length>1)wx.navigateBack({delta:99}); else wx.reLaunch({url:'/pages/dashboard/dashboard'}); }
});