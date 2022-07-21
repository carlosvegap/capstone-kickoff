import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useContext } from 'react';
import UserContext from '../../../Contexts/UserContext';

export default function Experience({ setIsLoggedIn, isLoggedIn }) {
  // Check if user is logged in
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

  // Get user's information
  const {
    firstName, lastName, username, age, userType, createdAt, updatedAt, ACL, objectId,
  } = useContext(UserContext);

  // store the value after experience/ route in params
  const params = useParams();
  if (params.page === 'home') {
    return (
      <h2>Welcome Experience Maker: {firstName}</h2>
    );
  }
}
