import { Box } from '@mui/material';

const DateSlider = ({ dates, selected, onChange }) => {
  return (
    <Box sx={{
      display: 'flex',
      overflowX: 'auto',
      gap: 2,
      py: 2,
      borderBottom: '1px solid #ddd'
    }}>
      {dates.map(date => (
        <Box
          key={date.toString()}
          onClick={() => onChange(date)}
          sx={{
            flexShrink: 0,
            padding: 2,
            border: date.toString() === selected.toString() 
              ? '2px solid #1976d2' 
              : '1px solid #ccc',
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor: date.toString() === selected.toString() 
              ? '#e3f2fd' 
              : 'white'
          }}>
          {date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric'
          })}
        </Box>
      ))}
    </Box>
  );
};

export default DateSlider;