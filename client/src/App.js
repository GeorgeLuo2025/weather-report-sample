import { useState, useEffect } from 'react';
import axios from 'axios';
import DateSlider from './components/DateSlider';
// import WeatherChart from './components/WeatherChart';
import WeatherDetail from './components/WeatherDetail';
import { Box, CircularProgress, dividerClasses } from '@mui/material';

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [chartData, setChartData] = useState(null);

  // 获取30天数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/weather/forecast?city=London');

        // const processed = processWeatherData(response.data);
        // console.log(processed);
        setWeatherData(response.data.list);
        console.log(response.data.list);
        // generateChartData(processed);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // 处理原始数据
  const processWeatherData = (data) => {
    // return data.list.map(day => ({
    //   date: new Date(day.dt * 1000),
    //   temp: day.temp.day,
    //   max: day.temp.max,
    //   min: day.temp.min,
    //   humidity: day.humidity,
    //   wind: day.wind_speed,
    //   weather: day.weather[0].main,
    //   icon: day.weather[0].icon
    // }));
  };

  // 生成图表数据
  // const generateChartData = (data) => {
  //   setChartData({
  //     labels: data.map(d => d.date.toLocaleDateString()),
  //     datasets: [
  //       {
  //         label: '最高温度',
  //         data: data.map(d => d.max),
  //         borderColor: '#ff6384'
  //       },
  //       {
  //         label: '最低温度',
  //         data: data.map(d => d.min),
  //         borderColor: '#36a2eb'
  //       }
  //     ]
  //   });
  // };

  if (!weatherData) return <CircularProgress />;

  return (
    <div className="container">
      <DateSlider 
        dates={weatherData.map(d => d.dt)} 
        selected={selectedDate}
        onChange={setSelectedDate}
      />
      
      <WeatherDetail 
        data={weatherData.find(d => 
          d.dt.toString() === selectedDate.toString()
        )} 
      />
      
      {/* <WeatherChart data={chartData} /> */}
    </div>
  );
};

export default App;