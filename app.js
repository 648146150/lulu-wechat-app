App({
  onLaunch: function() {
    console.log('工具箱启动');
    if (wx.cloud) {
      wx.cloud.init({ env: 'cloudbase-d7gypvgtm56308a81' });
    }
  }
});