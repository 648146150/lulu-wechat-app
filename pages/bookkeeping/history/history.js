var storage=require('../../../utils/storage');
Page({
  data:{ currentYear:2026,currentMonth:6,isCurrentMonth:true,monthIncome:'0.00',monthExpense:'0.00',groups:[] },
  onShow:function(){ this.load(); },
  load:function(){
    var y=this.data.currentYear,m=this.data.currentMonth;
    var s=storage.getMonthSummary(y,m); this.setData({monthIncome:s.income.toFixed(2),monthExpense:s.expense.toFixed(2)});
    var records=storage.getMonthRecords(y,m);
    var em={}; storage.EXPENSE_CATEGORIES.forEach(function(c){em[c.name]=c.emoji;}); storage.INCOME_CATEGORIES.forEach(function(c){em[c.name]=c.emoji;});
    var groups=storage.getRecordsGroupedByDate(records).map(function(g){
      var di=0,de=0;
      var rs=g.records.map(function(r){
        if(r.type==='income')di+=r.amount;else de+=r.amount;
        return{id:r.id,type:r.type,category:r.category,emoji:em[r.category]||'📌',amount:r.amount.toFixed(2),note:r.note||''};
      });
      return{date:g.date,records:rs,dayIncome:di.toFixed(2),dayExpense:de.toFixed(2)};
    });
    this.setData({groups:groups});
  },
  prevMonth:function(){ var y=this.data.currentYear,m=this.data.currentMonth; if(m===1){y--;m=12;}else{m--;} this.setData({currentYear:y,currentMonth:m,isCurrentMonth:this.ck(y,m)}); this.load(); },
  nextMonth:function(){ if(this.data.isCurrentMonth)return; var y=this.data.currentYear,m=this.data.currentMonth; if(m===12){y++;m=1;}else{m++;} this.setData({currentYear:y,currentMonth:m,isCurrentMonth:this.ck(y,m)}); this.load(); },
  ck:function(y,m){ var n=new Date(); return y===n.getFullYear()&&m===n.getMonth()+1; },
  deleteRecord:function(e){
    var id=e.currentTarget.dataset.id,that=this;
    wx.showModal({title:'删除确认',content:'确定删除这条记录吗？',confirmColor:'#F44336',success:function(r){if(r.confirm){storage.deleteRecord(id);that.load();wx.showToast({title:'已删除',icon:'success'});}}});
  },
  goAdd:function(){ wx.navigateTo({url:'/pages/bookkeeping/add/add'}); },
  goHome:function(){ var p=getCurrentPages(); if(p.length>1)wx.navigateBack({delta:99}); else wx.reLaunch({url:'/pages/dashboard/dashboard'}); }
});