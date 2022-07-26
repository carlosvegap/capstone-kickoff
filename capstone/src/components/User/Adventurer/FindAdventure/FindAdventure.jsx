import './FindAdventure.css';
import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import Map from './Map/Map';
import List from './List/List';

export default function FindAdventure() {
  const [displayExperience, onSelectDisplay] = useState('map');
  return (
    <div className="findAdventure">
      <h2>Find your next adventure:</h2>
      <div className="experienceDisplayer">
        <ExperienceViewButton value="map" display="Map" displayExperience={displayExperience} onSelectDisplay={onSelectDisplay} />
        <ExperienceViewButton value="list" display="List" displayExperience={displayExperience} onSelectDisplay={onSelectDisplay} />
      </div>
      {displayExperience === 'map' ? <Map /> : <List />}
    </div>
  );
}

function ExperienceViewButton({ value, displayExperience, onSelectDisplay, display }) {
  if (displayExperience === value) {
    return (
      <Button value={value} colorScheme="blue" variant="outline" disabled>
        {display}
      </Button>
    );
  }
  return (
    <Button value={value} colorScheme="blue" onClick={() => onSelectDisplay(value)}>
      {display}
    </Button>
  );
}
