import React from 'react';
import { Paper, Typography, Grid, Divider } from '@mui/material';
import WeatherDetailItem from './WeatherDetailItem';

const WeatherDetails = ({ weatherDetail }) => {
  if (!weatherDetail) return null;

  return (
    <Paper sx={{ 
      height: '100%',
      p: 3,
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {new Date(weatherDetail.dt * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <WeatherDetailItem
            label="sunrise time:"
            value={new Date(weatherDetail.sunrise * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            icon="🌅"
          />
          <WeatherDetailItem
            label="max temperature:"
            value={`${Math.round(weatherDetail.temp.max)}°C`}
            icon="🔥"
          />
          <WeatherDetailItem
            label="wind speed:"
            value={`${weatherDetail.speed} m/s`}
            icon="🌪️"
          />
        </Grid>
        <Grid item xs={6}>
          <WeatherDetailItem
            label="sunset time:"
            value={new Date(weatherDetail.sunset * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            icon="🌇"
          />
          <WeatherDetailItem
            label="min temperature:"
            value={`${Math.round(weatherDetail.temp.min)}°C`}
            icon="❄️"
          />
          <WeatherDetailItem
            label="humidity:"
            value={`${weatherDetail.humidity}%`}
            icon="💧"
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <WeatherDetailItem
        label="feel like temperature:"
        value={`${Math.round(weatherDetail.feels_like.day)}°C`}
        icon="🌡️"
      />
      {weatherDetail.rain && (
        <WeatherDetailItem
          label="precipitation:"
          value={`${weatherDetail.rain}mm`}
          icon="🌧️"
        />
      )}
    </Paper>
  );
};

export default WeatherDetails;
