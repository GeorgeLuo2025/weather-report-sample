import axios from 'axios';

export const fetchWeather = async (city, lat, lon) => {
  const params = city ? { city } : { lat, lon };
  const { data } = await axios.get('http://localhost:5000/api/weather/forecast', { params });
  return data;
};
