var data = require("../../../services/data.js")
Page({
  data: {
    records: [{}, {}],
    food: [ ]

  },
  onLoad: function () {
    this.setData({
      food: data.shu
    })
  }

})
