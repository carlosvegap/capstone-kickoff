import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useContext } from 'react';
import {
  Box, HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import FindAdventure from './FindAdventure/FindAdventure';
import Preference from './Preference/Preference';
import Header from '../Header/Header';
import ExperienceInfo from './ExperienceInfo/ExperienceInfo';
import UserContext from '../../../Contexts/UserContext';

// CONTEXTS
import AdventurerContext from '../../../Contexts/AdventurerContext';

const baseURL = process.env.REACT_APP_BASE_URL;

function getNearbyRestaurants(lat, lng, username) {
  const values = { lat, lng, username };
  return axios.post(`${baseURL}/adventure/restaurants`, values);
}

export default function Adventurer({ setIsLoggedIn, isLoggedIn }) {
  const { username } = useContext(UserContext);
  // STATES
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  // MEMO VALUES
  // QUESTION: Is memo giving me troubles?
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

  // store the value after adventure/ route in params
  const params = useParams();
  // Fetch restaurants
  useEffect(() => {
    if (currentPosition.lat === 0 || currentPosition.lng === 0 || params.page !== 'home' || !username) {
      setRestaurants([]);
    } else {
      getNearbyRestaurants(currentPosition.lat, currentPosition.lng, username)
        .then((res) => { setRestaurants(res.data); setIsDataFetched(true); });
    }
  }, [currentPosition, setCurrentPosition, setRestaurants, params, username]);

  if (params.page === 'home') {
    return (
      <Box height="55vw">
        <Header onLogOutClick={setIsLoggedIn} userType="adventurer" />
        <AdventurerContext.Provider
          value={mapData}
        >
          <HStack height="100%">
            <FindAdventure />
            <ExperienceInfo restaurants={restaurants} />
          </HStack>
        </AdventurerContext.Provider>
      </Box>
    );
  }
  if (params.page === 'preferences') {
    return (
      <div className="user">
        <Header onLogOutClick={setIsLoggedIn} userType="adventurer" />
        <div className="filters">
          <Preference />
        </div>
      </div>
    );
  }
}
