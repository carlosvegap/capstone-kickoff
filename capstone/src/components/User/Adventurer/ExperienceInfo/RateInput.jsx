import { useState, useEffect } from 'react';
import {
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Heading,
  Input,
} from '@chakra-ui/react';

export default function RateInput({
  defaultValue,
  minValue,
  maxValue,
  step,
  feedbackName,
  onChange,
  id,
}) {
  const [sliderValue, setSliderValue] = useState(defaultValue);
  const [commentValue, setCommentValue] = useState('');
  useEffect(() => {
    onChange(id, 'comment', commentValue);
  }, [commentValue]);
  useEffect(() => {
    onChange(id, 'score', sliderValue);
  }, [sliderValue]);
  return (
    <Box
      mb="20px"
      p="16px 20px"
      boxShadow="md"
      bg="gray.300"
      borderRadius="10px"
    >
      <Heading as="h3" size="md" textAlign="center" mb="30px">
        {feedbackName}
      </Heading>
      <Slider
        defaultValue={defaultValue}
        min={minValue}
        max={maxValue}
        step={step}
        onChange={(val) => setSliderValue(val)}
      >
        <SliderMark value={minValue}>{minValue}</SliderMark>
        <SliderMark value={1}>1</SliderMark>
        <SliderMark value={2}>2</SliderMark>
        <SliderMark value={3}>3</SliderMark>
        <SliderMark value={4}>4</SliderMark>
        <SliderMark value={maxValue}>{maxValue}</SliderMark>
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
      <Input
        mt="20px"
        placeholder="Let us know more"
        bg="white"
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
      />
    </Box>
  );
}
