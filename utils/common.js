const md5 = require('./npm/md5/md5.js')
const sha256 = require('./npm/sha256/lib/sha256.js') 

module.exports = {
  encrypt: function(data) {
    let keys = Object.keys(data).sort()
    let str = ''
    for (let i = 0; i < keys.length; i++) {
      str += keys[i] + '=' + data[keys[i]] + '&';
    }
    if (str) {
      str = str.substring(0, str.lastIndexOf('&'))
    }
    console.log(str);
    let tk = md5(sha256(str))
    return tk;
  },
  gethead: function(data) {
    var head = {
      'content-type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };
    if (wx.getStorageSync('token')) {
      //console.log('获取缓存的token--->' + wx.getStorageSync('token'))
      head.Authorization = 'Bearer ' + wx.getStorageSync('token')
    }
    if (data) {
      head.TK = this.encrypt(data)
    }
    console.log(head);
    return head
  },
}