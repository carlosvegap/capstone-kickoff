import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../../../Contexts/UserContext';
import Header from '../Header/Header';
import RegisterExperience from './RegisterExperience/RegisterExperience';

async function getExperienceInfo(username) {
  const values = { username };
  const baseURL = process.env.REACT_APP_BASE_URL;
  return axios.post(`${baseURL}/experience/info`, values);
}

export default function Experience({ setIsLoggedIn, isLoggedIn }) {
  // Get user's information
  const { firstName, username, userType } = useContext(UserContext);
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
          }
          setIsLoading(false);
        });
    }
  }, [isLoggedIn, username, setIsLoading]);

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
      <>
        <Header userType={userType} onLogOutClick={setIsLoggedIn} />
        <RegisterExperience />
      </>
    );
  }
}
