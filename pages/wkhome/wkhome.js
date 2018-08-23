const common = require('../../utils/common.js')

const app = getApp()
var list = null
var p = 1
var pSize = 20
var end = false
var nodata = false
var code

Page({

  /**
   * 页面的初始数据
   */
  data: {
    unitarray: [{
      'title': 'name'
    }, {
      'title': 'name'
    }, {
      'title': 'name'
    }, {
      'title': 'name'
    }, {
      'title': 'name'
    }, {
      'title': 'name'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '微课学习',
    })
    this.loadData();
  },

  loadData: function () {
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/weike"
    var rdata = {
      'page': p
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function (result) {
        console.log(result.data.data)
        that.setData({
          unitarray: result.data.data
        })
      }
    })
  },
  onReachBottom: function (e) {
    this.loadData();
  },
  weikeUnit:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/weike/weike?uid=' + id,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})