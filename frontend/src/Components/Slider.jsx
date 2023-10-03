// import React from 'react';
// import { Slider } from 'antd';
// const onChange = (value) => {
//   console.log('onChange: ', value);
// };
// const onAfterChange = (value) => {
//   console.log('onAfterChange: ', value);
// };
// const Slideer = () => (
//   <>
//     <Slider defaultValue={38} step={1} onChange={onChange} onAfterChange={onAfterChange} />
//     <Slider
//       range
//       step={1}
//       defaultValue={[10, 38]}
//       onChange={onChange}
//       onAfterChange={onAfterChange}
//     />
//   </>
// );
// export default Slideer;

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const Slideer = () => {
  const [sliderValue, setSliderValue] = useState(10000); // Initialize with a default value

  const valuetext = (value) => {
    setSliderValue(value); // Update the state with the selected value
    return `${value}°C`;
  };

  return (
    <Box>
      <Slider
        aria-label="Small steps"
        defaultValue={10000}
        getAriaValueText={valuetext}
        step={1000}
        min={10000}
        max={38000}
        className='green'
        valueLabelDisplay="auto"
      />
      <div className=' text-xl font-semibold text-neutral-600 text-center'>{sliderValue} words/mon</div>
    </Box>
  );
};

export default Slideer;
