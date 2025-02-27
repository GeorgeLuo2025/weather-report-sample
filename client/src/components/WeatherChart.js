import React from 'react';
import { Paper, Typography } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const WeatherChart = ({ weatherData }) => {
  const generateChartData = (data) =>
    data.map(item => ({
      time: new Date(item.dt * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      temp: item.temp.day
    }));

  return (
    <Paper sx={{ 
      flex: 1,
      p: 2,
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Temperature Trend</Typography>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={generateChartData(weatherData)}>
            <XAxis dataKey="time" />
            <YAxis unit="°C" />
            <Line type="monotone" dataKey="temp" stroke="#2196f3" strokeWidth={2} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

export default WeatherChart;
