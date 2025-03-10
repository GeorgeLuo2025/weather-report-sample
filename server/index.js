import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;



// 获取天气数据接口
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let apiUrl;
    // console.log("here")
    if (city) {
        // console.log("break point 1");
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
    // const response = await axios.get('http://localhost:5000/api/weather/forecast?city=London')
    ;
    const response = await axios.get(apiUrl);
    console.log(response)
    // const data = {
    //   temp: response.data.main.temp,
    //   humidity: response.data.main.humidity,
    //   windSpeed: response.data.wind.speed,
    //   weather: response.data.weather[0].main,
    //   icon: response.data.weather[0].icon,
    //   city: response.data.name
    // };
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/weather/forecast', async (req, res) => {
    try {
      const { city, lat, lon } = req.query;
      let apiUrl;
  
      if (city) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast/climate?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
      } else if (lat && lon) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast/climate?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
      } else {
        return res.status(400).json({ error: 'Invalid parameters' });
      }
  
      const response = await axios.get(`${apiUrl}`);
    //   console.log(response);
    //   const data = {
    //     temp: response.data.main.temp,
    //     humidity: response.data.main.humidity,
    //     windSpeed: response.data.wind.speed,
    //     weather: response.data.weather[0].main,
    //     icon: response.data.weather[0].icon,
    //     city: response.data.name
    //   };
      res.json(response.data);
    //   console.log(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// 启动服务
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});