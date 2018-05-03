
function gettianqi(obj, location){
  wx.request({
    url: 'https://free-api.heweather.com/s6/weather/forecast?parameters&location=' + location + '&key=0db5c2e8146a4ce1b602cf9afbce6674&lang=cn&unit=m',
    success: res => {
      obj.setData({ qiwen: res })
      console.log(res.data.HeWeather6[0])
    }
  })
  wx.request({
    url: 'https://free-api.heweather.com/s6/weather/lifestyle?parameters&location=' + location + '&key=0db5c2e8146a4ce1b602cf9afbce6674&lang=cn&unit=m',
    success: res => {
      obj.setData({ lifestyle: res.data.HeWeather6[0].lifestyle })
      console.log('生活指数:', res.data.HeWeather6[0].lifestyle)
    }
  })
}

module.exports = {
  gettianqi: gettianqi
}
