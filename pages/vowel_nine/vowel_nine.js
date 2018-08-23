Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouparray: [
      { 'grouptitle': 'ee' },
      { 'grouptitle': 'ae' },
      { 'grouptitle': 'be' },
      { 'grouptitle': 'ce' },
      { 'grouptitle': 'ee' }
    ],
    options_img: '../../images/normal_options_icon.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })
  },

  chooseoptions: function (e) {
    console.log(e.currentTarget.dataset.i)
    this.setData({
      options_img: '../../images/options_selected_icon.png'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  to_home: function () {
    console.log('home')
    wx.navigateBack({
      delta: 10
    });
  }
})