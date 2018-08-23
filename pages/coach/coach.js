const common = require('../../utils/common.js')
const app = getApp()
var userInfo
var gid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_login: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: '1对1辅导',
    })
    
    var that = this
    let url = "https://yb.bshu.com/api/v1.one/oneToOne"
    var rdata = {}
    
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      success: function (result) {
        console.log(result.data)
        var courseInfo = result.data.info
        var goods = result.data.goods
        var comments = result.data.comment

        that.setData({
          user_count: courseInfo.use_num,
          desp_content:courseInfo.content,
          coach_title: courseInfo.name,
          video_url: courseInfo.video_url,
          now_price:goods[0].price,
          old_price: goods[0].orig,
          one_good_name: goods[0].name,
          two_good_name:goods[1].name,
          commentarray: comments,
          one_gid: goods[0].id,
          two_gid: goods[1].id
        })

      }
    })
  },
  onShow: function (e) {
    var that = this
    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        console.log(res.data)
        userInfo = res.data
        var state = res.data.vip_state
        app.globalData.vipState = state
        that.setData({
          is_login: true,
        })
      }
    })
  },
  pay: function (e) {
    
    console.log('gid--->'+e.currentTarget.dataset.gid)
    gid = e.currentTarget.dataset.gid

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
      success: function (result) {
        console.log('orders')
        console.log(result.data)
        var obj = result.data.data;
        wx.requestPayment({
          'timeStamp': obj.timeStamp + '',
          'nonceStr': obj.nonceStr,
          'package': obj.package,
          'signType': obj.signType,
          'paySign': obj.paySign,
          success: function (res) {
            console.log('pay success')

            if (userInfo) {
              userInfo.vip_state = gid
            }

            wx.setStorage({
              key: 'user_info',
              data: userInfo
            })

            wx.showToast({
              title: '支付成功',
            })
            that.hideModal();
          },
          fail: function (res) {
            console.log('pay fail')
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      }
    })
  },
  onGotUserInfo: function (e) {
   
    var that = this
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          lang: "zh_CN",
          success: function (userRes) {
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
                success: function (result) {
                  wx.setStorageSync('user_info', result.data.data)
                  console.log(result.data)
                  saveToken(result.data.data.token.token) //缓存token

                  that.setData({
                    is_login: true
                  })
                  wx.showToast({
                    title: '登录成功',
                    icon:'none'
                  })
                },
                fail: function (res) {

                },
              })
            }
          },
          fail: function (res) {

          }
        })
      },
      fail: function (res) { }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

function saveToken(token) {
  wx.setStorageSync('token', token)
}