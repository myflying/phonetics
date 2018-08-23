const common = require('../../utils/common.js')
const app = getApp()
var gid
var vipState
var isPayUser = false
var vowel_type
var yyarray = ['前元音', '中元音', '后元音', '合口双元音', '集中双元音']
var fyarray = ['爆破音', '摩擦音', '破擦音', '鼻音', '舌侧音', '半元音']
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
    paid_user: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    vowel_type = options.vtype
    console.log('vowel_type--->' + vowel_type)
    
    app.globalData.vowel_type = vowel_type
    this.setData({
      vowel_titles: vowel_type == 1 ? yyarray:fyarray
    })

    wx.setNavigationBarTitle({
      title: vowel_type == 1 ?'元音学习':'辅音学习',
    })

    this.getPayInfo();

    var that = this
    let url = "https://yb.bshu.com/api/v1.index/vowel"
    var rdata = {
      'vowel_type': vowel_type
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
          vowelarray: result.data.data
        })
      }
    })
  },

  onShow: function(e) {
    var that = this
    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        console.log(res.data)
        userInfo = res.data
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

  voweldetail: function(e) {
    
    var obj = e.currentTarget.dataset.item
    console.log(obj)

    var yindex = e.currentTarget.dataset.yindex

    var vid = obj.id
    var currentVowel = obj.name
    var is_vip = obj.is_vip
    var vs = obj.vs
    
    var currentTitle
    if(vs == 0){
      currentTitle = yyarray[yindex] + currentVowel
    }else{
      currentTitle = fyarray[yindex] + currentVowel
    }
    
    app.globalData.currentVowel = currentVowel
    app.globalData.currentVid = vid
    app.globalData.currentTitle = currentTitle

    if (!isPayUser && is_vip == 1) {
      this.setData({
        show_dialog: true
      })
      return
    }
    if(vs == 0){
      wx.navigateTo({
        url: '../vowel_first/vowel_first?vid=' + vid,
      })
    }else{
      wx.navigateTo({
        url: '../compare_first/compare_first?vid=' + vid,
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

            if (userInfo){
              userInfo.vip_state = gid
            }
            
            wx.setStorage({
              key: 'user_info',
              data: userInfo
            })

            console.log('pay success')
            wx.showToast({
              title: '支付成功',
              icon:'success'
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

  introduce:function(e){
    wx.navigateTo({
      url: '/pages/whatphonetic/whatphonetic',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  to_home:function(){
    console.log('home')
    wx.navigateBack();
  }
})