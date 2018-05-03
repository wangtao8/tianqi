//app.js
var WXBizDataCrypt = require('./utils/WXBizDataCrypt.js');
var AppId = 'wx97b277a1b249d245'
var AppSecret = '6df978e4f0d3faed2fec012b76999442'
App({
  onLaunch: function () {
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口，获取 code
      wx.login({
        success: function (res) {
          //发起网络请求
          wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data:{
                  appid:AppId,
                  secret:AppSecret,
                  js_code:res.code,
                  grant_type:'authorization_code'
              },
              header: {  
                  "Content-Type": "application/x-www-form-urlencoded"
              }, 
              method: 'GET', 
              success: function(res){
                var pc = new WXBizDataCrypt(AppId, res.data.session_key)
                wx.getUserInfo({
                  success: function (res) {
                    var data = pc.decryptData(res.encryptedData , res.iv)
                    console.log('解密后 data: ', data)
                  }
                })
              },
              fail: function(res) {},
              complete: function(res) {}
          });
        }
      })
    }
  },
  globalData: {// 设置一个全局变量s
    userInfo: null
  }
})
