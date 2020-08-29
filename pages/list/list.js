const dayMap = ['Sunday','Monday','Tuseday','Wednesday','Thursday','Friday','Saturday']

Page({
  data: {
    weekWeather: []
  },
  onLoad() {
    this.getWeekWeather()
  },
  onPullDownRefresh() {
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh();
    }) 
  },
  getWeekWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        time: new Date().getTime(),
        city: 'Paris',
      },
      success: res => {
        let result = res.data.result;
        this.setWeekWeather(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setWeekWeather(result) {
    let weekWeather = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate()+i)
      weekWeather.push({
        day: dayMap[date.getDay()],//display day by getDay() returning the number of day
        date:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        temp:`${result[i].minTemp}°-${result[i].maxTemp}°`,
        iconPath:"/images/" + result[i].weather +"-icon.png"
      })
    }
    weekWeather[0].day = "Today"
    this.setData({
      weekWeather: weekWeather
    })
  }
})