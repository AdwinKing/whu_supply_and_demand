const app = getApp()

Page({
    data: {
        demandID: 0,

    },

    chooseApplicant: function(e) {
        // post applicant and demandID
        wx.request({
            url: app.globalData.remoteServer + '/chooseApplicant',
            method: 'post',
            data: {
                demandID: this.data.demandID,
                applicant: //maybe from e

            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
                console.log(res.data)
            },
        })

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
