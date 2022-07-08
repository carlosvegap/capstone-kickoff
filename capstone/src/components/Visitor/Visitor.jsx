import './Visitor.css';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';

export default function Visitor() {
  return (
    <div className="visitor">
      <Login />
      <SignUp />
    </div>
  );
}
