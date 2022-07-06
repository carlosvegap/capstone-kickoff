import './App.css';
import Home from "../Visitor/Home/Home"

// CONTEXTS
import LoginContext from '../Contexts/LoginContext';
import SignUpContext from '../Contexts/SignUpContext';

import {useState} from "react";
import SignUp from '../Visitor/Home/SignUp/SignUp';

export default function App() {
  // STATES
  const [loginForm, setLogin] = useState({
    username: '',
    password: '',
  })
  const [signUpForm, setSignUp] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    age: -1,
    about: '',
    profilePhoto: ''
  })

  // HANDLERS
  function handleOnLoginChange(inputName, value){
    setLogin({...loginForm, [inputName]: value})
  }
  function handleOnSignUpChange(inputName, value) {
    setSignUp({...signUpForm, [inputName]: value})
  }

  return (
    <div className="App">
      <main>
        <LoginContext.Provider value={{loginForm, handleOnLoginChange}}>
          <SignUpContext.Provider value={{signUpForm, handleOnSignUpChange}}>

            <Home />
          </SignUpContext.Provider>
        </LoginContext.Provider>
      </main>

    </div>
  );
}