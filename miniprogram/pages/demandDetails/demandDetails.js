const app = getApp()


Page({
    data: {
        demandID:null,

    },

    onLoad: function (options) {
        this.setData({
            demandID: options.demandID,
        })
        this.fetchDemand(this.updateDemand)
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
            avatarUrl: res.data.avatarUrl,
            originalPoster: res.data.nickName,
            demandTitle: res.data.title,
            demandDescription: res.data.description,
            demandReward: res.data.reward,
            //acceptedApplicant: res.data.acceptedApplicant,
            //isFinished: res.data.isFinished,
            //isClosed: res.data.isClosed,
        })

    },


    submitProposal: function(e) {
        //send proposal to server and notify the demand poster.
        //post demandid, userid
        wx.request({
            url: app.globalData.remoteServer + '/addApplicant',
            method: 'post',
            data: {
                userID: app.globalData.userID,
                demandID: this.data.demandID,

            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',

            },
            success: function (res) {
                console.log(res.data)
            }
        })


    },

    chatWithPoster: function(e) {
        //open chat window with original poster.
        //to do this, a message system is needed.


    }
})
