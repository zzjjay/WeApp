//app.js
/* var Bmob = require('utils/bmob.js');
Bmob.initialize("fc4d9abc42d2db1f771d90229a0671b8", "5a1b22a7bec6626a7674f3ba14824c2a");*/
App({
  onLaunch: function () {
    require('utils/sdk-v1.5.0.js')
    wx.BaaS.init('f0b533861e980364aa2c')
/*
    var Diary = Bmob.Object.extend("diary");
    var diary = new Diary();
    diary.set("title", "zzj");
    diary.set("content", "zzjjay");
    //添加数据，第一个入口参数是null
    diary.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("日记创建成功, objectId:" + result.id);
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建日记失败');

      }
    });*/
   
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    change:0,
    sugarMin:0,
    sugarMax:0,
    openid:null
  }
})