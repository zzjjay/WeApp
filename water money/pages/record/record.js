import { formatTime, formatDate } from '../../utils/util.js'
var app = getApp()
var renew = 0;
var index = 0;
Page({
  data: {
    numbers:0,
    enableSave: false,
    text:"",
    date:"",
    time:"",
    act:0,  //0=new, 1=edit
    files:[],
    
    },
  addNumber: function(e){
    this.setData({
      numbers: e.detail.value,
      enableSave: true
    })
    app.globalData.change = 1; //数据已改变
  },
  addText: function (e) {
    this.setData({
      text: e.detail.value,
    })
  },
  save: function(){
    var sugar = wx.getStorageSync('sugar') || []  
    if(this.data.act==0)
    {
      this.data.date = formatDate(new Date());
      this.data.time = formatTime(new Date());
      sugar.push(this.data)
      wx.setStorageSync('sugar', sugar)
      wx.navigateBack()
    }
    else{
      sugar[index].numbers = this.data.numbers;
      sugar[index].text = this.data.text;
      sugar[index].files = this.data.files;
      wx.setStorageSync('sugar', sugar)
      wx.navigateBack()
    }
  },
 
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  deleteImage: function (e) {
    var imgs = this.data.files;
    var i = e.currentTarget.dataset.index;
    imgs.splice(i, 1);
    this.setData({
      files: imgs
    });
  },

  onLoad: function (e) {
    this.setData({
      act: e.act
    })
    var that=this;

    if(that.data.act==1)
    {
      var sugar = wx.getStorageSync('sugar') || []
      index = e.index
      that.setData({
        numbers:sugar[index].numbers,
        text: sugar[index].text,
        enableSave:true,
        files:sugar[index].files
      })
    }
  }
 

})