import './User.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../Contexts/UserContext';
import Header from './Header/Header';
import Adventurer from './Adventurer/Adventurer';

export function UserPage() {
  const userData = useContext(UserContext);
  const navigate = useNavigate();
  console.log(userData);
  if (userData == null) {
    return <h2>Loading ...</h2>;
  }
  if (userData.data.userType === 'adventurer') {
    navigate('/adventurer');
    return <Adventurer />;
  }
  if (userData.data.userType === 'experienceMaker') {
    navigate('/experience');
    return <h2>You logged in as an Experience Maker</h2>;
  }

  return <h2>An error has occurred</h2>;
}

export default function User({ setIsLoggedIn }) {
  return (
    <div className="user">
      <Header setIsLoggedIn={setIsLoggedIn} />
      <UserPage />
    </div>
  );
}

//            {JSON.stringify(userData)}
