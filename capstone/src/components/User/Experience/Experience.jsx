import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import axios from 'axios';
import UserContext from '../../../Contexts/UserContext';
import Header from '../Header/Header';
import RegisterExperience from './RegisterExperience/RegisterExperience';
import Feedback from './Feedback/Feedback';

async function getExperienceInfo(username) {
  const values = { username };
  const baseURL = process.env.REACT_APP_BASE_URL;
  return axios.post(`${baseURL}/experience/info`, values);
}

export default function Experience({ setIsLoggedIn, isLoggedIn }) {
  const { firstName, username, userType } = useContext(UserContext);
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
  // Check if user is logged in or if is missing to complete their profile
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else if (username != null) {
      getExperienceInfo(username)
        .then((res) => {
          if (Object.keys(res.data).length === 0) {
            navigate('/experience/myExperience', { replace: true });
          } else {
            setExperienceData(res.data);
          }
          setIsLoading(false);
        });
    }
  }, [isLoggedIn, username, setIsLoading, setExperienceData]);

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
        <Header userType={userType} onLogOutClick={setIsLoggedIn} />
        <HStack alignItems="flex-start">
          <RegisterExperience
            experienceValues={experienceData}
            setExperienceValues={setExperienceData}
          />
          <Feedback />
        </HStack>
      </Box>
    );
  }
}
