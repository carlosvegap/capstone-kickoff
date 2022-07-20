import {
  Box, Checkbox, Badge, HStack, Slider, SliderMark, SliderTrack, SliderFilledTrack,
  Tooltip, SliderThumb,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useState } from 'react';

export default function FilterArea({
  id, displayText, priority, minValue, maxValue, defaultValue, step, units,
}) {
  // Locating marks within slider
  const markSpace = maxValue / 5;
  const mark2 = markSpace * 2;
  const mark3 = markSpace * 3;
  const mark4 = markSpace * 4;
  const [sliderValue, setSliderValue] = useState(0);
  const [showToolTip, setShowTooltip] = useState(false);
  const [showMinimumValues, setShowMinimumValues] = useState(false);
  if (showMinimumValues === false) {
    return (
      <Box>
        <HStack spacing="40px" mb="20px">
          <Checkbox ml="45px" onChange={(e) => setShowMinimumValues(e.target.checked)} />
          <Badge> {priority} {displayText} </Badge>
        </HStack>
      </Box>
    );
  }
  return (
    <Box>
      <HStack spacing="40px">
        <Checkbox ml="45px" onChange={(e) => setShowMinimumValues(e.target.checked)} />
        <Badge> {priority} {displayText} </Badge>
        <Badge colorScheme="yellow"> {sliderValue} <DefineIcon units={units} />  or Higher </Badge>
      </HStack>
      <Slider
        width="80%"
        ml="10%"
        mt="20px"
        mb="20px"
        id={id}
        defaultValue={defaultValue !== sliderValue ? sliderValue : defaultValue}
        min={minValue}
        max={maxValue}
        step={step}
        colorScheme="yellow"
        onChange={(v) => setSliderValue(v)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderMark value={markSpace} mt="1" ml="-2.5" fontSize="sm" textAlign="center">
          {Math.round(markSpace)}
        </SliderMark>
        <SliderMark value={mark2} mt="1" ml="-2.5" fontSize="sm" textAlign="center">
          {Math.round(mark2)}
        </SliderMark>
        <SliderMark value={mark3} mt="1" ml="-2.5" fontSize="sm" textAlign="center">
          {Math.round(mark3)}
        </SliderMark>
        <SliderMark value={mark4} mt="1" ml="-2.5" fontSize="sm" textAlign="center">
          {Math.round(mark4)}
        </SliderMark>
        <SliderMark value={maxValue} mt="1" ml="-2.5" fontSize="sm" textAlign="center">
          {maxValue}
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="yellow.500"
          color="white"
          placement="top"
          isOpen={showToolTip}
          label={sliderValue}
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    </Box>
  );
}

function DefineIcon({ units }) {
  if (units === 'star') return <StarIcon />;
}
