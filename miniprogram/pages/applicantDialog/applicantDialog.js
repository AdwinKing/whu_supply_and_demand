const app = getApp()

Page({
    data: {
        demandId: 0,
        applicant: null,
    },

    onLoad: function(options) {
        this.setData({
            demandID: options.demandID,
            applicant: options.applicant
        })
    },

    chatWith: function(e) {
        wx.navigateTo({
            url: '../chat/chat?applicant=' + this.data.applicant,
        })
    },

    chooseApplicant: function(e) {
        wx.request({
            url: app.globalData.remoteServer + '/chooseApplicant',
            method: 'post',
            data: {
                demandID: this.data.demandID,
                applicant: this.data.applicant,

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
