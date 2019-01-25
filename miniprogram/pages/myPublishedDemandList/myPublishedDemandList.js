// pages/myPublishedDemandList/myPublishedDemandList.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
      scrollCount: 0,
      numberOfDemands: 0,
      order: 'time_asc',
      searchText: '',
      filterID: -1,
      tabText: [
          {
              'text': '最新',
              'entryID': 'time_desc',
              'child': [
                  { 'id': 'time_desc', 'text': '最新'   },
                  { 'id': 'time_asc', 'text': '最久'   },
                  { 'id': 'reward_desc', 'text': '报酬最高' },
                  { 'id': 'reward_asc', 'text': '报酬最低' },

              ],

          },
          {
              'text': '不限',
              'entryID': 0,
              'child': [
                  { 'id': 0, 'text': '不限'   },
                  { 'id': 1, 'text': '文理学部' },
                  { 'id': 2, 'text': '工学部'  },
                  { 'id': 3, 'text': '信息学部' },
                  { 'id': 4, 'text': '医学部'  },
              ]
          },
      ],
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
      if (!append) {
          this.setData({
              scrollCount: 0,
          })
      }
      wx.request({
          url: app.globalData.remoteServer + '/getDemandBrief',
          method: 'GET',
          data: {
              userID: app.globalData.userID,
              scrollCount: this.data.scrollCount,
              order: this.data.tabText[0].entryID,
              isPrivate: isPriv,
              searchText: (this.data.tabText[1].entryID == 0 ? '' : this.data.tabText[1].text)  + ' ' + this.data.searchText,
          },
          success: function(res) {
              console.log("success:" + res.data)
              callback(res, append)

          },
          fail: function(res) {
              console.log("failure:" + res)
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

      if (append) {
          if (res.data.length == 0) {
              if (this.data.scrollCount > 0) {
                  this.setData({
                      scrollCount: this.data.scrollCount - 1,
                  })
              }
          } else {
              this.setData({
                  demandList: this.data.demandList.concat(res.data),
              })
          }

      } else {
          this.setData({
              demandList: res.data,
          })
      }
      this.setData({
          numberOfDemands: this.data.demandList.length,
      })




  },

  onSearch: function(e) {
      console.log("onSearch:")
      console.log(e.detail.value)
      this.setData({
          searchText: e.detail.value.searchText,
      })
      this.fetchDemandBrief(this.updateDemandList, true, false)
  },

  onTapFilterTab: function(e) {
        console.log("onTapFilterTab:")
        var tabID = e.currentTarget.dataset.id
        if (tabID == this.data.filterID) {
            tabID = -1
        }
        console.log(tabID)
        this.setData({
            filterID: tabID,
        })
  },

  onTapFilterEntry: function(e) {
        console.log("oneTapFilterEntry:")
        var that = this
        var entryID = e.currentTarget.dataset.id
        var data = JSON.parse(JSON.stringify(that.data.tabText));
        //console.log(data[that.data.filterID].child[entryID].text)
        console.log(data[that.data.filterID])
        data[that.data.filterID].entryID = data[that.data.filterID].child[entryID].id
        data[that.data.filterID].text = data[that.data.filterID].child[entryID].text
        that.setData({
            filterID: -1,
            tabText: data,
        })
        this.fetchDemandBrief(this.updateDemandList, true, false)
  },



  onTapOrderChooser: function(e) {
        console.log("onTapOrderChooser:")
        var that = this
        var data = JSON.parse(JSON.stringify(that.data.tabText));
        var id = e.currentTarget.dataset.id;
        console.log(id)
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
                    order: 'time_desc'
                })
                break;
            case 2:
                that.setData({
                    order: 'time_asc'
                })
                break;
            case 3:
                that.setData({
                    order: 'reward_desc'
                })
                break;
            case 4:
                that.setData({
                    order:'reward_asc'
                })
                break;
            default:
                that.setData({
                    order: 'time_desc'
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
