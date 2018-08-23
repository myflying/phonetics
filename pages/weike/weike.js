const common = require('../../utils/common.js')

const app = getApp()
var list = null
var page = 1
var pSize = 20
var end = false
var nodata = false
var code
var wid

var isPayUser = false
var gid
var vipState
var isClick = false 
var userInfo
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_dialog: false,
    viparray: [{
      'vip_title': '音标点读会员',
      'vip_desp': '每天十分钟，十天就会读拼音',
    }],
    vip_options_checked: '../../images/vip_item_checked.png',
    vip_options_normal: '../../images/vip_item_normal.png',
    cindex: -1,
    paid_user: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '微课列表',
    })
    this.getPayInfo();

    wid = options.uid
    console.log('wid--->' + wid)
    this.loadData();
  },

  onShow: function(e) {
    var state = app.globalData.vipState
    console.log('user vip state--->' + state)
    if (state) {
      if (state > 0) {
        this.setData({
          paid_user: true
        })
        isPayUser = true
      }
    }

    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        userInfo = res.data
      }
    })
  },

  loadData: function() {
    var that = this
    let url = "https://yb.bshu.com/api/v1.index/weikelist"
    var rdata = {
      'wid': wid
    }
    let header = common.gethead(rdata)
    wx.request({
      url: url,
      data: rdata,
      method: 'POST',
      header: header,
      success: function(result) {
        console.log(result.data.data)
        that.setData({
          weikelist: result.data.data
        })
      }
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
  onReachBottom: function(e) {
    this.loadData();
  },

  weikedetail: function(e) {
    var is_vip = e.currentTarget.dataset.vip
    console.log('weike is_vip--->' + is_vip)
    if (!isPayUser && is_vip == 1) {
      this.setData({
        show_dialog: true
      })
      return
    } else {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/weikedetail/weikedetail?id=' + id
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
    isClick = true
    var index = e.currentTarget.dataset.i
    this.setData({
      cindex: index
    })

    gid = app.globalData.payInfo[index].id
  },

  pay: function(e) {
    if (!isClick) {
      wx.showToast({
        title: '请选择购买的套餐',
        icon: 'none'
      })
      return
    }
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
          fail: function(res) {
            console.log('pay fail')
            wx.showToast({
              title: '支付失败',
            })
          }
        })
      }
    })
  },

  onShareAppMessage: function() {

  }
})