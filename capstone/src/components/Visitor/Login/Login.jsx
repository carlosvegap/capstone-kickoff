import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export function logIn(formValues) {
  const baseURL = process.env.REACT_APP_BASE_URL;
  return axios.post(`${baseURL}/visitor/logIn`, {}, {
    headers: {
      username: formValues.username,
      password: formValues.password,
    },
  });
}

export function resetForm(setLogIn) {
  setLogIn({
    username: '',
    password: '',
  });
}

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  // STATES
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLogin] = useState({
    username: '',
    password: '',
  });

  // HANDLERS
  function handleOnLoginChange(inputName, value) {
    setLogin({ ...loginForm, [inputName]: value });
  }
  async function handleSubmitLogIn() {
    setLoginError('');
    try {
      const res = await logIn(loginForm);
      // Note: This isn't a secure practice, but is convenient for prototyping.
      // In production, you would add an access token instead of (or in addition to)
      // the user id, in order to authenticate the request
      localStorage.setItem(
        process.env.REACT_APP_USER_KEY,
        res.data.user.objectId,
      );
      axios.defaults.headers.common = {
        current_user_id: res.data.user.objectId,
      };
      setIsLoggedIn(true);
      const { userType } = res.data.user;
      if (userType === 'adventurer') {
        navigate('/adventurer/home');
      }
      if (userType === 'experienceMaker') {
        navigate('/experience/home');
      }
    } catch (err) {
      setLoginError(err.response.data.error);
      resetForm(setLogin);
    }
  }
  return (
    <div className="login">
      <h2>Log In</h2>
      <div className="loginForm">
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={loginForm.username}
          onChange={(e) => handleOnLoginChange(e.target.name, e.target.value)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) => handleOnLoginChange(e.target.name, e.target.value)}
        />
      </div>
      {loginError !== '' ? (
        <span className="errorMessage">{loginError.message}</span>
      ) : null}
      <button onClick={handleSubmitLogIn} className="submit" type="submit">
        Login
      </button>
    </div>
  );
}
