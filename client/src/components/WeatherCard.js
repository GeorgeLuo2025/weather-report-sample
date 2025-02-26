// components/WeatherCard.jsx
import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { WiRain, WiDaySunny, WiCloudy } from 'react-icons/wi'; // 需要安装weather-icons

const WeatherCard = ({ forecast }) => {
  const getWeatherIcon = (main) => {
    switch(main) {
      case 'Rain': return <WiRain size={48} />;
      case 'Clear': return <WiDaySunny size={48} />;
      case 'Clouds': return <WiCloudy size={48} />;
      default: return <WiDaySunny size={48} />;
    }
  };

  return (
    <Card sx={{ minWidth: 200, m: 2 }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </Typography>
        <Avatar sx={{ bgcolor: '#1976d2', my: 2 }}>
          {getWeatherIcon(forecast.weather[0].main)}
        </Avatar>
        <Typography variant="h5">
          {Math.round(forecast.temp.day)}°C
        </Typography>
        <Typography color="text.secondary">
          {forecast.weather[0].description}
        </Typography>
        <Typography variant="body2">
          ↓{Math.round(forecast.temp.min)}°C 
          ↑{Math.round(forecast.temp.max)}°C
        </Typography>
        {forecast.rain && (
          <Typography variant="caption" display="block">
            Rainfall: {forecast.rain}mm
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;