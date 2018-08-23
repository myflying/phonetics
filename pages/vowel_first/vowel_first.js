const common = require('../../utils/common.js')
const app = getApp()
var innerAudioContext
var vowel_audio_src
var isPlay = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'sheep',
    rightvowel: '[fi:p]',
    musicStatus: 'on',
    play_state_img: '../../images/audio_play_icon.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { 
    
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })
    var vid = options.vid
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/step1"
    var rdata = {
      'vid': vid,
      'vs':'0'
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function(result) {
        console.log(result.data.data)
        var vowelObj = result.data.data
        
        vowel_audio_src = vowelObj.mp3
        var leftWord = vowelObj.word
        var rightWord = vowelObj.voice

        //left
        var temp_left = app.changeWords(leftWord)
        //right
        var temp_right = app.changeWords(rightWord)

        that.setData({
          left_word: temp_left,
          right_word: temp_right,
          vowel_bg: vowelObj.image,
          vowel_cn: vowelObj.cn,
          current_title: app.globalData.currentTitle
        })
      }
    })
  },

  stopMusic() {
    if (this.innerAudioContext) {
      console.log('stop music --->')
      this.innerAudioContext.stop()
    }
    isPlay = false;
    this.setData({
      play_state_img: '../../images/audio_play_icon.png'
    })
  },

  playMusic(src, loop = false) {
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

    this.setData({
      play_state_img: '../../images/audio_playing_icon.png'
    })
    
    //播放结束
    innerAudioContext.onEnded(() => {
      isPlay = false
      this.setData({
        play_state_img: '../../images/audio_play_icon.png'
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

  playVowel: function() {
    if (isPlay){
      this.stopMusic()
    }else{
      this.playMusic(vowel_audio_src, false)
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.invisiable()
  },

  /**

   * 生命周期函数--监听页面卸载

   */

  onUnload: function() {
    this.invisiable()
  },

  nextStep:function(){
    wx.navigateTo({
      url: '../vowel_second/vowel_second',
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
      delta:2
    });
  }
})