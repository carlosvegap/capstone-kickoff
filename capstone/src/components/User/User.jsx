import './User.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../Contexts/UserContext';
import Header from './Header/Header';

export function userPage(userData) {
  const navigate = useNavigate();
  if (Object.keys(userData).length === 0) {
    return (<h2>Loading ...</h2>);
  }
  if (userData.data.userType === 'adventurer') {
    navigate('/adventurer');
    return (<h2>You logged in as an Adventurer</h2>);
  }
  if (userData.data.userType === 'experienceMaker') {
    navigate('/experience');
    return (<h2>You logged in as an Experience Maker</h2>);
  }

  return (<h2>An error has occurred</h2>);
}

export default function User({ setIsLoggedIn }) {
  const userData = useContext(UserContext);
  return (
    <div className="user">
      <Header setIsLoggedIn={setIsLoggedIn} />
      {userPage(userData)};
    </div>
  );
}

//            {JSON.stringify(userData)}
