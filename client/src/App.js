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
      setWeatherData(response.list.filter((item, idx) => idx < 7));
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

return (
  <div style={{ 
    maxWidth: 1200, 
    margin: '0 auto', 
    padding: '20px 16px'
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
        <Grid container justifyContent="center" sx={{ mb: 4 }}>
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
            <Typography 
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
            </Typography>
          </Grid>
        </Grid>
      )}

    {/* 天气详细信息展示 */}
      {weatherData && !loading && weatherData[selectedIdx] && (
        <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                天气详情
              </Typography>
              
              <Grid container spacing={2}>
                {/* 日出日落时间 */}
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    日出
                  </Typography>
                  <Typography>
                    {new Date(weatherData[selectedIdx].sunrise * 1000)
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
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
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={4}>
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
                </Grid>

                {/* 气象指标 */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
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




          
        </Grid>
      )}


    {/* 天气预测卡片区域 */}
    {weatherData && !loading && (

      <Grid 
        container 
        spacing={3}
        sx={{ 
          margin: '0 auto',
          justifyContent: 'center' // 卡片居中显示
        }}
      >
        {weatherData.map((day, index) => (
          <Grid 
            item 
            key={day.dt}
            xs={11}    // 手机：90%宽度
            sm={6}     // 平板：50%宽度
            md={4}     // 小桌面：33%宽度
            lg={3}     // 大桌面：25%宽度
            onClick={() => setSelectedIdx(index)}
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: index === selectedIdx ? 'scale(1)' : 'scale(1.03)'
              }
            }}
          >
            <Paper 
              elevation={3}
              sx={{ 
                p: 2,
                textAlign: 'center',
                borderRadius: 2,
                border: index === selectedIdx ? '2px solid' : 'none',
                borderColor: 'primary.main',
                backgroundColor: index === selectedIdx ? 'action.hover' : 'background.paper',
                transition: 'transform 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 4 
                }
              }}
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
          </Grid>
        ))}
      </Grid>
    )}
  </div>
);
  
}


export default App;