import { useState } from 'react';
import {
  Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark,
} from '@chakra-ui/react';

export default function RateSlider() {
  const [sliderValue, setSliderValue] = useState(3);
  return (
    <Box>
      <Slider defaultValue={3} min={0} max={5} step={1} onChange={(val) => setSliderValue(val)}>
        <SliderMark value={1}>1</SliderMark>
        <SliderMark value={2}>2</SliderMark>
        <SliderMark value={3}>3</SliderMark>
        <SliderMark value={4}>4</SliderMark>
        <SliderMark value={5}>5</SliderMark>
        <SliderMark
          value={sliderValue}
          textAlign="center"
          bg="blue.500"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {sliderValue}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
}
