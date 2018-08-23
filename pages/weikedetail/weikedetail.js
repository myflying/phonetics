const common = require('../../utils/common.js')
const app = getApp()
var videoContext
var id

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '微课详情',
    })
    
    id = options.id
    
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/getWeikeDetail"
    var rdata = {
      'id': id
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function (result) {
        console.log(result.data.data)
        var obj = result.data.data
        that.setData({
          user_num: obj.user_num,
          weike_title:obj.title,
          current_price: obj.current_price || '0',
          old_price: obj.original_price || '0',
          content_desp: obj.desp || '',
          is_vip:obj.is_vip,
          vowel_video_src:obj.url
        })
      }
    })
  },

  onShow: function (e) {
  },

  onReady: function (res) {
    this.videoContext = wx.createVideoContext('vowel_video')
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.videoContext.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.videoContext.pause()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})