// pages/price_dialog/price_dialog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})

const showWin = {
  show: function() {
    this.setData({
      is_show: false
    })
  }
};