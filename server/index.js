require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// 获取天气数据接口
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let apiUrl;

    if (city) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const response = await axios.get(apiUrl);
    const data = {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      weather: response.data.weather[0].main,
      icon: response.data.weather[0].icon,
      city: response.data.name
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});