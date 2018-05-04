const wxCharts = require('../../utils/wxcharts.js');
const app = getApp();
var lineChart = null;
var startPos = null;
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt.js') // 解密微信运动 或 解密用户信息
const getFormatDate = require('../../utils/getTime.js') // 时间戳转标准时间
const AppId = 'wx97b277a1b249d245'
const AppSecret = '6df978e4f0d3faed2fec012b76999442'
Page({
	data: {},
	touchHandler: function(e) {
		lineChart.scrollStart(e);
	},
	moveHandler: function(e) {
		lineChart.scroll(e);
	},
	touchEndHandler: function(e) {
		lineChart.scrollEnd(e);
		lineChart.showToolTip(e, {
			format: function(item, category) {
				return category + ' ' + item.name + ':' + item.data
			}
		});
	},
	getData: function(appid, session_key) {
		try {
			var res = wx.getSystemInfoSync();
		} catch(e) {
			console.error('getSystemInfoSync failed!');
		}
		wx.getWeRunData({
			success: res => {
				//		     console.log("appid:" + appid + "session_key:" + session_key + "encryptedData:" + res.encryptedData + "iv:" + res.iv);
				var encryptedData = res.encryptedData;
				var iv = res.iv;
				wx.request({
					url: 'http://www.vip018.top:8000/getWark?encryptedData=' + encodeURIComponent(encryptedData) + '&iv=' + encodeURIComponent(iv) + '&session_key=' + encodeURIComponent(session_key),
//					header: {
//						'content-type': 'json'
//					},
					success: function(res2) {
						console.log('res2:', res2)
						var data = res2.data
						var categories = []
						var datas = []
						for(var i = 0; i < data.stepInfoList.length; i++) {
							categories.push(getFormatDate(data.stepInfoList[i].timestamp))
							datas.push(data.stepInfoList[i].step)
						}
						// console.log(datas)
						lineChart = new wxCharts({
							canvasId: 'lineCanvas',
							type: 'line',
							categories: categories.reverse(),
							animation: true,
							series: [{
								name: '步数',
								data: datas.reverse(),
								format: function(val, name) {
									return val + '步';
								}
							}],
							xAxis: {
								disableGrid: false
							},
							yAxis: {
								title: '行走步数(步)',
								format: function(val) {
									return val;
								},
								min: 0
							},
							width: 350,
							height: 300,
							dataLabel: true,
							dataPointShape: true,
							enableScroll: true,
							extra: {
								lineStyle: 'curve'
							}
						});
					},
					fail: function(res) {
						wx.showModal({
							title: '提示',
							content: '开发者未开通微信运动，请关注“微信运动”公众号后重试',
							showCancel: false,
							confirmText: '知道了'
						})
					}
				})
			}
		})
	},
	onLoad: function(e) {
		var that = this
		wx.login({
			success: function(res) {
				if(res.code) {
					var appid = 'wx97b277a1b249d245'
					var secret = '6df978e4f0d3faed2fec012b76999442'
					wx.request({
						url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + res.code + '&grant_type=authorization_code',
						header: {
							'content-type': 'json'
						},
						success: function(res3) {
							var session_key = res3.data.session_key
							that.getData(appid, session_key)
						}
					})
				} else {
					console.log('登录失败！' + res.errMsg)
				}
			}
		})
	}
});