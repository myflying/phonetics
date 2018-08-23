const common = require('../../utils/common.js')
const app = getApp()
var videoContext
var selfLeftObj
var selfRightObj

var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()

var innerAudioContext
var vowel_audio_src
var vowel_name
var isPlay = false //是否开始播放
var tapeResult
var tapeAudioPath //录音文件
var vid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    self_currentData: 0,
    vs_currentData: 0,
    musicStatus: 'on',
    audio_play_img: '../../images/audio_play_icon.png',
    tape_img: '../../images/tape_icon.png',
    tape_result: '',
    voice_left_check : true,
    voice_right_check: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })

    vid = options.vid
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/step1"
    var rdata = {
      'vid': vid,
      'vs': '1'
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function(result) {
        console.log(result.data.data)
        selfLeftObj = result.data.data.self
        selfRightObj = result.data.data.vs
        vowel_audio_src = selfLeftObj.vowel_mp3
        that.setData({
          vowel_video_src: selfLeftObj.voice_video,
          vs_video_src: selfRightObj.voice_video,
          self_vowel: selfLeftObj.name,
          self_vowel_hint: selfLeftObj.voice_info,
          vs_vowel: selfRightObj.name,
          vs_vowel_hint: selfRightObj.voice_info,
          vowel_desp: selfLeftObj.desp
        })
      }
    })
  },

  onReady: function(res) {
    this.videoContext = wx.createVideoContext('vowel_video')
  },

  //获取当前滑块的index
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },

  selfBindchange: function(e) {
    const that = this;
    that.setData({
      self_currentData: e.detail.current
    })
  },

  vsBindchange: function(e) {
    const that = this;
    that.setData({
      vs_currentData: e.detail.current
    })
  },

  //点击切换，滑块index赋值
  checkCurrent: function(e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 0) {
        that.setData({
          currentData: e.target.dataset.current
        })
      }
      if (e.target.dataset.current == 1) {
        that.setData({
          vowel_desp: selfLeftObj.desp,
          currentData: e.target.dataset.current
        })
      }

      if (e.target.dataset.current == 2) {
        that.setData({
          vowel_desp: selfRightObj.desp,
          currentData: e.target.dataset.current
        })
      }
    }
  },

  //点击切换，滑块index赋值
  self_checkCurrent: function(e) {

    if (this.data.self_currentData === e.target.dataset.current) {
      return false;
    } else {
      this.videoContext.pause()

      if (e.target.dataset.current == 0) {
        this.setData({
          vowel_video_src: selfLeftObj.voice_video,
          self_currentData: e.target.dataset.current,
          vowel_desp: selfLeftObj.desp,
          mouth_img: selfLeftObj.image
        })
      }
      if (e.target.dataset.current == 1) {
        this.setData({
          self_currentData: e.target.dataset.current,
          vowel_desp: selfLeftObj.mouth_desp,
          mouth_img: selfLeftObj.mouth_cover
        })
      }
    }
  },

  //点击切换，滑块index赋值
  vs_checkCurrent: function(e) {

    if (this.data.vs_currentData === e.target.dataset.current) {
      return false;
    } else {
      this.videoContext.pause()

      if (e.target.dataset.current == 0) {
        this.setData({
          vs_vowel_video_src: selfRightObj.voice_video,
          vs_currentData: e.target.dataset.current,
          vowel_desp: selfRightObj.desp,
          vs_mouth_img: selfRightObj.image
        })
      }
      if (e.target.dataset.current == 1) {
        this.setData({
          vs_currentData: e.target.dataset.current,
          vowel_desp: selfRightObj.mouth_desp,
          vs_mouth_img: selfRightObj.mouth_cover
        })
      }
    }
  },

  voiceClick:function(e){
    var vindex = e.currentTarget.dataset.vindex
    console.log('vindex--->' + vindex)
    if(vindex == 1){
      this.setData({
        voice_left_check:true,
        voice_right_check:false
      })
      vowel_audio_src = selfLeftObj.vowel_mp3
    }
    if (vindex == 2) {
      this.setData({
        voice_left_check: false,
        voice_right_check: true
      })
      vowel_audio_src = selfRightObj.vowel_mp3
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
        audio_play_img: '../../images/vowel_play.png'
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

  readWord: function () {
    if (isPlay) {
      this.setData({
        audio_play_img: '../../images/vowel_play.png'
      })
      this.stopMusic()
    } else {
      this.setData({
        audio_play_img: '../../images/vowel_playing.png'
      })
      this.playMusic(vowel_audio_src, false)
    }
  },

  preStep: function(e) {
    wx.navigateBack();
  },
  nextStep: function(e) {
    wx.navigateTo({
      url: '/pages/compare_practice/compare_practice?vid='+vid,
    })
  },
  to_home: function() {
    console.log('home')
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})