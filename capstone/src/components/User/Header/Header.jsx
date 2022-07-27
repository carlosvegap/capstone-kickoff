import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HStack, Button } from '@chakra-ui/react';

export default function Header({ userType, onLogOutClick }) {
  const navigate = useNavigate();
  // General handlers
  function handleLogOut() {
    localStorage.removeItem(process.env.REACT_APP_USER_KEY);
    axios.defaults.headers.common = {};
    // QUESTION: Do I need to set login status to false?
    // Will App.jsx 26 trigger default status again?
    onLogOutClick(false);
    navigate('/');
  }
  function handleLogo(user) {
    navigate(`/${user}/home`);
  }
  // Adventurer handlers
  function handlePreferences() {
    navigate('/adventurer/preferences');
  }
  // Experience maker handlers
  function handleMyExperience() {
    navigate('/experience/myExperience');
  }
  const headerAdventurer = [
    { id: 'logo', displayText: 'Logo', onClick: () => handleLogo('adventurer') },
    { id: 'explore', displayText: 'Explore an Adventure', onClick: null },
    { id: 'preferences', displayText: 'Preferences', onClick: () => handlePreferences() },
    { id: 'logOut', displayText: 'Log Out', onClick: () => handleLogOut() },
  ];
  const headerExperience = [
    { id: 'logo', displayText: 'Logo', onClick: () => handleLogo('experience') },
    { id: 'profile', displayText: 'Profile', onClick: null },
    { id: 'myExperience', displayText: 'Your experience', onClick: () => handleMyExperience() },
    { id: 'logOut', displayText: 'Log Out', onClick: () => handleLogOut() },
  ];
  if (userType === 'adventurer') {
    return (
      <HStack display="flex" justifyContent="space-around" bgColor="cyan.600" padding="10px">
        {headerAdventurer.map((button) => (
          <HeaderButton
            key={button.id}
            displayText={button.displayText}
            onClickHandler={button.onClick}
          />
        ))}
      </HStack>
    );
  }
  return (
    <HStack display="flex" justifyContent="space-around" bgColor="cyan.600" padding="10px">
      {headerExperience.map((button) => (
        <HeaderButton
          key={button.id}
          displayText={button.displayText}
          onClickHandler={button.onClick}
        />
      ))}
    </HStack>
  );
}

function HeaderButton({ displayText, onClickHandler }) {
  return (
    <Button onClick={onClickHandler}>{displayText}</Button>
  );
}
