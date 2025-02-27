import React from 'react';
import { TextField, Button } from '@mui/material';

const SearchBar = ({ city, setCity, onSearch }) => {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <TextField
        fullWidth
        label="Entey City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        variant="outlined"
        sx={{ bgcolor: 'background.paper' }}
      />
      <Button
        variant="contained"
        onClick={() => onSearch(city)}
        sx={{ px: 4, textTransform: 'none' }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
