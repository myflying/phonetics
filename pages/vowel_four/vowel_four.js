const common = require('../../utils/common.js')
const app = getApp()
var isPlay = false
var innerAudioContext
var vowel_audio_src

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cindex: -1,
    rindex:-1,
    musicStatus: 'on',
    read_play_img: '../../images/vowel_play.png',
    grouparray: [{
      'grouptitle': 'ee'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })
    
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/step4"
    var rdata = {
      'vid': app.globalData.currentVid || '',
      'vs': 0
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function(result) {
        console.log(result.data.data)
        
        var vowels = result.data.data;
        for(var i=0;i<vowels.length;i++){
          var itemname = vowels[i].name
          for (var j = 0; j < vowels[i].data.length;j++){
            var temp_word = vowels[i].data[j].word
            var temp_title = vowels[i].data[j].title.trim()
            vowels[i].data[j].word = temp_word.replace(temp_title, `<strong style='color:#30c065'>${temp_title}</strong>`)
          }
        }
        
        that.setData({
          grouparray: vowels,
          current_vowel: app.globalData.currentVowel || ''
        })
      }
    })
  },

  readVowel: function(e) {

    console.log(e.currentTarget.dataset.index)
    var temp_index = e.currentTarget.dataset.index
    vowel_audio_src = e.currentTarget.dataset.vowel
    console.log(vowel_audio_src)
    if (temp_index == this.data.cindex && isPlay) {
      isPlay = false;
      this.setData({
        cindex: -1,
        rindex: -1
      })
      this.stopMusic();
    } else {

      isPlay = true;
      this.setData({
        cindex: temp_index
      })

      if (this.data.musicStatus != "on") {
        this.stopMusic()
        return
      }

      const innerAudioContext = wx.createInnerAudioContext()
      this.innerAudioContext = innerAudioContext
      innerAudioContext.src = vowel_audio_src
      innerAudioContext.loop = false
      innerAudioContext.play()

      //播放结束
      innerAudioContext.onEnded(() => {
        isPlay = false
        this.setData({
          cindex: -1
        })
      })
    }
  },

  rightReadVowel: function (e) {

    console.log(e.currentTarget.dataset.index)
    var temp_index = e.currentTarget.dataset.index
    vowel_audio_src = e.currentTarget.dataset.vowel
    console.log(vowel_audio_src)
    if (temp_index == this.data.rindex && isPlay) {
      isPlay = false;
      this.setData({
        cindex: -1,
        rindex: -1
      })
      this.stopMusic();
    } else {

      isPlay = true;
      this.setData({
        rindex: temp_index
      })

      if (this.data.musicStatus != "on") {
        this.stopMusic()
        return
      }

      const innerAudioContext = wx.createInnerAudioContext()
      this.innerAudioContext = innerAudioContext
      innerAudioContext.src = vowel_audio_src
      innerAudioContext.loop = false
      innerAudioContext.play()

      //播放结束
      innerAudioContext.onEnded(() => {
        isPlay = false
        this.setData({
          rindex: -1
        })
      })
    }
  },

  stopMusic() {
    if (this.innerAudioContext) {
      console.log('stop music --->')
      this.innerAudioContext.stop()
    }
    isPlay = false;
    this.setData({
      cindex: -1,
      rindex:-1
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
      url: '/pages/vowel_five/vowel_five'
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
      delta: 5
    });
  }
})