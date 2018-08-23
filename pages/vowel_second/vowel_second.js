const common = require('../../utils/common.js')
const app = getApp() 
var videoContext
var leftData
var rightData

var innerAudioContext
var vowel_audio_src
var isPlay = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    musicStatus: 'on',
    audio_play_img: '../../images/horn_icon.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/step2"
    var rdata = {
      'vid': app.globalData.currentVid || '',
      'vs': '0'
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function (result) {
        console.log(result.data.data)

        leftData = result.data.data.exp
        rightData = result.data.data.mouth
        vowel_audio_src = leftData.desp_mp3
        that.setData({
          //poster: leftData.cover,
          vowel_video_src: leftData.video_url,
          vowel_desp: leftData.desp,
          current_title: app.globalData.currentTitle
        })
      }
    })
  },

  onReady:function(res){
    this.videoContext = wx.createVideoContext('vowel_video')
  },

  //获取当前滑块的index
  bindchange: function(e) {
    console.log(e.detail.current)
    const that = this;
    that.setData({
      currentData: e.detail.current,
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.videoContext.pause()

      if (e.target.dataset.current == 0){
        console.log(leftData.desp)
        that.setData({
          vowel_video_src: leftData.video_url,
          currentData: e.target.dataset.current,
          vowel_desp: leftData.desp
        })
      }
      if (e.target.dataset.current == 1) {
        vowel_audio_src = rightData.desp_mp3

        that.setData({
          
          mouth_img : rightData.cover,
          currentData: e.target.dataset.current,
          vowel_desp: rightData.desp
        })
      }
    }
  },

  stopMusic() {
    if (this.innerAudioContext) {
      console.log('stop music --->')
      this.innerAudioContext.stop()
    }
    isPlay = false;
  },

  playMusic(src, loop = false) {
    console.log(src)
    if (this.data.musicStatus != "on") {
      this.stopMusic()
      return
    }
    isPlay = true
    const innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext = innerAudioContext
    innerAudioContext.src = src
    innerAudioContext.loop = loop
    innerAudioContext.play()

    //播放结束
    innerAudioContext.onEnded(() => {
      isPlay = false
      this.setData({
        audio_play_img: '../../images/horn_icon.png'
      })
    })
  },

  invisiable() {
    this.data.musicStatus = "off"
    this.stopMusic();
    if (this.loopInnerAudioContext) {
      this.loopInnerAudioContext.stop()
    }
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
    }
  },

  playChinese: function () {
    if (isPlay) {
      this.setData({
        audio_play_img: '../../images/horn_icon.png'
      })
      this.stopMusic()
    } else {
      this.setData({
        audio_play_img: '../../images/vowel_playing.png'
      })
      this.playMusic(vowel_audio_src, false)
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
  preStep:function(e){
    wx.navigateBack();
  },
  nextStep: function () {
    wx.navigateTo({
      url: '../vowel_three/vowel_three',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  to_home: function () {
    console.log('home')
    wx.navigateBack({
      delta: 3
    });
  }
})