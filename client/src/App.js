import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import SearchBar from './components/SearchBar';
import WeatherChart from './components/WeatherChart';
import WeatherDetails from './components/WeatherDetails';
import ForecastCards from './components/ForecastCards';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState({});
  const [weatherData, setWeatherData] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'zh');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      fetchWeather(null, coords.latitude, coords.longitude);
    });
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#2196f3' }
    },
    shape: { borderRadius: 12 }
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const fetchWeather = async (cityName, lat, lon) => {
    try {
      setLoading(true);
      const params = cityName ? { city: cityName } : { lat, lon };
      const { data } = await axios.get('http://localhost:5000/api/weather/forecast', { params });
      setWeatherData(data.list.slice(0, 15));
      setCity(data.city.name);
      setCoords(data.city.coord);
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        backgroundColor: '#f8f9fa'
      }}>
        {/* Main content area */}
        <Grid container spacing={3} sx={{ flex: 1 }}>
          {/* Left Column */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SearchBar city={city} setCity={setCity} onSearch={fetchWeather} />
            
            {city && (
              <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h4" sx={{ mb: 1 }}>{city}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {coords.lat?.toFixed(2)}°N, {coords.lon?.toFixed(2)}°E
                </Typography>
              </Paper>
            )}

            {weatherData && <WeatherChart weatherData={weatherData} />}
          </Grid>

          {/* Right Column - Weather Details */}
          <Grid item xs={12} md={6}>
            {weatherData && !loading && (
              <WeatherDetails weatherDetail={weatherData[selectedIdx]} />
            )}
          </Grid>
        </Grid>

        {/* Bottom Forecast Cards */}
        {weatherData && (
          <ForecastCards weatherData={weatherData} selectedIdx={selectedIdx} setSelectedIdx={setSelectedIdx} />
        )}

        {/* Loading Indicator */}
        {loading && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20
          }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#2196f3' }} />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
