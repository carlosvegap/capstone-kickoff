import './Adventurer.css';
import { useNavigate } from 'react-router-dom';
import FindAdventure from './FindAdventure/FindAdventure';
import Header from '../Header/Header';

export default function Adventurer({ setIsLoggedIn, isLoggedIn }) {
  const navigate = useNavigate();
  if (!isLoggedIn) {
    navigate('/');
    return null;
  }
  return (
    <div className="user">
      <div className="header">
        <Header onLogOutClick={setIsLoggedIn} />
      </div>
      <div className="adventure">
        <FindAdventure />
        <div className="profile">
          <h2>information</h2>
        </div>
      </div>
    </div>
  );
}
