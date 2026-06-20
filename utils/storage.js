var KEY = 'bill_records';
var EXPENSE_CATEGORIES = [
  { name:'餐饮', emoji:'🍽️' },{ name:'交通', emoji:'🚗' },{ name:'购物', emoji:'🛍️' },{ name:'娱乐', emoji:'🎮' },
  { name:'居家', emoji:'🏠' },{ name:'医疗', emoji:'💊' },{ name:'教育', emoji:'📚' },{ name:'其他', emoji:'💸' }
];
var INCOME_CATEGORIES = [
  { name:'工资', emoji:'💰' },{ name:'奖金', emoji:'🎁' },{ name:'兼职', emoji:'💼' },
  { name:'理财', emoji:'📈' },{ name:'退款', emoji:'↩️' },{ name:'其他', emoji:'📥' }
];
function genId(){ return 'bill_'+Date.now().toString(36)+'_'+Math.random().toString(36).substring(2,8); }
function getAll(){ return wx.getStorageSync(KEY)||[]; }
function saveAll(r){ wx.setStorageSync(KEY,r); }
function addRecord(r){ r.id=genId(); r.createTime=new Date().toISOString(); var a=getAll(); a.unshift(r); saveAll(a); return r; }
function deleteRecord(id){ saveAll(getAll().filter(function(r){ return r.id!==id; })); }
function getMonthRecords(y,m){
  var p=y+'-'+(m<10?'0'+m:m); return getAll().filter(function(r){ return r.date&&r.date.startsWith(p); });
}
function getMonthSummary(y,m){
  var records=getMonthRecords(y,m), income=0, expense=0;
  records.forEach(function(r){ if(r.type==='income') income+=r.amount; else expense+=r.amount; });
  return { income:income, expense:expense, balance:income-expense };
}
function getCategoryBreakdown(y,m){
  var records=getMonthRecords(y,m), map={};
  records.forEach(function(r){
    if(r.type==='expense'){ if(!map[r.category]) map[r.category]=0; map[r.category]+=r.amount; }
  });
  var total=0; Object.keys(map).forEach(function(k){ total+=map[k]; });
  var emojiMap={};
  EXPENSE_CATEGORIES.forEach(function(c){ emojiMap[c.name]=c.emoji; });
  INCOME_CATEGORIES.forEach(function(c){ emojiMap[c.name]=c.emoji; });
  var result=Object.keys(map).map(function(k){ return { category:k, emoji:emojiMap[k]||'📌', amount:map[k], percent:total>0?Math.round(map[k]/total*100):0 }; });
  result.sort(function(a,b){ return b.amount-a.amount; });
  return { list:result, totalExpense:total };
}
function getRecordsGroupedByDate(records){
  var source=records||getAll(), groups={};
  source.forEach(function(r){ if(!groups[r.date]) groups[r.date]=[]; groups[r.date].push(r); });
  var dates=Object.keys(groups); dates.sort(function(a,b){ return b.localeCompare(a); });
  return dates.map(function(d){ return { date:d, records:groups[d] }; });
}
module.exports = {
  EXPENSE_CATEGORIES:EXPENSE_CATEGORIES, INCOME_CATEGORIES:INCOME_CATEGORIES,
  getAllRecords:getAll, addRecord:addRecord, deleteRecord:deleteRecord,
  getMonthRecords:getMonthRecords, getMonthSummary:getMonthSummary,
  getCategoryBreakdown:getCategoryBreakdown, getRecordsGroupedByDate:getRecordsGroupedByDate
};