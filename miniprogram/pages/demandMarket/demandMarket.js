const app = getApp()
Page({

    data:{
        scrollCount: 0,
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

    onLoad: function (options) {
        this.setData({
            serverAddress: app.globalData.remoteServer,
        })
        this.fetchDemandBrief(this.updateDemandList, false, false)
    },

    onSelectDemand: function(e) {
        wx.navigateTo({
            url: '../demandDetails/demandDetails?demandID=' + e.detail.value.demandID,

        })
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
        this.setData({
            searchText: e.detail.value.searchText,
        })
        this.fetchDemandBrief(this.updateDemandList, false, false)
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
              tabText: data,
          })
          this.fetchDemandBrief(this.updateDemandList, true, false)
    },

    onPullDownRefresh: function () {
        console.log("onPullDownRefresh:")
        wx.showNavigationBarLoading()
        setTimeout(()=>{
          //this.getData = '数据拿到了'
          this.fetchDemandBrief(this.updateDemandList, false, false)
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
        },3000)
    },

    onReachBottom: function () {
        console.log("onReachBottom:" + this.data.scrollCount)
        setTimeout(()=>{
            this.setData({
                scrollCount: this.data.scrollCount + 1,

            })
            this.fetchDemandBrief(this.updateDemandList, false, true)

        }, 360)
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

})
