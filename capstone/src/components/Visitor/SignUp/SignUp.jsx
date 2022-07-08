// import { useContext } from 'react';
// import SignUpContext from '../../../Contexts/SignUpContext';
import './SignUp.css';
import { useState } from 'react';
import axios from 'axios';

export default function SignUp() {
  // STATES
  const [signUpForm, setSignUp] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    age: -1,
    about: '',
    profilePhoto: '',
  });
  // HANDLERS
  function handleOnSignUpChange(inputName, value) {
    setSignUp({ ...signUpForm, [inputName]: value });
  }
  async function handleSubmitSignUp() {
    console.log('signing up');
    try {
      const res = await axios.post('http://localhost:3001/visitor/signUp', {
        firstName: signUpForm.firstName,
        lastName: signUpForm.lastName,
        username: signUpForm.username,
        password: signUpForm.password,
        email: signUpForm.email,
        age: signUpForm.age,
        about: signUpForm.about,
        // DONT FORGET WORK ON PROFILE PICTURE!
      });
      console.log(res);
      // handleLogin(res.data.user)
    } catch (err) {
      alert(err);
      console.log(err);
    }
  }
  // const signUpObject = useContext(SignUpContext);
  return (
    <div className="signUp">
      <h2>Sign Up</h2>
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
      <button type="submit" onClick={handleSubmitSignUp}>Sign Up</button>
    </div>
  );
}
