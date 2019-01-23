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
      tabText: {
          'text': '排序',
          'originalText': '排序',
          'active': false,
          'child': [
              { 'id': 1, 'text': '最新'   },
              { 'id': 2, 'text': '最久'   },
              { 'id': 3, 'text': '报酬最高' },
              { 'id': 4, 'text': '报酬最低' },

          ],

      },
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
      this.setData({
          serverAddress: app.globalData.remoteServer,
      })
      this.fetchDemandBrief(this.updateDemandList, true, false)
  },

  fetchDemandBrief: function(callback, isPriv, append) {
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
              callback(res, append)

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

  updateDemandList: function(res, append) {
      // set data for list
      console.log(typeof res.data.length)
      if (res.data.length != 0) {
          if (!append) {
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

  onTapOrderChooser: function(e) {
        console.log("onTapOrderChooser:")
        var that = this
        var data = JSON.parse(JSON.stringify(that.data.tabText));
        var id = e.currentTarget.dataset.id;
        data.active = true
        this.setData({
            tabText: data
        })
  },

  onChooseOrder: function(e) {
      console.log("onChooseOrder:")
      var that = this
      var data = JSON.parse(JSON.stringify(that.data.tabText));
      var id = e.currentTarget.dataset.id;
      console.log(id)
      data.active = false
      data.text = data.child[id-1].text
      that.setData({
          scrollCount: 0,
          tabText: data,
      })
      switch (id) {
            case 1:
                that.setData({
                    filter: 'time_desc'
                })
                break;
            case 2:
                that.setData({
                    filter: 'time_asc'
                })
                break;
            case 3:
                that.setData({
                    filter: 'reward_desc'
                })
                break;
            case 4:
                that.setData({
                    filter:'reward_asc'
                })
                break;
            default:
                that.setData({
                    filter: 'time_desc'
                })

      }
      this.fetchDemandBrief(this.updateDemandList, true, false)
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
        this.fetchDemandBrief(this.updateDemandList, true, false)
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
          this.fetchDemandBrief(this.updateDemandList, true, true)

      }, 360)
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
