import './App.css';
import Home from "../Visitor/Home/Home"
import LoginContext from '../Contexts/LoginContext';

import {useState} from "react";

export default function App() {
  // STATES
  const [loginForm, setLogin] = useState({
    username: '',
    password: '',
  })

  // HANDLERS
  function handleOnLoginFormChange(inputName, value){
    setLogin({...loginForm, [inputName]: value})
  }

  return (
    <div className="App">
      <main>
        <LoginContext.Provider value={{loginForm, handleOnLoginFormChange}}>
          <Home />
        </LoginContext.Provider>
      </main>

    </div>
  );
}