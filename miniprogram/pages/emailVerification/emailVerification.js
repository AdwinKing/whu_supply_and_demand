const app = getApp()


Page({
    data: {

    },

    submitEmail: function(e) {
        var emailText = e.detail.value.emailAddress
        if (emailText.endsWith('@whu.edu.cn')) {
            wx.request({
                url: app.globalData.remoteServer + '/submitEmail',
                method: 'post',
                data: {
                    userID: app.globalData.userID,
                    emailAddress: emailText,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'  //这里注意POST请求content-type是小写，大写会报错
                },
                success: function (res) {
                    console.log(res.data)
                }
            })
            this.setData({
                emailInfo: '发送成功',
            })
        } else {
            this.setData({
                emailInfo: '邮箱格式错误，请修改',
            })
        }
    }
})
