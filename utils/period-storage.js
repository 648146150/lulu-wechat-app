var KEY='period_records';
function getAll(){ return wx.getStorageSync(KEY)||[]; }
function saveAll(a){ wx.setStorageSync(KEY,a); }
function addRecord(start,end){ var l=getAll(); l.unshift({ id:'pd_'+Date.now().toString(36), startDate:start, endDate:end||start, createTime:new Date().toISOString() }); l.sort(function(a,b){ return b.startDate.localeCompare(a.startDate); }); saveAll(l); return l[0]; }
function removeRecord(id){ saveAll(getAll().filter(function(r){ return r.id!==id; })); }
function fmt(d){ return d.getFullYear()+'-'+(d.getMonth()+1<10?'0'+(d.getMonth()+1):d.getMonth()+1)+'-'+(d.getDate()<10?'0'+d.getDate():d.getDate()); }
function addDays(s,n){ var d=new Date(s); d.setDate(d.getDate()+n); return fmt(d); }
function db(d1,d2){ return Math.round((new Date(d2)-new Date(d1))/86400000); }
function getPrediction(){
  var l=getAll(); if(l.length<1) return { daysUntil:null, predictedDate:'', avgCycle:0, lastStart:'' };
  var last=l[0].startDate;
  if(l.length<2){ var p=addDays(last,28), t=fmt(new Date()); return { daysUntil:Math.max(0,db(t,p)), predictedDate:p, avgCycle:28, lastStart:last }; }
  var tc=0, cnt=0;
  for(var i=0;i<l.length-1;i++){ var d=db(l[i+1].startDate,l[i].startDate); if(d>=18&&d<=45){ tc+=d; cnt++; } }
  var avg=cnt>0?Math.round(tc/cnt):28, p=addDays(last,avg), t=fmt(new Date());
  return { daysUntil:Math.max(0,db(t,p)), predictedDate:p, avgCycle:avg, lastStart:last };
}
function getMonthPeriodDays(y,m){
  var l=getAll(), days={}, p=y+'-'+(m<10?'0'+m:m);
  l.forEach(function(r){
    var s=new Date(r.startDate), e=new Date(r.endDate||r.startDate);
    for(var d=new Date(s); d<=e; d.setDate(d.getDate()+1)){ var ds=fmt(d); if(ds.startsWith(p)) days[ds]=true; }
  });
  return days;
}
module.exports = { getAll:getAll, addRecord:addRecord, removeRecord:removeRecord, getPrediction:getPrediction, getMonthPeriodDays:getMonthPeriodDays, formatDate:fmt };
