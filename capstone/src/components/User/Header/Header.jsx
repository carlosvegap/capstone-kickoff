import axios from 'axios';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ setIsLoggedIn }) {
  function handleLogOut() {
    localStorage.removeItem('current_user_id');
    axios.defaults.headers.common = {};
    setIsLoggedIn(false);
  }
  return (
    <Link to="/home">
      <button onClick={handleLogOut} type="button">Log Out</button>
    </Link>
  );
}
