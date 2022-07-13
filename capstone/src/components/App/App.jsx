import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Routes } from 'react-router';
import axios from 'axios';
import Visitor from '../Visitor/Visitor';
import Adventurer from '../User/Adventurer/Adventurer';

// CONTEXTS
import UserContext from '../../Contexts/UserContext';

export async function getUserInfo(userId) {
  const values = { objectId: userId };
  const baseURL = 'http://localhost:3001';
  return axios.post(`${baseURL}/visitor/user`, values);
}

export default function App() {
  // TODO: Handle state with useContext and useMemo
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('current_user_id') != null);
  const [userData, setUserData] = useState(null);
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
    } else {
      setUserData(null);
    }
  }, [isLoggedIn]);
  return (
    <div className="App">
      <UserContext.Provider value={userData}>
        <BrowserRouter>
          <main>
            <Routes>
              <Route
                path="/"
                element={(
                  <Visitor
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                )}
              />
              <Route
                path="/adventurer"
                element={<Adventurer isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
              />
              {/* <Route path="/experience">
                <Experience></Experience>
              </Route> */}
            </Routes>
          </main>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}
