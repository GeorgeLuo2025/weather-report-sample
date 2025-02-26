// components/DateSlider.jsx
import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import { format } from 'date-fns';

const DateSlider = ({ dates, selected, onChange }) => {
  const dateToValue = (date) => dates.indexOf(date);
  
  const valueToDate = (value) => dates[value];
  
  const marks = dates.map((date, index) => ({
    value: index,
    label: format(date, 'MM/dd')
  }));

  return (
    <div style={{ padding: '20px 40px' }}>
        {/* sdfsoijlkm */}
      <Slider
        value={dateToValue(selected)}
        min={0}
        max={dates.length - 1}
        step={1}
        marks={marks}
        onChange={(_, value) => onChange(valueToDate(value))}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => format(dates[value], 'EEE, MMM d')}
      />
    </div>
  );
};

DateSlider.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  selected: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired
};

export default DateSlider;