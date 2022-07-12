import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Visitor from '../Visitor/Visitor';
import User from '../User/User';

// CONTEXTS
import UserContext from '../../Contexts/UserContext';
// import SignUpContext from '../Contexts/SignUpContext';

export async function getUserInfo(userId) {
  const values = { objectId: userId };
  const baseURL = 'http://localhost:3001';
  return axios.post(`${baseURL}/visitor/user`, values);
}

export default function App() {
  // TODO: Handle state with useContext and useMemo
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('current_user_id') != null);
  const [userData, setUserData] = useState({});
  async function retrieveUserData() {
    try {
      const data = await getUserInfo(localStorage.getItem('current_user_id'));
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  }
  // runs on first load and anytime something changes
  useEffect(() => {
    if (isLoggedIn) {
      retrieveUserData();
    }
    else {
      setUserData({});
    }
  }, [isLoggedIn]);
  return (
    <div className="App">
      <BrowserRouter>
        <main>
          {isLoggedIn
            ? (
              <UserContext.Provider value={userData}>
                <User setIsLoggedIn={setIsLoggedIn} />
              </UserContext.Provider>
            )
            : (
              <Visitor
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            )}
        </main>

      </BrowserRouter>
    </div>
  );
}
