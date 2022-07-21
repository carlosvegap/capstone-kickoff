import {
  Box, Checkbox, Badge, HStack, Slider, SliderMark, SliderTrack,
  SliderFilledTrack, Tooltip, SliderThumb, Button, VStack,
} from '@chakra-ui/react';
import { StarIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState } from 'react';

// Top part of the filter options: set a minimum value for preference, read its name and delete it
function FilterControls({ setShowMinimumValues, priority, displayText }) {
  return (
    <Box>
      <HStack spacing="40px" mb="20px">
        <Checkbox
          ml="45px"
          onChange={(e) => setShowMinimumValues(e.target.checked)}
        />
        <Badge> {priority} </Badge>
        <Badge> {displayText} </Badge>
        <Button
          rightIcon={<DeleteIcon />}
          colorScheme="red"
          variant="outline"
          alignSelf="right"
        >
          Delete
        </Button>
      </HStack>
    </Box>
  );
}

// Slider to control the minimum value for the preference
function SliderControl({
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

export default function FilterArea({
  id,
  displayText,
  priority,
  minValue,
  maxValue,
  defaultValue,
  step,
  units,
}) {
  const [showMinimumValues, setShowMinimumValues] = useState(false);
  return (
    <Box>
      <FilterControls
        setShowMinimumValues={setShowMinimumValues}
        priority={priority}
        displayText={displayText}
      />
      {showMinimumValues
        && (
        <SliderControl
          key={id}
          id={id}
          minValue={minValue}
          maxValue={maxValue}
          defaultValue={defaultValue}
          step={step}
          units={units}
        />
        )}

    </Box>
  );
}

function DefineIcon({ units }) {
  if (units === 'star') return <StarIcon />;
}
