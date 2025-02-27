// pages/WeatherReport.jsx
// import { useState, useEffect } from 'react';
// import { Container, Grid, Typography } from '@mui/material';
// // import axios from 'axios';
// import DateSlider from './components/DateSlider';
// import WeatherCard from './components/WeatherCard';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid, Paper, Divider } from '@mui/material';
// import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer 
} from 'recharts';

import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  shape: {
    borderRadius: 12 // 全局圆角
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.1)', // shadow[1]
    '0 4px 8px rgba(0,0,0,0.1)', // shadow[2]
    '0 8px 16px rgba(0,0,0,0.1)' // shadow[3]
  ]
});
const DetailItem = ({ label, value, icon }) => (
  <Paper sx={{
    p: 2,
    borderRadius: 2,
    backgroundColor: 'action.hover',
    textAlign: 'center'
  }}>
    <Typography variant="body2" sx={{ 
      color: 'text.secondary',
      mb: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1
    }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      {label}
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {value}
    </Typography>
  </Paper>
);

const TemperatureCard = ({ min, max, feelsLike }) => (
  <Grid item xs={12} sm={8}>
    <Paper sx={{
      p: 3,
      borderRadius: 3,
      background: 'linear-gradient(135deg, #2196f3, #1976d2)',
      color: 'white',
      textAlign: 'center'
    }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="body2">最低</Typography>
          <Typography variant="h4">{Math.round(min)}°C</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2">最高</Typography>
          <Typography variant="h4">{Math.round(max)}°C</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2">体感</Typography>
          <Typography variant="h4">{Math.round(feelsLike)}°C</Typography>
        </Grid>
      </Grid>
    </Paper>
  </Grid>
);

const WeatherMetric = ({ pressure, humidity, windSpeed, clouds, rain }) => (
  <Grid container spacing={2} justifyContent="center">
    <MetricItem label="气压" value={`${pressure} hPa`} icon="📉" />
    <MetricItem label="湿度" value={`${humidity}%`} icon="💧" />
    <MetricItem label="风速" value={`${windSpeed} m/s`} icon="🌪️" />
    <MetricItem label="云量" value={`${clouds}%`} icon="☁️" />
    {rain && <MetricItem label="降雨量" value={`${rain} mm`} icon="🌧️" />}
  </Grid>
);

const MetricItem = ({ label, value, icon }) => (
  <Grid item xs={6} sm={4} md={3}>
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 8
    }}>
      <span style={{ fontSize: 32 }}>{icon}</span>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        {value}
      </Typography>
    </div>
  </Grid>
);



const App = () => {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [{lon, lat}, setLonLat] = useState({});
  const [weatherData, setWeatherData] = useState(null);
  const [timezone, setTimeZone] = useState(new Date());
  const [selectedIdx, setSelectedIdx] = useState(0);
  // const [chartData, setChartData] = useState(null);

  // 获取地理位置
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeather(null, position.coords.latitude, position.coords.longitude);
    });
  }, []);

  // 获取天气数据
  const fetchWeather = async (cityName, lat, lon) => {
    try {
      setLoading(true); // 开始请求时激活加载状态
      const params = cityName ? { city: cityName } : { lat, lon };
      const result = await axios.get('http://localhost:5000/api/weather/forecast', { params });
      const response = result.data
      setWeatherData(response.list.filter((item, idx) => idx < 30));
      setCity(response.city.name);
      setLonLat(response.city.coord);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Unknown error occurred";
    alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false); // 无论成功失败都关闭加载状态
    }
  };


  const generateChartData = (weatherData) => {
    return weatherData.map((item) => ({
      time: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      temp: item.temp.day
    }));
  };

return (
  <ThemeProvider theme={theme}>
  {/* <div style={{ 
    maxWidth: 1200, 
    margin: '0 auto', 
    padding: '20px 16px'
  }}> */}
  <div style={{ 
      height: '100vh', // 全屏高度
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 32px',
      backgroundColor: '#f5f7fa', // 添加浅色背景
      position: 'relative'
    }}>

    {/* 搜索栏区域 */}
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '40px',
      flexWrap: 'wrap' // 小屏幕时允许换行
    }}>
      <TextField
        label="Enter City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        variant="outlined"
        sx={{ 
          width: 300,
          '& .MuiInputBase-root': { height: 48 } // 统一输入框高度
        }}
      />
      <Button 
        variant="contained" 
        onClick={() => fetchWeather(city)}
        sx={{ 
          height: 48,
          px: 4,
          textTransform: 'none' // 保持按钮文字大小写
        }}
      >
        Search
      </Button>
    </div>
      
    {/* 👇 主内容区域从这里开始 👇 */}
    <div style={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
      overflow: 'hidden'
    }}>
    {/* 加载状态 */}
    {loading && (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '40px 0'
      }}>
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{ color: 'primary.main' }} 
        />
      </div>
    )}

    {/* 城市信息展示区块 */}
    {weatherData && !loading && (
        <Grid container justifyContent="center" sx={{ mb: 0}}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 1
              }}
            >
              {city}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                mb: 2
              }}
            >
              Coordinates: {lon.toFixed(2)}°N, {lat.toFixed(2)}°E
            </Typography>
            {/* <Typography 
              variant="h5"
              sx={{
                color: 'primary.main',
                fontWeight: 600
              }}
            >
              {new Date(weatherData[selectedIdx].dt * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Typography> */}
          </Grid>
        </Grid>
      )}

    {/* 天气详细信息展示 */}
      {weatherData && !loading && weatherData[selectedIdx] && (
        <Grid container spacing={3} sx={{ mt: 1, mb: 4, justifyContent: 'center'}}>
          <Grid item xs={12} md={8} lg={6}>
            {/*  */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 4, // 增大圆角
            boxShadow: 3,
            background: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
            textAlign: 'center' // 内容居中
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              mb: 3,
              letterSpacing: 1
            }}>
                {new Date(weatherData[selectedIdx].dt * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
              </Typography>
              
              <Grid container spacing={3} justifyContent="center">
                {/* 日出日落时间 */}
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    日出
                  </Typography>
                  <Typography>
                    {new Date(weatherData[selectedIdx].sunrise * 1000)
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  <DetailItem 
              label="日出时间"
              value={new Date(weatherData[selectedIdx].sunrise * 1000)
                .toLocaleTimeString('en-US', { timeStyle: 'short' })}
              icon="🌅"
            />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    日落
                  </Typography>
                  <Typography>
                    {new Date(weatherData[selectedIdx].sunset * 1000)
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Grid>

                {/* 温度范围 */}
                <Grid item xs={12}>
                  {/* 可改 */}
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <TemperatureCard 
                  label="当日温度范围"
                  min={weatherData[selectedIdx].temp.min}
                  max={weatherData[selectedIdx].temp.max}
                  feelsLike={weatherData[selectedIdx].feels_like.day}
                />

                {/* <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    最高温度
                  </Typography>
                  <Typography variant="h6">
                    {Math.round(weatherData[selectedIdx].temp.max)}°C
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    最低温度
                  </Typography>
                  <Typography variant="h6">
                    {Math.round(weatherData[selectedIdx].temp.min)}°C
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    体感温度
                  </Typography>
                  <Typography variant="h6">
                    {Math.round(weatherData[selectedIdx].feels_like.day)}°C
                  </Typography>
                </Grid> */}

                {/* 气象指标 */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <WeatherMetric 
                  pressure={weatherData[selectedIdx].pressure}
                  humidity={weatherData[selectedIdx].humidity}
                  windSpeed={weatherData[selectedIdx].speed}
                  clouds={weatherData[selectedIdx].clouds}
                  rain={weatherData[selectedIdx].rain}
                />
                <Grid item xs={3}>
                  <Typography variant="body2" color="text.secondary">
                    气压
                  </Typography>
                  <Typography>{weatherData[selectedIdx].pressure}hPa</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" color="text.secondary">
                    湿度
                  </Typography>
                  <Typography>{weatherData[selectedIdx].humidity}%</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" color="text.secondary">
                    风速
                  </Typography>
                  <Typography>{weatherData[selectedIdx].speed}m/s</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" color="text.secondary">
                    云量
                  </Typography>
                  <Typography>{weatherData[selectedIdx].clouds}%</Typography>
                </Grid>

                {/* 降雨量（条件显示） */}
                {weatherData[selectedIdx].rain && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        降雨量
                      </Typography>
                      <Typography>
                        {weatherData[selectedIdx].rain}mm
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* 温度趋势图表区块 */}
          <Grid item xs={12} md={8} lg={6}>
            <Paper sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: 3,
              background: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Typography variant="h5" gutterBottom sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 3,
                letterSpacing: 1
              }}>
                温度变化趋势
              </Typography>
              
              {/* 实际图表实现 */}
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={generateChartData(weatherData)}>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#6c757d' }}
                  />
                  <YAxis
                    tick={{ fill: '#6c757d' }}
                    unit="°C"
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#2196f3"
                    strokeWidth={2}
                    dot={{ fill: '#2196f3' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: 3
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>



        </Grid>
      )}

    </div>
    {/* 天气预测卡片区域 */}
    {weatherData && !loading && (

      // <Grid 
      //   container 
      //   spacing={3}
      //   sx={{ 
      //     margin: '0 auto',
      //     justifyContent: 'center' // 卡片居中显示
      //   }}
      // >
      <div style={{ 
            flex: '0 0 auto', // 固定高度
            marginTop: 'auto', // 推到底部
            paddingBottom: '32px' // 底部留白
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              ml: 2
            }}>
              七日预报
            </Typography>
            <div style={{
              display: 'flex',
              overflowX: 'auto', // 允许横向滚动
              gap: '24px',
              padding: '0 20px 20px 20px',
              '&::-webkit-scrollbar': {
                height: '8px',
                background: '#f1f1f1'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cfd8dc',
                borderRadius: '4px'
              }
            }}>
        {weatherData.map((day, index) => (
          // <Grid 
          //   item 
          //   key={day.dt}
          //   xs={11}    // 手机：90%宽度
          //   sm={6}     // 平板：50%宽度
          //   md={4}     // 小桌面：33%宽度
          //   lg={3}     // 大桌面：25%宽度
          //   onClick={() => setSelectedIdx(index)}
          //   sx={{ 
          //     cursor: 'pointer',
          //     transition: 'transform 0.2s',
          //     '&:hover': {
          //       transform: index === selectedIdx ? 'scale(1)' : 'scale(1.03)'
          //     }
          //   }}
          // >
          //   <Paper 
          //     elevation={3}
          //     sx={{ 
          //       p: 2,
          //       textAlign: 'center',
          //       borderRadius: 2,
          //       border: index === selectedIdx ? '2px solid' : 'none',
          //       borderColor: 'primary.main',
          //       backgroundColor: index === selectedIdx ? 'action.hover' : 'background.paper',
          //       transition: 'transform 0.2s',
          //       '&:hover': { 
          //         transform: 'translateY(-4px)',
          //         boxShadow: 4 
          //       }
          //     }}
          //   >
            <Paper 
                  key={day.dt}
                  elevation={3}
                  sx={{
                    flex: '0 0 240px', // 固定卡片宽度
                    p: 3,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: index === selectedIdx ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    backgroundColor: index === selectedIdx ? 'action.selected' : 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => setSelectedIdx(index)}
                >
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  mb: 1
                }}
              >
                {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                {Math.round(day.temp.day)}°C
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.primary',
                  mb: 1,
                  textTransform: 'capitalize'
                }}
              >
                {day.weather[0].description}
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '8px'
              }}>
                <div>
                  <Typography variant="caption">Humidity</Typography>
                  <Typography>{day.humidity}%</Typography>
                </div>
                <div>
                  <Typography variant="caption">Wind</Typography>
                  <Typography>{day.speed}m/s</Typography>
                </div>
              </div>
            </Paper>
          // </Grid>
        ))}
      {/* </Grid> */}
      </div>
      </div>
    )}
  </div>
  </ThemeProvider>
);
  
}


export default App;