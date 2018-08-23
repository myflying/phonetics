// pages/whatphonetic/whatphonetic.js
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
  
  },

  nextStep :function(e){
    wx.navigateTo({
      url: '/pages/category/category',
    })
  },

  to_home: function () {
    console.log('home')
    wx.navigateBack({
      delta: 1
    });
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})