const app = getApp()
Page({

    data:{
        scrollCount: 0,
        filter: 'time_asc',

    },

    onLoad: function (options) {
        this.setData({
            serverAddress: app.globalData.remoteServer,
        })
        this.fetchDemandBrief(this.updateDemandList, false)
    },

    onSelectDemand: function(e) {
        wx.navigateTo({
            url: '../demandDetails/demandDetails?demandID=' + e.detail.value.demandID,

        })
    },

    fetchDemandBrief: function(callback, isPriv) {
        var that = this
        wx.request({
            url: app.globalData.remoteServer + '/getDemandBrief',
            method: 'GET',
            data: {
                scrollCount: this.data.scrollCount,
                filter: this.data.filter,
                isPrivate: isPriv,
            },
            success: function(res) {
                console.log("success:" + res.data)
                callback(res)

            },
            fail: function(res) {
                console.log("failure:" + res.data)
                if (this.data.scrollCount > 0) {
                    this.setData({
                        scrollCount: this.data.scrollCount - 1,
                    })
                }
            }
        })
    },

    updateDemandList: function(res) {
        // set data for list
        console.log(typeof res.data.length)
        if (res.data.length != 0) {
            if (this.data.demandList === undefined) {
                this.setData({
                    demandList: res.data,
                })
            } else {
                this.setData({
                    demandList: this.data.demandList.concat(res.data),
                })
            }
            this.setData({
                numberOfDemands: this.data.demandList.length,
            })
        } else {
            if (this.data.scrollCount > 0) {
                this.setData({
                    scrollCount: this.data.scrollCount - 1,
                })
            }
        }

    },

    onPullDownRefresh: function () {
        console.log("onPullDownRefresh:")
        wx.showNavigationBarLoading()
        setTimeout(()=>{
          //this.getData = '数据拿到了'
          this.fetchDemandBrief(this.updateDemandList, true)
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
        },3000)
    },

    onReachBottom: function () {
        console.log("onReachBottom:" + this.data.scrollCount)
        setTimeout(()=>{
            this.setData({
                scrollCount: this.data.scrollCount + 1,

            })
            this.fetchDemandBrief(this.updateDemandList, true)

        }, 360)
    },

})
