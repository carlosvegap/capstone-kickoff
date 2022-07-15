import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Routes } from 'react-router';
import axios from 'axios';
import Visitor from '../Visitor/Visitor';
import Adventurer from '../User/Adventurer/Adventurer';

// CONTEXTS
import UserContext from '../../Contexts/UserContext';

function getCurrentUserID() {
  return localStorage.getItem(process.env.REACT_APP_USER_KEY);
}

export async function getUserInfo(userId) {
  const values = { objectId: userId };
  const baseURL = process.env.REACT_APP_BASE_URL;
  return axios.post(`${baseURL}/visitor/user`, values);
}

export default function App() {
  // TODO: Handle state with useContext and useMemo
  const [isLoggedIn, setIsLoggedIn] = useState(getCurrentUserID() != null);
  const [userData, setUserData] = useState({});
  // runs on first load and anytime something changes
  useEffect(() => {
    const retrieveUserData = async () => {
      const data = await getUserInfo(getCurrentUserID);
      setUserData(data);
    };
    if (isLoggedIn) {
      getUserInfo(getCurrentUserID)
        .then(setUserData)
        .catch(console.error);
    } else {
      setUserData({});
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
