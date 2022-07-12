import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ setIsLoggedIn }) {
  const navigate = useNavigate();
  function handleLogOut() {
    localStorage.removeItem('current_user_id');
    axios.defaults.headers.common = {};
    setIsLoggedIn(false);
    navigate('/', { replace: true });
  }
  return (
    <button onClick={handleLogOut} type="button">Log Out</button>
  );
}
