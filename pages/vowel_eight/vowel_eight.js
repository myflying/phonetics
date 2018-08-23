const common = require('../../utils/common.js')
const app = getApp()
var innerAudioContext
var vowel_audio_src
var isPlaying = false
var isChoose = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testarray: '',
    play_img: '../../images/vowel_play.png',
    options_checked: '../../images/options_selected_icon.png',
    options_normal: '../../images/normal_options_icon.png',
    options_error: '../../images/options_error_icon.png',
    cindex: 0,
    oindex: 0,
    normal_play: '../../images/vowel_play.png',
    musicStatus: 'on',
    is_submit: false,
    pre_txt:'上一步',
    submit_txt:'提 交',
    top_num:8,
    progress_width:360
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })
    
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/test"
    var rdata = {
      'vid': app.globalData.currentVid || '',
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function (result) {
        console.log(result.data.data.list)
        that.setData({
          testarray: result.data.data.list,
          current_title: app.globalData.currentTitle
        })
      }
    })
  },
  onShow:function(e){
    isChoose = false
  },
  playWord: function (e) {
    var i = e.currentTarget.dataset.index
    if (this.data.cindex == i && isPlaying) {
      i = -1;
      isPlaying = false;
      this.stopMusic()
    } else {
      isPlaying = true
      vowel_audio_src = e.currentTarget.dataset.voice
      this.playMusic(vowel_audio_src, false)
    }

    this.setData({
      cindex: i,
      play_img: '../../images/vowel_playing.png'
    })
  },

  chooseoptions: function (e) {
    isChoose = true
    let index = e.currentTarget.dataset.i
    let item = this.data.testarray[index]
    item.checked = item.checked ? 0 : 1
    this.setData({
      testarray: this.data.testarray
    })
  },

  stopMusic() {
    if (this.innerAudioContext) {
      console.log('stop music --->')
      this.innerAudioContext.stop()
    }

    this.setData({
      cindex: -1,
      play_img: '../../images/vowel_play.png'
    })
  },

  playMusic(src, loop = false) {
    if (this.data.musicStatus != "on") {
      this.stopMusic()
      return
    }
    const innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext = innerAudioContext
    innerAudioContext.src = src
    innerAudioContext.loop = loop
    innerAudioContext.play()

    //播放结束
    innerAudioContext.onEnded(() => {
      isPlaying = false
      this.setData({
        cindex: -1,
        play_img: '../../images/vowel_play.png'
      })
    })
  },

  invisiable() {
    this.data.musicStatus = "off"
    this.stopMusic();
    isPlaying = false;
    if (this.loopInnerAudioContext) {
      this.loopInnerAudioContext.stop()
    }
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.invisiable()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.invisiable()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  preStep: function (e) {
    wx.navigateBack();
    // if (this.data.is_submit){
    //   console.log(this.data.is_submit)
    // }else{
    //   this.setData({
    //     is_submit: false,
    //     pre_txt: '上一步',
    //     submit_txt: '提 交',
    //     top_num: 8
    //   })
    // }
  },
  submitTest: function (e) {

    if (!isChoose){
      wx.showToast({
        title: '请选择正确项',
        icon:'none'
      })
      return
    }

    if (this.data.top_num == 8){
      this.setData({
        is_submit: true,
        pre_txt: '上一步',
        submit_txt: '完 成',
        top_num: 9,
        progress_width: 405
      })
    }else{
      if (this.data.is_submit) {
        console.log(this.data.is_submit)
        wx.reLaunch({
          url: '/pages/home/home'
        })
      }
    }
  },
  to_home: function () {
    console.log('home')
    wx.navigateBack({
      delta: 9
    });
  }
})