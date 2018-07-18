var wxCharts = require("../../services/wxcharts.js");
import { formatTime, formatDate } from '../../utils/util.js'
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

const app = getApp();
var columnChart = null;
Page({
  data: {
    tabs: ["日", "周", "月"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    chartTitle: ['今日血糖数据', '本周血糖数据', '本月血糖数据'],
    sugarDay:{
        numbers: [],  //当天每次测得血糖值
        time: []  //每次测量时间
    },
    avgDay:{
      numbers:[],
      date:[]
    },
    min: 0,
    max: 0,
    highTime:0,
    normalTime:0,
    lowTime:0,
    highWeek: 0,
    normalWeek: 0,
    lowWeek: 0,
  },
  
  onLoad: function () {
    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  
  onReady: function (e) {
    var that=this;
    var records = wx.getStorageSync('sugar') || []
    var today = formatDate(new Date());
    for (var i = records.length - 1; i >= 0; i--) {
      if (records[i].date != today) break;
      this.data.sugarDay.numbers.unshift(Number(records[i].numbers))
      this.data.sugarDay.time.unshift(records[i].time)
    }
    this.judgeWeek(records);
    if (records[records.length - 1].date == today) {
      this.judge(records);
      this.chartDay();
    }
    console.log("show chart")
    this.accumulateAvg(records);
    this.chartWeek();
    this.chartMonth();
  },
  
  onShow:function(){
    var sugarMin = wx.getStorageSync('sugarMin') || 0;
    var sugarMax = wx.getStorageSync('sugarMax') || 0;
    var records = wx.getStorageSync('sugar') || [];
    if (sugarMin != this.data.min && sugarMin != this.data.min){
      this.setData({
        min: sugarMin,
        max: sugarMax
      })
      this.judge(records);
    }
    this.setData({
      min: sugarMin,
      max: sugarMax
    })
    if (app.globalData.change == 1)
    {  
      console.log("changed")
      this.data.sugarDay.numbers = []
      this.data.sugarDay.time = []
      var today = formatDate(new Date());
      for (var i = records.length-1; i >= 0; i--) {
        if(records[i].date!=today) break;
        this.data.sugarDay.numbers.unshift(Number(records[i].numbers))
        this.data.sugarDay.time.unshift(records[i].time)
      }
      this.judgeWeek(records);
      if (records[records.length - 1].date == today){
      this.judge(records);
      this.chartDay();
      }
      this.data.avgDay.numbers = []
      this.data.avgDay.date = []
      console.log(this.data.avgDay.Date)
      this.accumulateAvg(records);
      this.chartWeek();
      this.chartMonth();
      app.globalData.change = 0;
    } 
  },
  judgeWeek: function (records) {
    var high = 0, low = 0, normal = 0
    for (var i = records.length - 1; i >= 0; i--) {
      if (this.data.max == 0) break;
      if (Number(records[i].numbers) > this.data.max)
        high++;
      else if (Number(records[i].numbers) < this.data.min)
        low++;
      else normal++;
    }
    this.setData({
      highWeek: high,
      normalWeek: normal,
      lowWeek: low
    })
  },

  judge:function(records){
    var high = 0, low = 0, normal = 0
    var today = formatDate(new Date());
    for (var i = records.length - 1; i >= 0; i--) {
      if (this.data.max==0) break;
      if (records[i].date != today) break;
      if (Number(records[i].numbers) > this.data.max)
        high++;
      else if (Number(records[i].numbers) < this.data.min)
        low++;
      else normal++;
    }
    this.setData({
      highTime: high,
      normalTime: normal,
      lowTime: low
    })
  },
  
  accumulateAvg:function(records){
     
    var that = this;
    that.data.avgDay.date.push(records[0].date);
    console.log(this.data.avgDay.date)
    for (var i = 1,j = 0; i < records.length; i++)
    {
      if(that.data.avgDay.date[j]!=records[i].date)
      {
        that.data.avgDay.date.push(records[i].date);
        j++;
      }
    }
    console.log(that.data.avgDay.date.length)
    var temp = 0; var day = 0; var tempNumbers=0
    for (var i = 0,j = 0; i < records.length; i++) {
      if (that.data.avgDay.date[j] == records[i].date) {
        temp++;
        tempNumbers = Number(tempNumbers) + Number(records[i].numbers);
      }
      else {
        tempNumbers = (tempNumbers / temp).toPrecision(3);
        that.data.avgDay.numbers.push(Number(tempNumbers));
        tempNumbers = Number(records[i].numbers);
        temp=1;
        j++;
      }
    }
    tempNumbers = (tempNumbers / temp).toPrecision(3);
    that.data.avgDay.numbers.push(Number(tempNumbers));
    console.log(that.data.avgDay.numbers)
  },

  chartDay: function () {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    columnChart = new wxCharts({
      canvasId: 'columnCanvas-day',
      type: 'column',
      animation: true,
      categories: this.data.sugarDay.time,
      series: [{
        name: '血糖含量（mmol/L）',
        data: this.data.sugarDay.numbers,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
    });
  },

  chartWeek: function () {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    columnChart = new wxCharts({
      canvasId: 'columnCanvas-week',
      type: 'column',
      animation: true,
      categories: this.data.avgDay.date,
      series: [{
        name: '每日平均血糖含量（mmol/L）',
        data: this.data.avgDay.numbers,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
    });
  },

  chartMonth: function () {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    columnChart = new wxCharts({
      canvasId: 'columnCanvas-month',
      type: 'column',
      animation: true,
      categories: this.data.avgDay.date,
      series: [{
        name: '每日平均血糖含量（mmol/L）',
        data: this.data.avgDay.numbers,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
    });
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});