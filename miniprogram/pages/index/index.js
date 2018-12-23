//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    someText: '发布需求',
    testTitle: '',
    testDescription: '',
    testReward: '',
  },

  onLoad: function(callback) {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }



    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    this.fetchDemand(this.updateDemand)
  },

  fetchDemand: function(callback) {
      var that = this
      wx.request({
      url: 'http://127.0.0.1:5000/getLatestDemand',  //这里''里面填写你的服务器API接口的路径
      data: {},  //这里是可以填写服务器需要的参数
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
      this.setData({
          testUser: res.data[0],
          testTitle: res.data[2],
          testDescription: res.data[3],
          testReward: res.data[4],
      })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  publishDemand: function(e) {
      this.setData({
          someText: "跳转中"
      })
      wx.navigateTo({
          url: '../publishDemand/publishDemand'
          //url: '../databaseGuide/databaseGuide',
      })
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
