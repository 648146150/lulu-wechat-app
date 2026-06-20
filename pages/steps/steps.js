Page({
  data:{ todaySteps:'--', goal:10000, percent:0, chartData:[] },
  onShow:function(){ this.load(); },
  load:function(){
    var that=this;
    wx.getWeRunData({
      success:function(r){
        if (!wx.cloud) { that.render({today:0,history:[]}); return; }
        wx.cloud.callFunction({
          name:'getWeRunData', data:{ encryptedData:r.encryptedData, iv:r.iv },
          success:function(cr){
            if(cr.result&&cr.result.stepInfoList){ var l=cr.result.stepInfoList; l.sort(function(a,b){return b.timestamp-a.timestamp;}); that.render({today:l[0]?l[0].step:0,history:l.slice(0,7)}); }
            else { that.render({today:0,history:[]}); }
          },
          fail:function(){ that.render({today:0,history:[]}); }
        });
      },
      fail:function(){ that.render({today:0,history:[]}); }
    });
  },
  render:function(d){
    var today=d.today||0, goal=10000, pct=today>0?Math.min(100,Math.round(today/goal*100)):0, max=0, chart=[];
    (d.history||[]).forEach(function(h){ if(h.step>max)max=h.step; });
    var ts=new Date().toDateString();
    (d.history||[]).forEach(function(h){
      var dt=new Date(h.timestamp*1000), lbs=['日','一','二','三','四','五','六'], hpx=max>0?Math.max(10,h.step/max*100):10;
      chart.push({height:hpx,isToday:dt.toDateString()===ts,valText:h.step>=1000?(h.step/1000).toFixed(1)+'k':String(h.step),label:lbs[dt.getDay()]});
    });
    this.setData({todaySteps:String(today),goal:goal,percent:pct,chartData:chart});
  },
  goHome:function(){ var p=getCurrentPages(); if(p.length>1)wx.navigateBack({delta:99}); else wx.reLaunch({url:'/pages/dashboard/dashboard'}); }
});