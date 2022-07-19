import './Adventurer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FindAdventure from './FindAdventure/FindAdventure';
import Preference from './Preference/Preference';
import Header from '../Header/Header';

export default function Adventurer({ setIsLoggedIn, isLoggedIn }) {
  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);
  // TODO: Improve header and markup to not repeat unnecesary code
  if (params.page === 'home') {
    return (
      <div className="user">
        <Header onLogOutClick={setIsLoggedIn} />
        <div className="adventure">
          <FindAdventure
            isLoggedIn={isLoggedIn}
          />
          <div className="experienceInfo">
            <h2>Experience Information</h2>
          </div>
        </div>
      </div>
    );
  }
  if (params.page === 'preferences') {
    return (
      <div className="user">
        <Header onLogOutClick={setIsLoggedIn} />
        <div className="filters">

        </div>
        <div className="profile">
          <Preference />
        </div>
      </div>
    );
  }
}
