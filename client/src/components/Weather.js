import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { WbSunny, Cloud, Opacity, Air } from '@mui/icons-material';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [chartData, setChartData] = useState(null);

  // 获取地理位置
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeather(null, position.coords.latitude, position.coords.longitude);
    });
  }, []);

  // 获取天气数据
  const fetchWeather = async (cityName, lat, lon) => {
    try {
      const params = cityName ? { city: cityName } : { lat, lon };
      const response = await axios.get('http://localhost:5000/api/weather', { params });
      setWeatherData(response.data);
      generateChartData(response.data);
    } catch (error) {
      alert('Failed to fetch weather data');
    }
  };

  // 生成图表数据
  const generateChartData = (data) => {
    setChartData({
      labels: ['Temperature', 'Humidity', 'Wind Speed'],
      datasets: [{
        label: 'Weather Metrics',
        data: [data.temp, data.humidity, data.windSpeed],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    });
  };

  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Weather Dashboard
        </Typography>
        
        {/* 城市搜索 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <TextField
            label="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            variant="outlined"
          />
          <Button 
            variant="contained" 
            onClick={() => fetchWeather(city)}
          >
            Search
          </Button>
        </div>

        {/* 天气信息展示 */}
        {weatherData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {weatherData.icon.includes('01') ? <WbSunny /> : <Cloud />}
              <Typography variant="h5">{weatherData.city}</Typography>
            </div>
            
            <div style={{ margin: '20px 0' }}>
              <Typography><Opacity /> Humidity: {weatherData.humidity}%</Typography>
              <Typography><Air /> Wind: {weatherData.windSpeed} m/s</Typography>
              <Typography>Temperature: {weatherData.temp}°C</Typography>
            </div>

            {/* 图表 */}
            {chartData && (
              <div style={{ height: 300 }}>
                <Line 
                  data={chartData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Weather;