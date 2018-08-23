// pages/consonant/consonant.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  preStep: function (e) {
    wx.navigateBack();
  },

  trainAgain: function (e) {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  to_home: function () {
    console.log('home')
    wx.navigateBack({
      delta: 4
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})