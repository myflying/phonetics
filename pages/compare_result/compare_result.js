Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouparray: [
      { 'grouptitle': 'ee' },
      { 'grouptitle': 'ae' },
      { 'grouptitle': 'be' }
    ],
    options_img: '../../images/normal_options_icon.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})