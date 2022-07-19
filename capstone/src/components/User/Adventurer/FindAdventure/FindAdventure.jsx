import './FindAdventure.css';
import { useState } from 'react';
import Map from './Map/Map';

export default function FindAdventure() {
  const [displayExperience, onSelectDisplay] = useState('map');
  return (
    <div className="findAdventure">
      <h2>Find your next adventure:</h2>
      <div className="experienceDisplayer">
        <ExperienceViewButton value="map" display="Map" displayExperience={displayExperience} onSelectDisplay={onSelectDisplay} />
        <ExperienceViewButton value="list" display="List" displayExperience={displayExperience} onSelectDisplay={onSelectDisplay} />
      </div>
      <Map />
    </div>
  );
}

function ExperienceViewButton({ value, displayExperience, onSelectDisplay, display }) {
  if (displayExperience === value) {
    return <button type="button" value={value} className="chosenDisplay" disabled>{display}</button>;
  }
  return <button type="button" value={value} className="notChosenDisplay" onClick={() => onSelectDisplay(value)}>{display}</button>;
}
