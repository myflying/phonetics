const common = require('../../utils/common.js')
const app = getApp()
var innerAudioContext
var vowel_audio_src
var isPlay = false
var vid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicStatus: 'on',
    cindex: -1,
    rightindex: -1,
    grouparray: ''
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
    let url = "https://yb.bshu.com/api/v1.index/words_vs"
    var rdata = {
      'vid': vid
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function(result) {
        console.log(result.data.data[2])
        var temp_left_array = result.data.data[0]
        var temp_right_array = result.data.data[1]

        for (var i = 0; i < temp_left_array.length; i++) {
          var itemStr = temp_left_array[i].words
          var leftChar = itemStr.substring(0, itemStr.indexOf('#'));
          var leftkeyword = itemStr.substring(itemStr.indexOf('#') + 1, itemStr.lastIndexOf('#'))
          var leftLast = itemStr.substring(itemStr.lastIndexOf('#') + 1)

          var itemphrase = `${leftChar}<strong style='color:#30c065'>${leftkeyword}</strong>${leftLast}&nbsp;&nbsp;`
          temp_left_array[i]['new_word'] = itemphrase
        }

        for (var i = 0; i < temp_right_array.length; i++) {
          var rightItemStr = temp_right_array[i].words
          var rightChar = rightItemStr.substring(0, rightItemStr.indexOf('#'));
          var rightkeyword = rightItemStr.substring(rightItemStr.indexOf('#') + 1, rightItemStr.lastIndexOf('#'))
          var rightLast = rightItemStr.substring(rightItemStr.lastIndexOf('#') + 1)

          var rightitemphrase = `${rightChar}<strong style='color:#30c065'>${rightkeyword}</strong>${rightLast}&nbsp;&nbsp;`
          temp_right_array[i]['new_word'] = rightitemphrase
        }

        that.setData({
          leftarray: temp_left_array,
          rightarray: temp_right_array,
          left_word: result.data.data[2].vs,
          right_word: result.data.data[2].vowel
        })
      }
    })

  },

  chooseVowel: function(e) {
    var index = e.currentTarget.dataset.i
    console.log(index)

    if (index != this.data.cindex) {
      isPlay = false
    }

    this.setData({
      cindex: index,
      rightindex: -1
    })

    if (isPlay) {
      this.stopMusic()
    } else {
      vowel_audio_src = this.data.leftarray[index].mp3
      this.playMusic(vowel_audio_src, false)
    }
  },

  chooseRightVowel: function(e) {
    var index = e.currentTarget.dataset.i
    console.log(index)

    if (index != this.data.rightindex) {
      isPlay = false
    }

    this.setData({
      cindex: -1,
      rightindex: index
    })

    if (isPlay) {
      this.stopMusic()
    } else {
      vowel_audio_src = this.data.rightarray[index].mp3
      this.playMusic(vowel_audio_src, false)
    }
  },

  stopMusic() {
    if (this.innerAudioContext) {
      console.log('stop music --->')
      this.innerAudioContext.stop()
    }
    isPlay = false;
    this.setData({
      play_state_img: '../../images/vowel_play.png'
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
      play_state_img: '../../images/vowel_playing.png'
    })

    //播放结束
    innerAudioContext.onEnded(() => {
      isPlay = false
      this.setData({
        play_state_img: '../../images/vowel_play.png'
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  preStep: function(e) {
    wx.navigateBack();
  },
  nextStep: function(e) {
    wx.navigateTo({
      url: '/pages/compare_continue/compare_continue?vid='+vid,
    })
  },
  to_home: function() {
    console.log('home')
    wx.navigateBack({
      delta: 2
    });
  }
})