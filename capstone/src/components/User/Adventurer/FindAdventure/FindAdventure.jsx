import './FindAdventure.css';
import { useState } from 'react';
import Map from './Map/Map';

export default function FindAdventure({ isLoggedIn }) {
  const [displayExperience, onSelectDisplay] = useState('map');
  return (
    <div className="findAdventure">
      <h2>Find your next adventure:</h2>
      <div className="experienceDisplayer">
        <ExperienceViewButton value="map" displayExperience={displayExperience} onSelectDisplay={onSelectDisplay} />
        <ExperienceViewButton value="list" displayExperience={displayExperience} onSelectDisplay={onSelectDisplay} />
      </div>
      <Map isLoggedIn={isLoggedIn} />
    </div>
  );
}

function ExperienceViewButton({ value, displayExperience, onSelectDisplay }) {
  if (displayExperience === value) {
    return <button type="button" value={value} className="chosenDisplay" disabled>{value}</button>;
  }
  return <button type="button" value={value} className="notChosenDisplay" onClick={() => onSelectDisplay(value)}>{value}</button>;
}
