import './Adventurer.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import FindAdventure from './FindAdventure/FindAdventure';
import Header from '../Header/Header';

export default function Adventurer({ setIsLoggedIn, isLoggedIn }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);
  return (
    <div className="user">
      <Header onLogOutClick={setIsLoggedIn} />
      <div className="adventure">
        <FindAdventure
          isLoggedIn={isLoggedIn}
        />
        <div className="profile">
          <h2>History</h2>
        </div>
      </div>
    </div>
  );
}
