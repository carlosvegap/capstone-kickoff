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
  // const loginObject = useContext(LoginContext);
  return (
    <div className="login">
      <h2>Log In</h2>
      <input name="username" type="text" placeholder="username" value={loginForm.username} onChange={(e) => handleOnLoginChange(e.target.name, e.target.value)} />
      <input name="password" type="password" placeholder="password" value={loginForm.password} onChange={(e) => handleOnLoginChange(e.target.name, e.target.value)} />
      <button type="submit">Login</button>
    </div>
  );
}
