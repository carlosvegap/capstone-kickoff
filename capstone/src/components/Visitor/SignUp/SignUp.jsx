import './SignUp.css';
import { useState } from 'react';
import axios from 'axios';
import UserDecision from './UserDecision/UserDecision';

export default function SignUp() {
  const baseURL = 'http://localhost:3001';
  // STATES
  const [signUpUser, setSignUpUser] = useState('adventurer');
  const [isSignedUp, setIsSignUp] = useState(false);
  const [signUpForm, setSignUp] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    age: null,
    about: '',
    profilePhoto: '',
    userType: '',
  });
  // HANDLERS
  function handleOnClickUserButton(buttonName) {
    setSignUpUser(buttonName);
  }
  function handleOnSignUpChange(inputName, value) {
    if (inputName === 'age') {
      if (value === '') setSignUp({ ...signUpForm, [inputName]: null });
      else setSignUp({ ...signUpForm, [inputName]: Number(value) });
    } else setSignUp({ ...signUpForm, [inputName]: value });
  }
  async function handleSubmitSignUp() {
    console.log('signing up');
    try {
      const res = await axios.post(`${baseURL}/visitor/signUp`, {
        firstName: signUpForm.firstName,
        lastName: signUpForm.lastName,
        username: signUpForm.username,
        password: signUpForm.password,
        email: signUpForm.email,
        age: signUpForm.age,
        about: signUpForm.about,
        userType: signUpUser,
        // DONT FORGET WORK ON PROFILE PICTURE!
      });
      setIsSignUp(true);
      console.log(res);
      // handleLogin(res.data.user)
    } catch (err) {
      // alert(err);
    }
  }
  let successSignUpClass = 'notSignedUpClass';
  if (isSignedUp) successSignUpClass = 'signedUpClass';
  return (
    <div className="signUp">
      <h2>Sign Up</h2>
      <UserDecision
        signUpUser={signUpUser}
        handleOnClickUserButton={handleOnClickUserButton}
      />
      <div className="signUpForm">
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          value={signUpForm.firstName}
          onChange={
                  (e) => handleOnSignUpChange(e.target.name, e.target.value)
              }
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={signUpForm.lastName}
          onChange={
                  (e) => handleOnSignUpChange(e.target.name, e.target.value)
              }
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={signUpForm.age}
          onChange={
                  (e) => handleOnSignUpChange(e.target.name, e.target.value)
              }
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={signUpForm.username}
          onChange={
                  (e) => handleOnSignUpChange(e.target.name, e.target.value)
              }
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={signUpForm.password}
          onChange={
                  (e) => handleOnSignUpChange(e.target.name, e.target.value)
              }
        />
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          value={signUpForm.email}
          onChange={
                  (e) => handleOnSignUpChange(e.target.name, e.target.value)
              }
        />
      </div>
      <span className={successSignUpClass}> Successfully signed up! </span>
      <button type="submit" className="submit" onClick={handleSubmitSignUp}>Sign Up</button>
    </div>
  );
}
