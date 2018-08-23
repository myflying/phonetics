const common = require('../../utils/common.js')
//index.js
//获取应用实例
const app = getApp()
var userInfo
var gid
var vipState
var isPayUser = false
var vowel_type
var stype;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_login: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user_head: '../../images/user_head_def.png',
    show_dialog: false,
    viparray: [{
      'vip_title': '音标点读会员',
      'vip_desp': '每天十分钟，十天就会读拼音',
    }],
    vip_options_checked: '../../images/vip_item_checked.png',
    vip_options_normal: '../../images/vip_item_normal.png',
    cindex: -1,
    paid_user: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPayInfo();
  },

  onShow: function(e) {
    var that = this
    wx.getStorage({
      key: 'user_info',
      success: function(res) {
        userInfo = res.data
        console.log(userInfo)
        var nickName = userInfo ? userInfo.nick_name : ''
        var userHead = userInfo ? userInfo.face : that.data.user_head
        that.setData({
          is_login: nickName ? true : false,
          nick_name: nickName || '放牛娃的梦想',
          user_head: userHead || that.data.user_head
        })

        var state = res.data.vip_state
        app.globalData.vipState = state
        if (state) {
          if (state > 0) {
            that.setData({
              paid_user: true
            })
            isPayUser = true
          }
        }
      },
    })
  },

  onGotUserInfo: function(e) {
    stype = e.currentTarget.dataset.stype
    console.log('stype --->' + stype)
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
              console.log(userData)
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
                  var userObj = result.data.data
                  console.log(userObj)

                  wx.setStorageSync('user_info', userObj)
                  saveToken(userObj.token.token) //缓存token

                  if (userObj.vip_state > 0) {
                    that.setData({
                      paid_user: true
                    })
                    isPayUser = true
                  }
                  app.globalData.vipState = userObj.vip_state

                  that.setData({
                    is_login: true,
                    nick_name: userObj.nick_name,
                    user_head: userObj.face
                  })

                  if (parseInt(stype) == 1) {
                    that.openVip();
                  }
                  if (parseInt(stype) == 2) {
                    wx.navigateTo({
                      url: '/pages/myorder/myorder',
                    })
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

  getPayInfo() {
    if (!app.globalData.payInfo) {
      var that = this
      let url = "https://yb.bshu.com/api/v1.index/paySet"

      let header = common.gethead({})
      wx.request({
        url: url,
        data: {},
        method: 'POST',
        header: header,
        success: function(result) {
          console.log(result.data.data)
          app.globalData.payInfo = result.data.data
          that.setData({
            viparray: result.data.data
          })
        }
      })
    } else {
      this.setData({
        viparray: app.globalData.payInfo
      })
    }
  },

  openVip: function() {
    if (!isPayUser) {
      this.setData({
        show_dialog: true
      })
      return
    } else {
      wx.showToast({
        title: '会员可以使用全部付费音标及课程',
        icon: 'none'
      })
    }
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      show_dialog: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
  },

  vipChoose: function(e) {
    var index = e.currentTarget.dataset.i
    this.setData({
      cindex: index
    })

    gid = app.globalData.payInfo[index].id
  },

  pay: function(e) {
    console.log('gid--->' + gid)
    var that = this
    let url = "https://yb.bshu.com/api/v1.orders/createOrders"
    var rdata = {
      'app_id': 1,
      'gid': gid
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function(result) {
        console.log('orders')
        console.log(result.data)
        var obj = result.data.data;
        wx.requestPayment({
          'timeStamp': obj.timeStamp + '',
          'nonceStr': obj.nonceStr,
          'package': obj.package,
          'signType': obj.signType,
          'paySign': obj.paySign,
          success: function(res) {

            if (userInfo) {
              userInfo.vip_state = gid
            }

            wx.setStorage({
              key: 'user_info',
              data: userInfo
            })
            isPayUser = true
            console.log('pay success')
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            })
            that.hideModal();
          },
          fail: function(res) {
            console.log('pay fail')
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  myorder: function(e) {
    wx.navigateTo({
      url: '/pages/myorder/myorder',
    })
  },

  serviceNumber:function(e){
    wx.setClipboardData({
      data: 'pai201807',
      success: function (res) {
        wx.showToast({
          title: '客服号复制成功',
          icon:'none'
        })
      }
    })
  }
})

function saveToken(token) {
  wx.setStorageSync('token', token)
}