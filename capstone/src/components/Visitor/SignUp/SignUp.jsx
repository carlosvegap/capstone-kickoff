import './SignUp.css';
import { useState } from 'react';
import axios from 'axios';
import UserDecision from './UserDecision/UserDecision';

export function signUp(formValues) {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const values = {
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    username: formValues.username,
    password: formValues.password,
    email: formValues.email,
    age: formValues.age,
    userType: formValues.userType,
    // TODO: DONT FORGET WORK ON PROFILE PICTURE!
  };
  return axios.post(`${baseURL}/visitor/signUp`, values);
}

export function resetForm(setSignUp) {
  setSignUp({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    age: '',
    profilePhoto: '',
    userType: 'adventurer',
  });
}

export default function SignUp() {
  // STATES
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [signedUpError, setSignedUpError] = useState('');
  const [signUpForm, setSignUp] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    age: '',
    profilePhoto: '',
    userType: 'adventurer',
  });
  // HANDLERS
  function handleOnSignUpChange(inputName, value) {
    setIsSignedUp(false);
    if (inputName === 'age') {
      if (value === '') setSignUp({ ...signUpForm, [inputName]: '' });
      else setSignUp({ ...signUpForm, [inputName]: Number(value) });
    } else setSignUp({ ...signUpForm, [inputName]: value });
  }
  async function handleSubmitSignUp() {
    setSignedUpError('');
    try {
      const res = await signUp(signUpForm);
      setIsSignedUp(true);
      console.log(res);
      resetForm(setSignUp);
    } catch (err) {
      setSignedUpError(err.response.data.error);
    }
  }
  return (
    <div className="signUp">
      <h2>Sign Up</h2>
      <UserDecision
        signUpUser={signUpForm.userType}
        handleOnSignUpChange={handleOnSignUpChange}
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
      {signedUpError !== ''
        ? (
          <span className="errorMessage">
            {signedUpError.message}
          </span>
        )
        : null}
      {isSignedUp ? <span className="successMessage"> Successfully signed up! </span> : null}
      <button type="submit" className="submit" onClick={handleSubmitSignUp}>Sign Up</button>
    </div>
  );
}
