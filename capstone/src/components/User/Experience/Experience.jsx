import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import axios from 'axios';
import Header from '../Header/Header';
import RegisterExperience from './RegisterExperience/RegisterExperience';
import Feedback from './Feedback/Feedback';

// CONTEXTS
import UserContext from '../../../Contexts/UserContext';
import FeedbackContext from '../../../Contexts/FeedbackContext';

const baseURL = process.env.REACT_APP_BASE_URL;

async function getExperienceInfo(username) {
  return axios.get(`${baseURL}/experience/info`, { headers: { username } });
}

async function getAllFeedbackInfo() {
  return axios.get(`${baseURL}/experience/preferences/all`);
}

export default function Experience({ setIsLoggedIn, isLoggedIn }) {
  const { firstName, username, userType } = useContext(UserContext);
  const [feedbackInfo, setFeedbackInfo] = useState([]);
  const [experienceData, setExperienceData] = useState({
    name: '',
    address: '',
    lat: 0,
    lng: 0,
    email: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // If they are loggedIn, check if has chosen experience values
  // Check if user is logged in, if not send him back home
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else if (username != null) {
      Promise.all([getExperienceInfo(username), getAllFeedbackInfo()]).then(
        ([expRes, feedbackRes]) => {
          setExperienceData(expRes.data);
          // If there are no values for a field
          // send to that page to promote submission.
          // Otherwise, just set values in state
          if (
            !(Object.keys(expRes.data).every(
              (experienceFieldID) => expRes.data[experienceFieldID] !== '' || experienceFieldID === 'description',
            ))
          ) {
            navigate('/experience/myExperience', { replace: true });
          }
          setFeedbackInfo(feedbackRes.data);
          setIsLoading(false);
        },
      );
    }
  }, [isLoggedIn, username, setIsLoading, setExperienceData, setFeedbackInfo]);

  // store the value after experience/ route in params
  const params = useParams();
  if (params.page === 'home' && !isLoading) {
    return (
      <>
        <Header userType={userType} onLogOutClick={setIsLoggedIn} />
        <h2>Welcome Experience Maker: {firstName}</h2>
      </>
    );
  }
  if (params.page === 'myExperience' && !isLoading) {
    return (
      <Box>
        <FeedbackContext.Provider value={feedbackInfo}>
          <Header userType={userType} onLogOutClick={setIsLoggedIn} />
          <HStack alignItems="center">
            <RegisterExperience
              experienceValues={experienceData}
              setExperienceValues={setExperienceData}
            />
            <Feedback />
          </HStack>
        </FeedbackContext.Provider>
      </Box>
    );
  }
}
