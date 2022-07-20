import './Preference.css';
import { Box } from '@chakra-ui/react';
import FilterArea from './FilterArea/FilterArea';

export default function Preference() {
  return (
    <div className="filterExperience">
      <div className="filterOptions">
        <h2>Define your adventure path</h2>
        <Box p="10px" overflow="auto">
          <Box width="100px" textAlign="center" mb="20px">
            Set minimum value
          </Box>
          <FilterArea
            id="cleansiness"
            displayText="Cleansiness"
            priority={1}
            minValue={0}
            maxValue={5}
            step={0.1}
            defaultValue={0}
            units="stars"
          />
        </Box>
        <button type="button" value="add" className="addFilter">Add preferences</button>
      </div>
      <div className="profile">
        <h2>Define your adventurer profile</h2>
      </div>
    </div>
  );
}
