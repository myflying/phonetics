const common = require('../../utils/common.js')
const app = getApp()
var innerAudioContext
var vowel_audio_src
var isPlay = false
var count = 0
var num = 80
var temp_count = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 60,
    read_count: 0,
    read_num: 0,
    musicStatus: 'on',
    video_play_img: '../../images/audio_play_icon.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })
    
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/step3"
    var rdata = {
      'vid': app.globalData.currentVid || '',
      'vs':0
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function(result) {
        console.log(result.data)
        vowel_audio_src = result.data.data.mp3

        that.setData({
          voice_img_path: result.data.data.image
        })
      }
    })
  },

  onReady: function(res) {
    const innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext = innerAudioContext
  },

  stopMusic() {
    if (this.innerAudioContext) {
      console.log('stop music --->')
      this.innerAudioContext.stop()
    }
    isPlay = false;
    this.setData({
      video_play_img: '../../images/audio_play_icon.png'
    })
  },

  playMusic(src, loop = false) {
    if (this.data.musicStatus != "on") {
      this.stopMusic()
      return
    }

    isPlay = true
    if (count == 0) {
      console.log('guide')
      this.innerAudioContext.src = '/pages/assets/audio/guide_01.mp3'
    } else {
      this.innerAudioContext.src = src
    }

    this.innerAudioContext.loop = loop
    this.innerAudioContext.play()

    this.setData({
      read_num: 0,
      read_count:0,
      video_play_img: '../../images/audio_playing_icon.png'
    })

    
    //播放结束
    this.innerAudioContext.onEnded(() => {
      count++;
      
      if (count > 0 && count < 6) {
        if (vowel_audio_src) {

          if(count % 2 == 1){

            temp_count++
            this.setData({
              read_count: temp_count,
              read_num: num * temp_count
            })

            this.innerAudioContext.src = vowel_audio_src
            this.innerAudioContext.play()
          }

          if (count % 2 == 0) {
            this.innerAudioContext.src = '/pages/assets/audio/guide_02.mp3'
            this.innerAudioContext.play()
          }
        }
      } else {
        isPlay = false
        count = 0;
        temp_count = 0;
        this.setData({
          read_count: 3,
          video_play_img: '../../images/audio_play_icon.png'
        })
      }
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

  readCount: function() {
    console.log('readCount')
    if (isPlay) {
      this.stopMusic()
    } else {
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
  preStep: function (e) {
    wx.navigateBack();
  },
  nextStep:function(){
    wx.navigateTo({
      url: '/pages/vowel_four/vowel_four',
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
      delta: 4
    });
  }
})