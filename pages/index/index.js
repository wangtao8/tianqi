//index.js
//获取应用实例
const app = getApp()
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt.js')// 解密微信运动 或 解密用户信息
const AppId = 'wx97b277a1b249d245'
const AppSecret = '6df978e4f0d3faed2fec012b76999442'
//app.getUserInfo()  //解密用户信息
const util = require('../../utils/util.js')// 获得气温  空气指数
const getFormatDate = require('../../utils/getTime.js') // 时间戳转标准时间
Page({
  data: {
    qiwen: '', // 气温信息
    lifestyle: null, // 生活指数信息
    lifeZs: { comf: '舒适度指数', cw: '洗车指数', drsg: '穿衣指数', flu: '感冒指数', sport: '运动指数', trav: '旅游指数', uv: '紫外线指数', air: '空气污染扩散条件指数'}, // 生活指数英文对应值
    opacity: 1, // 不透明度
    youjia: '', // 油价
    cha: false, // x显示状态
    inputVal: '', //输入框值
    focu: false, //输入框属否获得焦点
    userInfo: {}, //用户信息
    isSearch: 1, //如果已经请求回数据 状态为0 还没请求状态为1
    // runData: []
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '小哥哥，小姐姐出门儿必备！',
      path: 'pages/index/index',
    imageUrl:'http://img.taopic.com/uploads/allimg/140513/235059-14051312145473.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad:function(){
// 	var that = this
//  wx.login({
//    success: function (res) {
//      if (res.code) {
//      	var appid = 'wx97b277a1b249d245'
//      	var secret = '6df978e4f0d3faed2fec012b76999442'
//      	wx.request({
//         url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code',
//         header: {
//           'content-type': 'json'
//         },
//         success: function(res3){
//         	 var session_key = res3.data.session_key
//           that.getData(appid,session_key)
//         }
//       })
//      } else {
//        console.log('登录失败！' + res.errMsg)
//      }
//    }
//  })
    wx.getLocation({// 获取用户定位
      type: 'wgs84',
      success: res => {
        var latitude = res.latitude
        var longitude = res.longitude
        var location = longitude + ',' + latitude
        var _this = this
        util.gettianqi(_this, location)// 调用自定义方法，获得数据
      }
    })
    wx.getUserInfo({
      success: res => {
        var _this = this
        var userInfo = res.userInfo
        _this.setData({ userInfo: userInfo})
      }
    })
    // 音乐播放器
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = false
    innerAudioContext.loop = true
    console.log(innerAudioContext.currentTime)
    innerAudioContext.src = 'http://sc1.111ttt.cn/2017/1/11/11/304112004168.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
// 	getData: function(appid,session_key){
// 		wx.getWeRunData({
// 	    success: res => {
// //		     console.log("appid:" + appid + "session_key:" + session_key + "encryptedData:" + res.encryptedData + "iv:" + res.iv);
// 		    var encryptedData = res.encryptedData;
// 		    var iv = res.iv;
// 		    //使用解密工具，链接地址：
// 		    //https://codeload.github.com/gwjjeff/cryptojs/zip/master
// 		    var pc = new WXBizDataCrypt(appid, session_key);
// 		    var data = pc.decryptData(encryptedData, iv)
// //		     getFormatDate(time)
//      var datas = []
//      var objs = {}
//      for(var i = 0; i < data.stepInfoList.length; i++) {
//        objs.timestamp = getFormatDate(data.stepInfoList[i].timestamp)
//        objs.step = data.stepInfoList[i].step
//        datas.push(objs)
//        objs = {}
//      } 
//      console.log(datas)
//      this.setData({ runData: datas })
//      //  console.log(data.stepInfoList)
// 		   },
// 		   fail: function (res) {
// 		     wx.showModal({
// 		       title: '提示',
// 		       content: '开发者未开通微信运动，请关注“微信运动”公众号后重试',
// 		       showCancel: false,
// 		       confirmText: '知道了'
// 		     })
// 	  	 }
// 	 	})
// 	},
  scroll: function(e){// 滚动条滑动改变输入框不透明度
    var _this = this
    _this.setData({ opacity: e.detail.scrollTop / 120 < 1 ? (1 - e.detail.scrollTop / 120) : 0})
  },
  search: function(e){// 当输入框失去焦点时
    this.globalData.location = e.detail.value
  },
  onSearch: function(e){
    console.log('222')
    var _this = this
    var location = _this.globalData.location
    if (location != "") {
      util.gettianqi(_this, location)// 调用自定义方法，获得数据
      _this.setData({ isSearch: 1 })
    }
  },
  searchYj: function(e){
    var area = this.data.qiwen.data.HeWeather6[0].basic.admin_area
    if (this.data.isSearch === '0'){
      console.log('已经请求回来数据了，不用再发请求咯！亲~')
    } else {
      wx.request({
        url: 'https://api.jisuapi.com/oil/query?appkey=0486ab3f849c30fb&province=' + area,
        success: res => {
          this.setData({ youjia: res.data.result.oil92 + '元/升', isSearch: '0' })
          console.log('油价:', res.data.result.oil92)
        }
      })
    }
  },
  cha: function(e){// 当输入框值改变时
    var val = e.detail.value
    var _this = this
    if (val != '') {
      _this.setData({ cha: true })
    } else {
      _this.setData({ cha: false })
    }
  },
  delete: function(e){// 当点击×按钮时 为啥在获得焦点时点击搜索或者叉叉会没反应 而是失去焦点以后？
    console.log('11111')
    this.setData({ inputVal: '', cha: false, focu: true })
  },
  globalData: {// 设置一个全局变量s
    location: null
  }
})
