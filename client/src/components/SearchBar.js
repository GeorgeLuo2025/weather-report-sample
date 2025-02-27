import React, { useState, useEffect } from 'react';

const SearchBar = () => (
    <div style={{ display: 'flex', gap: 16 }}>
              <TextField
                fullWidth
                label="输入城市"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                variant="outlined"
                sx={{ bgcolor: 'background.paper' }}
              />
              <Button
                variant="contained"
                onClick={() => fetchWeather(city)}
                sx={{ px: 4, textTransform: 'none' }}
              >
                搜索
              </Button>
              {/* <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton> */}
    </div>
)

export default SearchBar;