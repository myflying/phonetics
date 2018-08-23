const common = require('../../utils/common.js')
//index.js
//获取应用实例
const app = getApp()
var userInfo
var vtype
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_login: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indicatorDots: true,
    banner: [{
      'simg': '../../images/banner_def.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '音标学习小助手',
    })
  },

  onShow: function(e) {
    var that = this
    wx.getStorage({
      key: 'user_info',
      success: function(res) {
        console.log(res.data)
        app.globalData.vipState = res.data.vip_state
        that.setData({
          is_login: true,
        })
      }
    })
  },
  vowelLearn: function() {
    vtype = 1
    wx.navigateTo({
      url: '../vowel/vowel?vtype=' + vtype,
    })
  },

  consonant: function () {
    vtype = 2
    wx.navigateTo({
      url: '../vowel/vowel?vtype=' + vtype,
    })
  },

  weike: function() {
    wx.navigateTo({
      url: '../wkhome/wkhome',
    })
  },

  vowelDesp: function() {
    wx.navigateTo({
      url: '../whatphonetic/whatphonetic',
    })
  },

  onGotUserInfo: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e.currentTarget.dataset.type)
    vtype = e.currentTarget.dataset.type

    var that = this
    wx.login({
      success: function(res) {
        wx.getUserInfo({
          lang: "zh_CN",
          success: function(userRes) {
            console.log("用户已授权")
            //console.log(userRes)
            if (null != userRes && null != userRes.userInfo) {
              var userData = userRes.userInfo;
              app.globalData.userInfo = userData;
              
              //获取用户的encryptedData，向服务器发起注册
              let url = "https://yb.bshu.com/api/v1.user/login"
              let data = {
                code: res.code,
                encryptedData: userRes.encryptedData,
                iv: userRes.iv,
                app_type: 'wx',
                app_id: 1
              }
              let header = common.gethead(data)
              wx.request({
                url: url,
                //注册
                data: data,
                method: 'POST',
                header: header,
                success: function(result) {
                  wx.hideLoading()
                  wx.setStorageSync('user_info', result.data.data)
                  console.log(result.data)
                  saveToken(result.data.data.token.token) //缓存token
                  
                  that.setData({
                    is_login: true
                  })

                  switch (parseInt(vtype)){
                    case 1:
                      that.vowelLearn()
                    break;
                    case 2:
                      that.consonant()
                    break;
                    case 3:
                      that.weike()
                      break;
                    case 4:
                      that.vowelDesp()
                      break;
                  }
                },
                fail: function(res) {

                },
              })
            }
          },
          fail: function(res) {

          }
        })
      },
      fail: function(res) {}
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})

function saveToken(token) {
  wx.setStorageSync('token', token)
}