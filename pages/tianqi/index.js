//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    qiwen: '', // 气温信息
    lifestyle: null, // 生活指数信息
    lifeZs: { comf: '舒适度指数', cw: '洗车指数', drsg: '穿衣指数', flu: '感冒指数', sport: '运动指数', trav: '旅游指数', uv: '紫外线指数', air: '空气污染扩散条件指数'}, // 生活指数英文对应值
    opacity: 1, // 不透明度
    youjia: 6.92, // 油价
    cha: false, // x显示状态
    inputVal: '', //输入框值
    focu: false //输入框属否获得焦点
  },
  onLoad:function(){
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

    // 音乐播放器
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
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
  scroll: function(e){// 滚动条滑动改变输入框不透明度
    var _this = this
    _this.setData({ opacity: e.detail.scrollTop / 120 < 1 ? (1 - e.detail.scrollTop / 120) : 0})
  },
  search: function(e){// 当输入框失去焦点时
    this.globalData.location = e.detail.value
  },
  onSearch: function(e){
    var _this = this
    var location = _this.globalData.location
    if (location != "") {
      util.gettianqi(_this, location)// 调用自定义方法，获得数据
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
