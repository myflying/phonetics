const common = require('../../utils/common.js')
const app = getApp()
var innerAudioContext
var vowel_audio_src
var isPlay = false

var currentData
var current_page = 0
var choose_result = false
var isClicked = false
var cur_count = 3
var vid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicStatus: 'on',
    grouparray: '',
    play_state_img:'../../images/vowel_play.png',
    options_checked: '../../images/options_selected_icon.png',
    options_normal: '../../images/normal_options_icon.png',
    options_error: '../../images/options_error_icon.png',
    is_submit: false,
    cindex: -1,
    left_txt: '上一步',
    right_txt: '提交'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: app.globalData.vowel_type == 1 ? '元音学习' : '辅音学习',
    })
    
    isClicked = false
    current_page = 0;
    vid = options.vid
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/vs_group"
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
        app.globalData.test_array = result.data.data
        console.log(app.globalData.test_array)
        currentData = app.globalData.test_array[current_page]
        vowel_audio_src = currentData.mp3
        that.setData({
          grouparray: currentData.words,
          current_num: cur_count
        })
      }
    })
  },

  chooseoptions: function(e) {
    isClicked = true;
    let index = e.currentTarget.dataset.index
    let item = this.data.grouparray[index]
    console.log('index--->' + index)
    console.log(item)
    item.checked = item.checked ? 0 : 1
    choose_result = item.is_true == 1 ? true : false
    this.setData({
      cindex: index,
      grouparray: this.data.grouparray,
    })
  },

  preStep: function(e) {
    cur_count--;
    if (current_page == 0) {
     
      if (this.data.is_submit) {
        isClicked = false
        this.setData({
          grouparray: currentData.words,
          is_submit: false,
          left_txt: '上一步',
          right_txt: '提交',
          current_num: cur_count
        })
      }else{
        wx.navigateBack()
      }
    } else {
      current_page--
      if (current_page < 0) {
        current_page = 0
      }
      currentData = app.globalData.test_array[current_page]
      vowel_audio_src = currentData.mp3
      console.log(currentData)
      isClicked = false
      this.setData({
        grouparray: currentData.words,
        is_submit: false,
        left_txt: '上一步',
        right_txt: '提交',
        current_num: cur_count
      })
    }
  },
  nextStep: function(e) {
    if(!isClicked){
      wx.showToast({
        title: '请选择正确的答案',
        icon:'none'
      })
      return
    }
    cur_count++;
    if (this.data.is_submit) {
      console.log('page--->'+current_page)
      if (current_page < app.globalData.test_array.length){
        
        currentData = app.globalData.test_array[current_page]
        vowel_audio_src = currentData.mp3
        console.log(currentData)
        isClicked = false
        this.setData({
          grouparray: currentData.words,
          is_submit: false,
          left_txt: '上一步',
          right_txt: '提交',
          current_num: cur_count
        })
      }else{
        cur_count = 3;
        console.log('vvtype--->' + app.globalData.vowel_type)
        wx.redirectTo({
          url: '/pages/vowel/vowel?vtype=' + app.globalData.vowel_type
        })
      }
    } else {
      console.log('current_num-->' + cur_count)
      current_page++
      this.setData({
        is_submit: true,
        left_txt: choose_result ? '上一步' : '重新选择',
        right_txt: current_page == app.globalData.test_array.length ? '完成' : '下一步',
        current_num: cur_count
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

  playVowel: function () {
    if (isPlay) {
      this.stopMusic()
    } else {
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

  to_home: function () {
    console.log('home')
    wx.navigateBack({
      delta: 3
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})