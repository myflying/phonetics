const common = require('../../utils/common.js')
var plugin = requirePlugin("WechatSI")
const app = getApp()
let manager = plugin.getRecordRecognitionManager()
var isRecord = false //是否开始录用
var innerAudioContext
var vowel_audio_src
var vowel_name
var isPlay = false //是否开始播放
var tapeResult
var tapeAudioPath //录音文件
var last_index = -1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouparray: '',
    audio_play_img: '../../images/audio_play_icon.png',
    play_tape_img: '../../images/play_tape_icon.png',
    tape_img: '../../images/tape_icon.png',
    tape_result: '',
    is_first: true,
    sensarray: [{
      'grouptitle': 'ee'
    },
    {
      'grouptitle': 'ae'
    }
    ],
    musicStatus: 'on',
    cindex: -1,
    is_first: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })

    var that = this
    let url = "https://yb.bshu.com/api/v1.index/sentence"
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
      success: function (result) {
        console.log(result.data.data)
        var temp = result.data.data

        for (var t = 0; t < temp.length; t++) {
          let itemphrase = ''
          var itemArray = temp[t].sentence.split(' ');
          for (var i = 0; i < itemArray.length; i++) {
            var itemStr = itemArray[i]
            itemphrase += app.changeWords(itemStr)
          }

          temp[t]['new_itemsens'] = itemphrase
        }

        that.setData({
          sensarray: temp
        })

        console.log(result.data.data[0])

        //vowel_audio_src = result.data.data[0].mp3
        //vowel_name = result.data.data[0].sentence.replace(new RegExp('#', 'g'), '').trim();
        console.log('vowel_name--->' + vowel_name)
      }
    })
  },

  phraseChecked: function (e) {
    console.log(e.currentTarget.dataset.index)
    tapeAudioPath = ''
    var item = e.currentTarget.dataset.item
    vowel_audio_src = item.mp3
    vowel_name = item.sentence.replace(new RegExp('#', 'g'), '').trim();
    console.log(vowel_audio_src)
    this.setData({
      cindex: e.currentTarget.dataset.index
    })
    this.readPhrase();
  },

  record: function () {
    var that = this
    manager.onRecognize = function (res) {
      console.log("current result", res.result)
      tapeResult = res.result
    }
    manager.onStop = function (res) {
      console.log("record file path", res.tempFilePath)
      console.log("listen result --->", res.result)
      tapeAudioPath = res.tempFilePath
      if (res.result) {
        tapeResult = res.result
      }

      var result_img
      if (tapeResult) {
        tapeResult = tapeResult.trim().toLowerCase()
        console.log('last char--->' + tapeResult.substr(tapeResult.length - 1, 1))
        if (tapeResult.length > 1 && tapeResult.substr(tapeResult.length - 1, 1) == ".") {
          tapeResult = tapeResult.substring(0, tapeResult.length - 1)
        }
        console.log('result===>' + tapeResult)

        if (that.compareResult(vowel_name, tapeResult)) {
          result_img = '../../images/listen_result_yes.png'
        } else {
          result_img = '../../images/listen_result_no.png'
        }

      } else {
        result_img = '../../images/listen_result_no.png'
      }

      that.setData({
        is_first: false,
        tape_result: result_img
      })
    }
    manager.onError = function (res) {
      console.error("error msg", res.msg)
    }

    if (isRecord) {
      manager.stop();
      isRecord = false
      this.setData({
        tape_img: '../../images/tape_icon.png'
      })
    } else {
      manager.start({
        lang: "en_US"
      })
      isRecord = true;
      this.setData({
        tape_img: '../../images/tapeing.gif'
      })
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
        audio_play_img: '../../images/vowel_play.png',
        play_tape_img: '../../images/play_tape_icon.png'
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

  readPhrase: function () {
    if (isPlay) {
      this.setData({
        audio_play_img: '../../images/vowel_play.png'
      })
      this.stopMusic()
    } else {

      if (!vowel_audio_src) {
        wx.showToast({
          title: '请选择句子后播放',
          icon: 'none'
        })
        return
      }

      this.setData({
        audio_play_img: '../../images/vowel_playing.png'
      })
      this.playMusic(vowel_audio_src, false)
    }
  },

  playTape: function (e) {
    if (isPlay) {
      this.setData({
        play_tape_img: '../../images/play_tape_icon.png'
      })
      this.stopMusic()
    } else {
      if (tapeAudioPath) {
        this.setData({
          play_tape_img: '../../images/play_tapeing_icon.gif'
        })
        this.playMusic(tapeAudioPath, false)
      } else {
        wx.showToast({
          title: '暂无录音文件'
        })
      }
    }
  },
  
  preStep:function(e){
   wx.navigateBack();
  },

  nextStep: function (e) {
    wx.navigateTo({
      url: '/pages/vowel_eight/vowel_eight',
    })
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

  compareResult: function (sourceSen, speakSen) {

    if (!sourceSen) {
      return;
    }
    if (!speakSen) {
      return;
    }

    var regEx = '/[,_ ]/'
    //按照句子结束符分割句子
    var words = sourceSen.split(' ');
    console.log('words')
    console.log(words)
    var sourceList = [];
    for (var i = 0; i < words.length; i++) {
      if (words[i]) {
        sourceList.push(words[i]);
      }
    }

    var speakList = []
    var speakWords = speakSen.split(' ');
    console.log('speakWords')
    console.log(speakWords)

    for (var m = 0; m < speakWords.length; m++) {
      if (speakWords[m]) {
        speakList.push(speakWords[m]);
      }
    }

    var matchCount = 0
    var percent = 0
    console.log(speakList)
    for (var n = 0; n < sourceList.length; n++) {
      console.log('sourceList value---' + sourceList[n])
      if (speakList.indexOf(sourceList[n]) != -1) {
        matchCount++;
        console.log('matchCount--->' + matchCount)
      }
    }

    if (matchCount > 0 && sourceList.length > 0) {
      percent = parseFloat(matchCount) / parseFloat(sourceList.length) * 100
    } else {
      return false;
    }
    console.log('percent--->' + percent)
    if (percent >= 60) {
      return true;
    } else {
      return false;
    }
  },
  to_home: function () {
    console.log('home')
    wx.navigateBack({
      delta: 8
    });
  }
})