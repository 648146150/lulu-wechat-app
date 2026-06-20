var KEY='asset_accounts';
function getAll(){ return wx.getStorageSync(KEY)||[]; }
function saveAll(a){ wx.setStorageSync(KEY,a); }
function genId(){ return 'ast_'+Date.now().toString(36)+'_'+Math.random().toString(36).substring(2,6); }
function add(a){ var l=getAll(); a.id=genId(); a.currency=a.currency||'CNY'; a.updateTime=new Date().toISOString(); l.unshift(a); saveAll(l); return a; }
function update(id,d){ var l=getAll(); for(var i=0;i<l.length;i++){ if(l[i].id===id){ l[i].name=d.name; l[i].type=d.type; l[i].amount=parseFloat(d.amount); l[i].currency=d.currency||l[i].currency||'CNY'; l[i].note=d.note||''; l[i].updateTime=new Date().toISOString(); break; } } saveAll(l); }
function remove(id){ saveAll(getAll().filter(function(a){ return a.id!==id; })); }
function toCNY(amount,currency,rates){ if(!rates||!rates.rates||currency==='CNY')return amount; var r=rates.rates[currency]; return r?parseFloat((amount/r).toFixed(2)):amount; }
function getSummary(rates){
  var l=getAll(),ta=0,tl=0;
  l.forEach(function(a){
    var v=toCNY(a.amount,a.currency||'CNY',rates);
    if(v>=0)ta+=v;else tl+=Math.abs(v);
  });
  return { totalAssets:ta, totalLiabilities:tl, netWorth:ta-tl, count:l.length };
}
module.exports = { getAll:getAll, add:add, update:update, remove:remove, getSummary:getSummary, toCNY:toCNY };
