
var app=getApp();
var BaaS=wx.BaaS
var productTableID=44250
var Product = new BaaS.TableObject(productTableID)

Page({
  data:{
    loading: true,
    time:"12:12"
  },
  onLoad:function(){
   
  },
  formSubmit: function (e) {
    var temp = {
      "touser": app.globalData.openid,//用户的openid
      "template_id": "Oqf8Ke1aiRrvUd8IRo5e4FpHvrld8YamAf8iCSDRdLc",//模板id 
      "page": "pages/index/index",
      "form_id": e.detail.formId,//表单id
      "data": {
        "keyword1": {
          "value": "服药提醒",
          // "color": "#173177"
        },
        "keyword2": {
          "value": "您的服药时间快到了喔"
        },
        "keyword3": {
          "value": "2018"
        },
      },
      "emphasis_keyword": "keyword1.DATA" //将keyword1放大
    }
    var product=Product.create()
    product.set('name','1')
    product.save().then((res)=>{
      console.log(e.detail.formId)
      BaaS.wxReportTicket(e.detail.formId)
      if(res.statusCode == 201){
        console.log('success')
      }else{
        console.log('fail')
      }
    })
  

  },
  goback:function(e) {
    wx.navigateBack()
  },


  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },


  


})