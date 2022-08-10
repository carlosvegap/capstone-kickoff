import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useContext } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import axios from 'axios';
import FindAdventure from './FindAdventure/FindAdventure';
import Preference from './Preference/Preference';
import Header from '../Header/Header';
import ExperienceInfo from './ExperienceInfo/ExperienceInfo';
import UserContext from '../../../Contexts/UserContext';

// CONTEXTS
import AdventurerContext from '../../../Contexts/AdventurerContext';
import FeedbackContext from '../../../Contexts/FeedbackContext';

const baseURL = process.env.REACT_APP_BASE_URL;

async function getNearbyRestaurants(lat, lng, username) {
  return axios.get(`${baseURL}/adventure/restaurants`, {
    params: { lat, lng },
    headers: { username },
  });
}

async function getAllFeedbackInfo() {
  return axios.get(`${baseURL}/adventure/preferences/all`);
}

export default function Adventurer({ setIsLoggedIn, isLoggedIn }) {
  const { username } = useContext(UserContext);
  // STATES
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [feedbackInfo, setFeedbackInfo] = useState([]);
  const [indexRestaurant, setIndexRestaurant] = useState(0);

  // MEMO VALUES
  const mapData = useMemo(
    () => ({
      currentPosition,
      isDataFetched,
      restaurants,
    }),
    [currentPosition, isDataFetched, restaurants],
  );

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
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [isLoggedIn]);

  // store the value after adventure/ route in params
  const params = useParams();
  // Fetch restaurants
  useEffect(() => {
    if (
      currentPosition.lat === 0 ||
      currentPosition.lng === 0 ||
      params.page !== 'home' ||
      !username
    ) {
      // Avoid wasting time if it is not at home, by not looking at restaurants
      setRestaurants([]);
      getAllFeedbackInfo().then((res) => setFeedbackInfo(res.data));
    } else {
      Promise.all([
        getNearbyRestaurants(
          currentPosition.lat,
          currentPosition.lng,
          username,
        ),
        getAllFeedbackInfo(),
      ]).then(([resRestaurants, resFeedback]) => {
        setRestaurants(resRestaurants.data);
        setFeedbackInfo(resFeedback.data);
        setIsDataFetched(true);
      });
    }
  }, [
    currentPosition,
    setCurrentPosition,
    setRestaurants,
    params,
    username,
    setFeedbackInfo,
  ]);
  if (params.page === 'home') {
    return (
      <Box height="55vw">
        <Header onLogOutClick={setIsLoggedIn} userType="adventurer" />
        <AdventurerContext.Provider value={mapData}>
          <FeedbackContext.Provider value={feedbackInfo}>
            <HStack height="100%">
              <FindAdventure onSelectRestaurant={setIndexRestaurant}/>
              <ExperienceInfo onUpdateRestaurants={setRestaurants} indexRestaurant={indexRestaurant} onSelectRestaurant={setIndexRestaurant} />
            </HStack>
          </FeedbackContext.Provider>
        </AdventurerContext.Provider>
      </Box>
    );
  }
  if (params.page === 'preferences') {
    return (
      <div className="user">
        <Header onLogOutClick={setIsLoggedIn} userType="adventurer" />
        <FeedbackContext.Provider value={feedbackInfo}>
          <Preference />
        </FeedbackContext.Provider>
      </div>
    );
  }
}
