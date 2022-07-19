import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ onLogOutClick }) {
  const navigate = useNavigate();
  function handleLogOut() {
    localStorage.removeItem(process.env.REACT_APP_USER_KEY);
    axios.defaults.headers.common = {};
    onLogOutClick(false);
    navigate('/');
  }
  function handlePreferences() {
    navigate('/adventurer/preferences');
  }
  function handleLogo() {
    navigate('/adventurer/home');
  }
  const headerValues = [
    { id: 'logo', displayText: 'Logo', onClick: () => handleLogo() },
    { id: 'explore', displayText: 'Explore an Adventure', onClick: null },
    { id: 'preferences', displayText: 'Preferences', onClick: () => handlePreferences() },
    { id: 'logOut', displayText: 'Log Out', onClick: () => handleLogOut() }];
  return (
    <header>
      {headerValues.map((button) => (
        <HeaderButton
          key={button.id}
          displayText={button.displayText}
          onClickHandler={button.onClick}
        />
      ))}
    </header>
  );
}

function HeaderButton({ displayText, onClickHandler }) {
  return (
    <button type="button" onClick={onClickHandler}>{displayText}</button>
  );
}
