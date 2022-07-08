import './App.css';
import { useState } from 'react';
import axios from 'axios';
import Visitor from '../Visitor/Visitor';

// CONTEXTS
// import LoginContext from '../Contexts/LoginContext';
// import SignUpContext from '../Contexts/SignUpContext';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('current_user_id') !== null);

  const addAuthenticationHeader = () => {
    const currentUserId = localStorage.getItem('current_user_id');
    if (currentUserId !== null) {
      axios.defaults.headers.common = {
        current_user_id: currentUserId,
      };
    }
  };
  addAuthenticationHeader();

  // const handleLogout = () => {
  //   localStorage.removeItem('current_user_id')
  //   axios.defaults.headers.common = {};
  //   setIsLoggedIn(false);
  // };

  // const handleLogin = (user) => {
  //   console.log(user);
  //   localStorage.setItem('current_user_id', user.objectId);
  //   addAuthenticationHeader();

  //   setIsLoggedIn(true);
  // };

  return (
    <div className="App">
      <main>
        {isLoggedIn
          ? <h2>You are looged in</h2>
          : <Visitor /> }
      </main>

    </div>
  );
}
