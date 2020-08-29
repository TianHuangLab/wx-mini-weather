const weatherMap = {
  'sunny': 'sunny',
  'cloudy': 'cloudy',
  'overcast': 'overcast',
  'lightrain': 'light rain',
  'heavyrain': 'heavy rain',
  'snow': 'snow'
 }

 const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
 }

Page({
  data: {
    nowTemp: "",
    nowWeather: "",
    nowWeatherBg:"",
    forecast: [],
    todayTemp: "",
    todayDate: ""
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh();
    }) 
  },
  onLoad() {
    this.getNow()
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', 
      data: {
        city: 'Paris',
      },
      success: (res) => {
        let result = res.data.result;
        this.setNow(result);
        this.setHourlyWeather(result);
        this.setToday(result);
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setNow(result) {
    let temp = result.now.temp;
    let weather = result.now.weather;
    console.log(temp, weather);
    this.setData({
      nowTemp:  temp + "°",
      nowWeather: weatherMap[ weather ],
      nowWeatherBg: "/images/" + weather + "-bg.png"
    })
    wx.setNavigationBarColor({
      backgroundColor: weatherColorMap[weather],
      frontColor: '#000000',
    })
  },
  setHourlyWeather(result) {
    //set forecast
    let forecast = result.forecast
    let hourlyWeather = [];
    let nowHour = new Date().getHours()
    for (let i=0; i < 8; i+=1) {
      hourlyWeather.push({
        time: (i*3 + nowHour) % 24 + ":00",
        iconPath: "/images/" + forecast[i].weather +"-icon.png",
        temp: forecast[i].temp + "°"
      })
    }
    hourlyWeather[0].time = "now",
    this.setData ({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result) {
    let date = new Date();
    this.setData({
      todayTemp: `${result.today.minTemp}°-${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    })
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})