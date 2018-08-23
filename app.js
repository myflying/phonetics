//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // let str = "ssss#sB#o#b##2b#ssss2ss#b#"
    // let result = str.replace(/(#)(.*?)(#)/g, "<a>$2</a>")
    // console.log(result)
  },
  changeWords: function (str) {
    //var str = '#B#o#b#'
    var words = str.split('')
    var count = 0;
    for (let i = 0; i < words.length; i++) {
      var temp = words[i]
      if (temp == '#') {
        if (count % 2 == 0) {
          words[i] = `<strong style='color: #30c065'>`
        } else {
          words[i] = `</strong>`
        }
        count++;
      }
    }
    return words.join('') + `&nbsp;&nbsp;`
  },
  globalData: {
    userInfo: null,
    payInfo:null,
    userVip:null,
    currentVowel:null,
    currentVid:null,
    currentTitle:null,
    vowel_type:null,
    test_array:null,
    vipState:0
  }
})