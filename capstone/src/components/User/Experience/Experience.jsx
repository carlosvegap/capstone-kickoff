import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useContext } from 'react';
import UserContext from '../../../Contexts/UserContext';
import Header from '../Header/Header';
import RegisterExperience from './RegisterExperience/RegisterExperience';
import Feedback from './Feedback/Feedback';

export default function Experience({ setIsLoggedIn, isLoggedIn }) {
  // Get user's information
  const {
    firstName,
    lastName,
    username,
    age,
    userType,
    createdAt,
    updatedAt,
    ACL,
    objectId,
    experienceId,
  } = useContext(UserContext);

  const navigate = useNavigate();
  // Check if user is logged in or if is missing to complete their profile
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
    if (experienceId == null) {
      navigate('/experience/myExperience');
    }
  }, [isLoggedIn]);

  // store the value after experience/ route in params
  const params = useParams();
  if (params.page === 'home') {
    return (
      <>
        <Header userType={userType} onLogOutClick={setIsLoggedIn} />
        <h2>Welcome Experience Maker: {firstName}</h2>
      </>
    );
  }
  if (params.page === 'myExperience') {
    return (
      <>
        <Header userType={userType} onLogOutClick={setIsLoggedIn} />
        <RegisterExperience />
        <Feedback />
      </>
    );
  }
}
