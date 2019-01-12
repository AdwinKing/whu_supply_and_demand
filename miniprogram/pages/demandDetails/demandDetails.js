const app = getApp()


Page({
    data: {
        demandID:null,

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
