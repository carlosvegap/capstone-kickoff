import { Box } from '@chakra-ui/react';
import SettingsControls from '../../../SettingsControls';
import SliderControls from './SliderControls';

export default function FilterArea({
  id,
  displayText,
  priority,
  index,
  minValue,
  maxValue,
  defaultValue,
  step,
  units,
  isDirectlyProportional,
  handleDelete,
  hasMinValue,
  onChangeHasMinValue,
  onChangeMinValue,
}) {
  return (
    <Box bg="white" overflow="auto" mt="10px" borderRadius="10px">
      <SettingsControls
        id={id}
        hasMinValue={hasMinValue}
        index={index}
        priority={priority}
        displayText={displayText}
        handleDelete={handleDelete}
        isAdventurer
        onChangeHasMinValue={onChangeHasMinValue}
      />
      {hasMinValue && (
        <SliderControls
          key={id}
          index={index}
          id={id}
          minValue={minValue}
          maxValue={maxValue}
          defaultValue={defaultValue}
          isDirectlyProportional={isDirectlyProportional}
          step={step}
          units={units}
          onChangeMinValue={onChangeMinValue}
        />
      )}
    </Box>
  );
}
