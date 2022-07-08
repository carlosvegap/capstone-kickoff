// import { useContext } from 'react';
// import LoginContext from '../../../Contexts/LoginContext';
import { useState } from 'react';
import './Login.css';

export default function Login() {
  // STATES
  const [loginForm, setLogin] = useState({
    username: '',
    password: '',
  });

  // HANDLERS
  function handleOnLoginChange(inputName, value) {
    setLogin({ ...loginForm, [inputName]: value });
  }
  return (
    <div className="login">
      <h2>Log In</h2>
      <div className="loginForm">
        <input name="username" type="text" placeholder="Username" value={loginForm.username} onChange={(e) => handleOnLoginChange(e.target.name, e.target.value)} />
        <input name="password" type="password" placeholder="Password" value={loginForm.password} onChange={(e) => handleOnLoginChange(e.target.name, e.target.value)} />
      </div>
      <button className="submit" type="submit">Login</button>
    </div>
  );
}
