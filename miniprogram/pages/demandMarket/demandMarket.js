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

            }
        })
    },

    updateDemandList: function(res) {
        // set data for list
        this.setData({
            demandList: res.data
        })
    },

})
