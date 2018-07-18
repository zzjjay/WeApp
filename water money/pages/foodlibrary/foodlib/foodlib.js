//index.js
//获取应用实例
var app = getApp()
var arr_name = ["主食类", "豆制品", "蔬菜类", "水果类", "奶类", "混合膳食"]
var arr_name2 = ["../zhushi/zhushi", "../dou/dou", "../shu/shu", "../shui/shui", "../nai/nai","../mix/mix"]

var file = "/pages/foodlib/foodlib"
Page({
  data: {
    items: [{
      
      src: "/images/eat.png",
      text: arr_name[0],
      text2: arr_name2[0]
    }, {
     
      src: "/images/bean.png",
      text: arr_name[1],
      text2: arr_name2[1]
    }, {
      
      src: "/images/vegetable.png",
      text: arr_name[2],
      text2: arr_name2[2]
    }, {
     
      src: "/images/fruit.png",
      text: arr_name[3],
      text2: arr_name2[3]
    }, {
     
      src: "/images/milk.png",
      text: arr_name[4],
      text2: arr_name2[4]
    } ,{
  
      src: "/images/mix.png",
      text: arr_name[5],
      text2: arr_name2[5]
    }],
    url: file,
  },
  
})
