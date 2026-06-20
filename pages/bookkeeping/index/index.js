var storage=require('../../../utils/storage');
Page({
  data:{ currentYear:2026,currentMonth:6,isCurrentMonth:true,summary:{income:'0.00',expense:'0.00',balance:'0.00'},categoryList:[],categoryTotal:'0.00',recentRecords:[] },
  onShow:function(){ this.load(); },
  load:function(){
    var y=this.data.currentYear,m=this.data.currentMonth;
    var sum=storage.getMonthSummary(y,m);
    this.setData({summary:{income:sum.income.toFixed(2),expense:sum.expense.toFixed(2),balance:sum.balance.toFixed(2)}});
    var bd=storage.getCategoryBreakdown(y,m);
    var cl=bd.list.filter(function(i){return i.amount>0;}).slice(0,5).map(function(i){return{category:i.category,emoji:i.emoji,amount:i.amount,amountText:i.amount.toFixed(2),percent:i.percent};});
    this.setData({categoryList:cl,categoryTotal:bd.totalExpense.toFixed(2)});
    var emojiMap={}; storage.EXPENSE_CATEGORIES.forEach(function(c){emojiMap[c.name]=c.emoji;}); storage.INCOME_CATEGORIES.forEach(function(c){emojiMap[c.name]=c.emoji;});
    var rr=storage.getMonthRecords(y,m).slice(0,5).map(function(r){return{id:r.id,type:r.type,category:r.category,categoryEmoji:emojiMap[r.category]||'📌',amount:r.amount.toFixed(2),date:r.date};});
    this.setData({recentRecords:rr});
  },
  prevMonth:function(){ var y=this.data.currentYear,m=this.data.currentMonth; if(m===1){y--;m=12;}else{m--;} this.setData({currentYear:y,currentMonth:m,isCurrentMonth:this.ck(y,m)}); this.load(); },
  nextMonth:function(){ if(this.data.isCurrentMonth)return; var y=this.data.currentYear,m=this.data.currentMonth; if(m===12){y++;m=1;}else{m++;} this.setData({currentYear:y,currentMonth:m,isCurrentMonth:this.ck(y,m)}); this.load(); },
  ck:function(y,m){ var n=new Date(); return y===n.getFullYear()&&m===n.getMonth()+1; },
  goAdd:function(){ wx.navigateTo({url:'/pages/bookkeeping/add/add'}); },
  goHistory:function(){ wx.navigateTo({url:'/pages/bookkeeping/history/history'}); },
  goHome:function(){ var p=getCurrentPages(); if(p.length>1)wx.navigateBack({delta:99}); else wx.reLaunch({url:'/pages/dashboard/dashboard'}); }
});