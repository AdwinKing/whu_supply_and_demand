const app = getApp()
//var util = require('utils.js');

Page({
  data: {
      userid: 'testUser',
      timestamp: '',
      demandTitle: '',
      demandDescription: '',
      demandReward: '',

  },



  uploadDemand: function(e) {
      var that = this //创建一个名为that的变量来保存this当前的值
      this.setData({
          demandTitle: e.detail.value.demandTitle,
      })
      var tstamp = Date.parse(new Date());
      wx.request({
          url: 'http://127.0.0.1:5000/submitDemand',
          method: 'post',
          data: {
            userid: this.data.userid,
            timestamp: tstamp.toString(),
            demandTitle: e.detail.value.demandTitle,
            demandDescription: e.detail.value.demandDescription,
            demandReward: e.detail.value.demandReward,

          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'  //这里注意POST请求content-type是小写，大写会报错
          },
          success: function (res) {
            that.setData({ //这里是修改data的值
              test: res.data //test等于服务器返回来的数据
            });
            //console.log(typeof res.data)
            console.log(res.data)

          }
    })

    },
}


)
