import './FindAdventure.css';
import { useState } from 'react';
import Map from './Map/Map';

export default function FindAdventure() {
  const [displayExperience, setDisplayExperience] = useState('map');
  return (
    <div className="findAdventure">
      <h2>Find your next adventure:</h2>
      <ExperienceDisplayer
        displayExperience={displayExperience}
        setDisplayExperience={setDisplayExperience}
      />
      <Map />
    </div>
  );
}

export function ExperienceDisplayer({ displayExperience, setDisplayExperience }) {
  if (displayExperience === 'map') {
    return (
      <div className="experienceDisplayer">
        <button type="button" value="map" className="chosenDisplay" disabled>Map</button>
        <button type="button" value="list" className="notChosenDisplay" onClick={(e) => setDisplayExperience(e.target.value)}>List</button>
      </div>
    );
  }
  return (
    <div className="experienceDisplayer">
      <button type="button" value="map" className="notChosenDisplay" onClick={(e) => setDisplayExperience(e.target.value)}>Map</button>
      <button type="button" value="list" className="chosenDisplay" disabled>List</button>
    </div>
  );
}
