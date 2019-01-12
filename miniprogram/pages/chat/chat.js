const app = getApp()

Page({
    data: {
        fromUser: null,
        toUser: null,
    },


    fetchMessages: function(e) {
        // request messages between the two users.
    }


    sendMessage: function(e) {
        wx.request({
            url: app.globalData.remoteServer + '/sendMessage',
            method: 'post',
            data: {
                message: e.detail.value.message,
                fromUser: this.data.fromUser,
                toUser: this.data.toUser,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
                console.log(res.data)
            }
        })
    },
})
