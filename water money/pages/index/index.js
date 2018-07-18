//index.js
var app = getApp()

Page({
  data: {
    records: [{}],
    length:0,  //已记录数据个数
    startX: 0, //开始坐标
    startY: 0
  },
  //事件处理函数
  recordTap: function() {
    wx.navigateTo({
      url: '../record/record?act='+0
    })
  },
  onLoad: function () {

  },
  onShow:function(){
    var that = this;
    wx.getStorage({
      key: 'sugar',
      success: function (res) {
        console.log(res.data);
        that.setData({
          records:res.data,
          length:res.data.length
        })
      }
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.records.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      records: this.data.records
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.records.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      records: that.data.records
    })
  },
  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var index = e.currentTarget.dataset.index
    this.data.records.splice(index,1)
    this.setData({
      records: this.data.records
    })
    app.globalData.change=1;  //数据已改变
    console.log(app.globalData.change)
    wx.setStorageSync('sugar', this.data.records)
    wx.showToast({
      title: '已删除',
      icon: 'success',
      duration: 2000
    })
    this.onShow()
  }
  
})
