import './Visitor.css';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';

export default function Visitor({ setIsLoggedIn }) {
  return (
    <div className="visitor">
      <Login
        setIsLoggedIn={setIsLoggedIn}
      />
      <SignUp />
    </div>
  );
}
