// pages/myPublishedDemandList/myPublishedDemandList.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
      scrollCount: 0,
      filter: 'time_asc'
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

          }
      })
  },

  updateDemandList: function(res) {
      // set data for list
      this.setData({
          demandList: res.data
      })
  },

  onTapDemand: function(e) {
      wx.navigateTo({
          url: '../myPublishedDemandDetails/myPublishedDemandDetails?demandID=' + e.detail.value.item,
      })
  },

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

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
