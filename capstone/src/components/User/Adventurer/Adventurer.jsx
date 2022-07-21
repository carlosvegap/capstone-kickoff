import './Adventurer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import FindAdventure from './FindAdventure/FindAdventure';
import Preference from './Preference/Preference';
import Header from '../Header/Header';

// CONTEXTS
import AdventurerContext from '../../../Contexts/AdventurerContext';

const baseURL = process.env.REACT_APP_BASE_URL;

function getNearbyRestaurants(location) {
  return axios.post(`${baseURL}/adventure/restaurants`, location);
}

export default function Adventurer({ setIsLoggedIn, isLoggedIn }) {
  // STATES
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  // MEMO VALUES
  const mapData = useMemo(() => ({
    currentPosition,
    isDataFetched,
    restaurants,
  }), [currentPosition, isDataFetched, restaurants]);

  // Check if user is logged in
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

  // Find current position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
    });
  }, [isLoggedIn]);
  // Fetch closest restaurants
  useEffect(() => {
    if (currentPosition.lat === 0 && currentPosition.lng === 0) {
      setRestaurants([]);
    } else {
      getNearbyRestaurants(currentPosition)
        .then((res) => setRestaurants(res.data));
      setIsDataFetched(true);
    }
  }, [currentPosition, setCurrentPosition, setRestaurants]);

  // store the value after adventure/ route in params
  const params = useParams();
  if (params.page === 'home') {
    return (
      <div className="user">
        <Header onLogOutClick={setIsLoggedIn} />
        <AdventurerContext.Provider
          value={mapData}
        >
          <div className="adventure">
            <FindAdventure />
            <div className="experienceInfo">
              <h2>Experience Information</h2>
            </div>
          </div>
        </AdventurerContext.Provider>
      </div>
    );
  }
  if (params.page === 'preferences') {
    return (
      <div className="user">
        <Header onLogOutClick={setIsLoggedIn} />
        <div className="filters">
          <Preference />
        </div>
      </div>
    );
  }
}
