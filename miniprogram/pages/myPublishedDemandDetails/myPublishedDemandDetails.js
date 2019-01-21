const app = getApp()

Page({
    data: {
        demandID: 0,
        //applicants: null,


    },

    onLoad: function(options) {
        this.setData({
            demandID: options.demandID,
        })
        this.fetchDemand(this.updateDemand)
    },

    cancelDemand: function(e) {
        // send request and update display
        wx.request({
            url: app.globalData.remoteServer + '/cancelDemand',
            method: 'post',
            data: {
                demandID: this.data.demandID,

            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
                console.log(res.data)
            }
        })
        this.setData({
            isClosed: 1,
        })
    },

    onFinishDemand: function(e) {
        //send request and update display
        wx.reqeust({
            url: app.globalData.remoteServer + '/comfirmFinished',
            method: 'post',
            data: {
                demandID: this.data.demandID,

            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'  //这里注意POST请求content-type是小写，大写会报错
            },
            success: function (res) {
                console.log(res.data)

            }
        })
        this.setData({
            isFinished: 1,
            isClosed: 1,
        })
    },

    onTapApplicant: function(e) {
        wx.navigateTo({
            url: '../applicantDialog/applicantDialog?applicant=' + e.detail.value.item + '&demandID=' + this.data.demandID,
        })
    },

    fetchDemand: function(callback) {
        var that = this
        wx.request({
            url: app.globalData.remoteServer + '/getSpecificDemand',

            data: {
                demandID: this.data.demandID,
            },  //这里是可以填写服务器需要的参数
            method: 'GET', // 声明GET请求
        // header: {}, // 设置请求的 header，GET请求可以不填
        success: function(res){
            console.log("返回成功的数据:" + res.data ) //返回的会是对象，可以用JSON转字符串打印出来方便查看数据
            //var jsonres =
            console.log("返回成功的数据:"+ JSON.stringify(res.data)) //这样就可以愉快的看到后台的数据啦
            console.log(typeof res.data[1])
            callback(res)

        },
        fail: function(fail) {
          // 这里是失败的回调，取值方法同上,把res改一下就行了
        },
        complete: function(arr) {
          // 这里是请求以后返回的所以信息，请求方法同上，把res改一下就行了
        }
      })
  },

    updateDemand: function(res) {
        //var applicant_string = null
        this.setData({
            originalPoster: res.data[0],
            demandTitle: res.data[1],
            demandDescription: res.data[2],
            demandReward: res.data[3],
            acceptedApplicant: res.data[5],
            isFinished: res.data[6],
            isClosed: res.data[7],
        })
        if (res.data[4] != null) {
            this.setData({
                applicants: res.data[4].split(" ",)
            })
        }

    },



    confirmFinished: function(e) {
        wx.request({
            url: app.globalData.remoteServer + '/chooseApplicant',
            method: 'post',
            data: {
                demandID: this.data.demandID,
                isFinished: 1,

            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
                console.log(res.data)
            },
        })
    },

})
