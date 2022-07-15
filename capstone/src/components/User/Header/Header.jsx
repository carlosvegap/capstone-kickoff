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
  return (
    <header>
      <button type="button">Logo</button>
      <button type="button">Explore an adventure</button>
      <button type="button">Settings</button>
      <button onClick={handleLogOut} type="button">Log Out</button>
    </header>
  );
}
