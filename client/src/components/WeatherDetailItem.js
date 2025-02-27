import React from 'react';
import { Paper, Typography } from '@mui/material';

const WeatherDetailItem = ({ label, value, icon }) => (
  <Paper sx={{
    p: 2,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    bgcolor: 'background.paper'
  }}>
    <span style={{ fontSize: 24 }}>{icon}</span>
    <div>
      <Typography variant="body2" color="textSecondary">{label}</Typography>
      <Typography variant="h6" fontWeight={600}>{value}</Typography>
    </div>
  </Paper>
);

export default WeatherDetailItem;
