     //index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pillToast:false,
    recordToast:false,
    types: ["1型糖尿病","2型糖尿病","妊娠型","特殊型","糖尿病前期","其他"],
    typesIndex:0,
    min:0,
    max:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindTypeChange: function (e) {
    this.setData({
      typesIndex: e.detail.value
      })
  },
  bindPill: function (e) {
    this.setData({
      pillToast: e.detail.value
    })
  },
  bindRecord: function (e) {
    this.setData({
      recordToast: e.detail.value
    })
  },
  minInput: function (e) {
    wx.setStorageSync('sugarMin', e.detail.value)
  },
  maxInput: function (e) {
    wx.setStorageSync('sugarMax', e.detail.value)
  },
  onLoad: function () {
    var Min = wx.getStorageSync('sugarMin') || 0;
    var Max = wx.getStorageSync('sugarMax') || 0;
    this.setData({
      min:Min,
      max:Max
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
