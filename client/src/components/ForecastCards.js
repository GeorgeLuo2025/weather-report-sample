import React from 'react';
import { Paper, Typography } from '@mui/material';

const ForecastCards = ({ weatherData, selectedIdx, setSelectedIdx }) => {
  return (
    <div style={{ marginTop: 24 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>15 days forecast</Typography>
      <div style={{
        display: 'flex',
        gap: 16,
        overflowX: 'auto',
        paddingBottom: 8
      }}>
        {weatherData.map((day, index) => (
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
              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
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
  );
};

export default ForecastCards;
