// pages/category/category.js
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

  preStep: function (e) {
    wx.navigateBack();
  },

  nextStep:function(e){
    wx.navigateTo({
      url: '/pages/vowelintroduce/vowelintroduce',
    })
  },
  to_home: function () {
    console.log('home')
    wx.navigateBack({
      delta: 2
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})