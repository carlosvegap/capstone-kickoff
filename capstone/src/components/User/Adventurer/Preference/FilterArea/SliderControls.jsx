import {
  Badge, Slider, SliderMark, SliderTrack,
  SliderFilledTrack, Tooltip, SliderThumb, VStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useState } from 'react';

function DefineIcon({ units }) {
  if (units === 'star') return <StarIcon />;
}

// Slider to control the minimum value for the preference
export default function SliderControls({
  id,
  minValue,
  maxValue,
  defaultValue,
  step,
  units,
}) {
  const markSpace = maxValue / 5;
  const [sliderValue, setSliderValue] = useState(defaultValue);
  const [showToolTip, setShowTooltip] = useState(false);
  return (
    <VStack mb="40px">
      <Badge colorScheme="yellow"> {sliderValue} <DefineIcon units={units} /> or more </Badge>
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
        {[markSpace, 2 * markSpace, 3 * markSpace, 4 * markSpace, maxValue].map(
          (interval) => (
            <SliderMark
              value={interval}
              mt="1"
              ml="-2.5"
              fontSize="sm"
              textAlign="center"
            >
              {Math.round(interval)}{' '}
            </SliderMark>
          ),
        )}
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
    </VStack>
  );
}
