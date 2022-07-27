import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import SettingsControls from '../../../SettingsControls';
import SliderControls from './SliderControls';

export default function FilterArea({
  id, displayText, priority, minValue, maxValue, defaultValue, step, units, handleDelete,
}) {
  const [showMinimumValues, setShowMinimumValues] = useState(false);
  return (
    <Box>
      <SettingsControls
        setShowMinimumValues={setShowMinimumValues}
        id={id}
        priority={priority}
        displayText={displayText}
        handleDelete={handleDelete}
        isAdventurer
      />
      {showMinimumValues
        && (
        <SliderControls
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
