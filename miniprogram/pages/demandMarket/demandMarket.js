const app = getApp()
Page({

    data:{
        scrollCount: 0,
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
        wx.request({
            url: app.globalData.remoteServer + '/getDemandBrief',
            method: 'GET',
            data: {
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

    onReachBottom: function () {
        console.log("onReachBottom:" + this.data.scrollCount)
        setTimeout(()=>{
            this.setData({
                scrollCount: this.data.scrollCount + 1,

            })
            this.fetchDemandBrief(this.updateDemandList, true)

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
