// pages/myPublishedDemandList/myPublishedDemandList.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
      scrollCount: 0,
      numberOfDemands: 0,
      filter: 'time_asc',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
      this.setData({
          serverAddress: app.globalData.remoteServer,
      })
      this.fetchDemandBrief(this.updateDemandList, true)
  },

  fetchDemandBrief: function(callback, isPriv) {
      var that = this
      wx.request({
          url: app.globalData.remoteServer + '/getDemandBrief',
          method: 'GET',
          data: {
              userID: app.globalData.userID,
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

  // onTouchStart: function(e) {
  //     console.log("onTouchStart:" + e.touches[0].pageY)
  // },
  //
  // onTouchEnd: function(e) {
  //     console.log("onTouchEnd:" + e.touches[0].pageY)
  //
  // },
  //
  // onTouchMove: function(e) {
  //     console.log("onTouchMove:" + e.touches[0].pageY)
  //
  // },
  //
  // onTapDemand: function(e) {
  //     wx.navigateTo({
  //         url: '../myPublishedDemandDetails/myPublishedDemandDetails?demandID=' + e.detail.value.item,
  //     })
  // },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
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

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
      console.log("onReachBottom:" + this.data.scrollCount)
      setTimeout(()=>{
          this.setData({
              scrollCount: this.data.scrollCount + 1,

          })
          this.fetchDemandBrief(this.updateDemandList, true)

      }, 360)
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
