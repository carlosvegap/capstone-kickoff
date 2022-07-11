import './App.css';
import { useState } from 'react';
import Visitor from '../Visitor/Visitor';

// CONTEXTS
// import LoginContext from '../Contexts/LoginContext';
// import SignUpContext from '../Contexts/SignUpContext';

export default function App() {
  // TODO: Handle state with useContext and useMemo
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('current_user_id') !== null);

  return (
    <div className="App">
      <main>
        {isLoggedIn
          ? <h2>You are logged in</h2>
          : (
            <Visitor
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          )}
      </main>

    </div>
  );
}
