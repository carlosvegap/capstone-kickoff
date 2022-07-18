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
  const headerValues = [
    { id: 'logo', displayText: 'Logo', onClick: null },
    { id: 'explore', displayText: 'Explore an Adventure', onClick: null },
    { id: 'preferences', displayText: 'Preferences', onClick: null },
    { id: 'logOut', displayText: 'Log Out', onClick: () => handleLogOut(onLogOutClick) }];
  return (
    <header>
      {headerValues.map((button) => (
        <HeaderButton
          key={button.id}
          displayText={button.displayText}
          onClickHandler={button.onClick}
        />
      ))}
      {/* <button type="button">Logo</button>
      <button type="button">Explore an adventure</button>
      <button type="button">Settings</button>
      <button onClick={handleLogOut} type="button">Log Out</button> */}
    </header>
  );
}

function HeaderButton({ displayText, onClickHandler }) {
  return (
    <button type="button" onClick={onClickHandler}>{displayText}</button>
  );
}
