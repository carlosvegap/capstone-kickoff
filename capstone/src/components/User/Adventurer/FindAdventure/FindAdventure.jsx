import { useState } from 'react';
import { Button, Heading, Box } from '@chakra-ui/react';
import Map from './Map/Map';
import List from './List/List';

export default function FindAdventure({ onSelectRestaurant }) {
  const [displayExperience, onSelectDisplay] = useState('map');
  return (
    <Box width="50%" height="100%" padding="20px" bg="gray.200" overflow="auto">
      <Heading as="h2" mt="10px" mb="10px" textAlign="center">
        Find your next adventure:
      </Heading>
      <Box justifyContent="center" display="flex">
        <ExperienceViewButton
          value="map"
          display="Map"
          displayExperience={displayExperience}
          onSelectDisplay={onSelectDisplay}
        />
        <ExperienceViewButton
          value="list"
          display="List"
          displayExperience={displayExperience}
          onSelectDisplay={onSelectDisplay}
        />
      </Box>
      {displayExperience === 'map' 
        ? <Map onSelectRestaurant={onSelectRestaurant}/>
        : <List onSelectRestaurant={onSelectRestaurant}/>}
    </Box>
  );
}

function ExperienceViewButton({
  value,
  displayExperience,
  onSelectDisplay,
  display,
}) {
  if (displayExperience === value) {
    return (
      <Button value={value} colorScheme="blue" variant="outline" disabled>
        {display}
      </Button>
    );
  }
  return (
    <Button
      value={value}
      colorScheme="blue"
      onClick={() => onSelectDisplay(value)}
    >
      {display}
    </Button>
  );
}
