const app = getApp()

Page({
  data: {
      userID: 'testUser',
      demandTitle: '',
      demandDescription: '',
      demandReward: '',

  },



  uploadDemand: function(e) {
      var that = this //创建一个名为that的变量来保存this当前的值
      this.setData({
          demandTitle: e.detail.value.demandTitle,
      })
      wx.request({
          url: 'http://127.0.0.1:5000/submitDemand',
          method: 'post',
          data: {
            userID: this.data.userID,
            timestmp: '2018',
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
            console.log(res.data)
          }
    })

    },
}


)
