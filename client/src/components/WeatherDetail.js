import { Card, Typography, useTheme } from '@mui/material';
import { WiDaySunny, WiRain, WiCloudy } from 'react-icons/wi';

const WeatherDetail = ({ data }) => {
  const theme = useTheme();
  
  const getWeatherIcon = () => {
    switch(data.weather.main.toLowerCase()) {
    //   case 'clear': return <WiDaySunny size={64} />;
      case 'rain': return <WiRain size={64} />;
      default: return <WiCloudy size={64} />;
    }
  };

  return (
    <Card sx={{ 
      p: 4, 
      mb: 4,
    //   background: theme.palette.gradient[data.weather]
    }}>
      <div className="weather-header">
        {getWeatherIcon()}
        <Typography variant="h4">{data.date.toLocaleDateString()}</Typography>
      </div>

      <div className="weather-stats">
        <div className="stat-item">
          <Typography variant="h6">温度</Typography>
          <Typography variant="h3">{data.temp.day}°C</Typography>
        </div>
        
        <div className="stat-item">
          <Typography variant="h6">湿度</Typography>
          <Typography variant="h4">{data.humidity}%</Typography>
        </div>

        {/* <div className="stat-item">
          <Typography variant="h6">风速</Typography>
          <Typography variant="h4">{data.wind} m/s</Typography>
        </div> */}
      </div>
    </Card>
  );
};

export default WeatherDetail;