// WeatherReport.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ThemeProvider,
  createTheme,
  Grid,
  Paper,
  Divider,
  TextField,
  Button,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Select
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import SearchBar from './components/';

const theme = createTheme({
  shape: { borderRadius: 12 },
  palette: {
    background: { default: '#f8f9fa' },
    primary: { main: '#2196f3' },
    text: {
      primary: '#2d3436',
      secondary: '#636e72'
    }
  }
});

const WeatherDetailItem = ({ label, value, icon }) => (
  <Paper sx={{
    p: 2,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    bgcolor: 'background.paper'
  }}>
    <span style={{ fontSize: 24 }}>{icon}</span>
    <div>
      <Typography variant="body2" color="textSecondary">{label}</Typography>
      <Typography variant="h6" fontWeight={600}>{value}</Typography>
    </div>
  </Paper>
);

const Appp = () => {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState({});
  const [weatherData, setWeatherData] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'zh')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      fetchWeather(null, coords.latitude, coords.longitude);
    });
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
      },
    },
    shape: { borderRadius: 12 },
  });


  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };


  const fetchWeather = async (cityName, lat, lon) => {
    try {
      setLoading(true);
      const params = cityName ? { city: cityName } : { lat, lon };
      const { data } = await axios.get('http://localhost:5000/api/weather/forecast', { params });
      setWeatherData(data.list.slice(0, 7));
      setCity(data.city.name);
      setCoords(data.city.coord);
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (data) => 
    data.map(item => ({
      time: new Date(item.dt * 1000).toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric'
      }),
      temp: item.temp.day
    }));

  return (
    <ThemeProvider theme={theme}>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        backgroundColor: '#f8f9fa'
      }}>
        {/* 主内容区域 */}
        <Grid container spacing={3} sx={{ flex: 1 }}>
          {/* 左栏 */}
          <Grid item xs={12} md={6} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            {/* 搜索栏 */}
            
            <div style={{ display: 'flex', gap: 16 }}>
              <TextField
                fullWidth
                label="输入城市"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                variant="outlined"
                sx={{ bgcolor: 'background.paper' }}
              />
              <Button
                variant="contained"
                onClick={() => fetchWeather(city)}
                sx={{ px: 4, textTransform: 'none' }}
              >
                搜索
              </Button>
              {/* <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton> */}
            </div>

            {/* 城市信息 */}
            {city && (
              <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h4" sx={{ mb: 1 }}>{city}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {coords.lat?.toFixed(2)}°N, {coords.lon?.toFixed(2)}°E
                </Typography>
              </Paper>
            )}

            {/* 温度趋势图 */}
            {weatherData && (
              <Paper sx={{ 
                flex: 1,
                p: 2,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="h6" sx={{ mb: 2 }}>温度趋势</Typography>
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateChartData(weatherData)}>
                      <XAxis dataKey="time" />
                      <YAxis unit="°C" />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#2196f3"
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            )}
          </Grid>

          {/* 右栏 - 天气详情 */}
          <Grid item xs={12} md={6}>
            {weatherData && !loading && (
              <Paper sx={{ 
                height: '100%',
                p: 3,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {new Date(weatherData[selectedIdx].dt * 1000).toLocaleDateString('zh-CN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <WeatherDetailItem
                      label="日出时间"
                      value={new Date(weatherData[selectedIdx].sunrise * 1000)
                        .toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      icon="🌅"
                    />
                    <WeatherDetailItem
                      label="最高温度"
                      value={`${Math.round(weatherData[selectedIdx].temp.max)}°C`}
                      icon="🔥"
                    />
                    <WeatherDetailItem
                      label="风速"
                      value={`${weatherData[selectedIdx].speed} m/s`}
                      icon="🌪️"
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <WeatherDetailItem
                      label="日落时间"
                      value={new Date(weatherData[selectedIdx].sunset * 1000)
                        .toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      icon="🌇"
                    />
                    <WeatherDetailItem
                      label="最低温度"
                      value={`${Math.round(weatherData[selectedIdx].temp.min)}°C`}
                      icon="❄️"
                    />
                    <WeatherDetailItem
                      label="湿度"
                      value={`${weatherData[selectedIdx].humidity}%`}
                      icon="💧"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <WeatherDetailItem
                  label="体感温度"
                  value={`${Math.round(weatherData[selectedIdx].feels_like.day)}°C`}
                  icon="🌡️"
                />
                {weatherData[selectedIdx].rain && (
                  <WeatherDetailItem
                    label="降雨量"
                    value={`${weatherData[selectedIdx].rain}mm`}
                    icon="🌧️"
                  />
                )}
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* 底部预报卡片 */}
        <div style={{ marginTop: 24 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>七日预报</Typography>
          <div style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 8
          }}>
            {weatherData?.map((day, index) => (
              <Paper
                key={day.dt}
                sx={{
                  flex: '0 0 160px',
                  p: 2,
                  cursor: 'pointer',
                  border: `2px solid ${index === selectedIdx ? '#2196f3' : 'transparent'}`,
                  bgcolor: index === selectedIdx ? 'rgba(33,150,243,0.1)' : 'background.paper',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)'
                  }
                }}
                onClick={() => setSelectedIdx(index)}
              >
                <Typography variant="body1" sx={{ 
                  color: index === selectedIdx ? '#2196f3' : 'text.primary',
                  fontWeight: 600
                }}>
                  {new Date(day.dt * 1000).toLocaleDateString('zh-CN', { 
                    weekday: 'short' 
                  })}
                </Typography>
                <Typography variant="h5" sx={{ my: 1 }}>
                  {Math.round(day.temp.day)}°C
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {day.weather[0].description}
                </Typography>
              </Paper>
            ))}
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20
          }}>
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ color: '#2196f3' }} 
            />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Appp;