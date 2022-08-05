import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HStack, Button, Image, Text, Icon } from '@chakra-ui/react';
import { TiArrowForward } from 'react-icons/ti';
import { FcPodiumWithSpeaker, FcShop, FcSettings, FcSearch } from 'react-icons/fc';
import Logo from '../../../img/logo.png';

export default function Header({ userType, onLogOutClick }) {
  const navigate = useNavigate();
  // General handlers
  function handleLogOut() {
    localStorage.removeItem(process.env.REACT_APP_USER_KEY);
    axios.defaults.headers.common = {};
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
    {
      id: 'home',
      displayText: 'Home',
      onClick: () => handleLogo('adventurer'),
    },
    { id: 'explore', displayText: 'Explore an Adventure', onClick: null },
    {
      id: 'preferences',
      displayText: 'Preferences',
      onClick: () => handlePreferences(),
    },
    { id: 'logOut', displayText: 'Log Out', onClick: () => handleLogOut() },
  ];
  const headerExperience = [
    {
      id: 'home',
      displayText: 'Home',
      onClick: () => handleLogo('experience'),
    },
    { id: 'profile', displayText: 'Profile', onClick: null },
    {
      id: 'myExperience',
      displayText: 'Your experience',
      onClick: () => handleMyExperience(),
    },
    { id: 'logOut', displayText: 'Log Out', onClick: () => handleLogOut() },
  ];
  if (userType === 'adventurer') {
    return (
      <HStack
        display="flex"
        justifyContent="space-around"
        bgColor="cyan.600"
        padding="10px"
      >
        {headerAdventurer.map((button) => (
          <HeaderButton
            id={button.id}
            key={button.id}
            displayText={button.displayText}
            onClickHandler={button.onClick}
          />
        ))}
      </HStack>
    );
  }
  return (
    <HStack
      display="flex"
      justifyContent="space-around"
      bgColor="cyan.600"
      padding="10px"
    >
      {headerExperience.map((button) => (
        <HeaderButton
          key={button.id}
          id={button.id}
          displayText={button.displayText}
          onClickHandler={button.onClick}
        />
      ))}
    </HStack>
  );
}

function HeaderButton({ id, displayText, onClickHandler }) {
  if (displayText === 'Home') {
    return (
      <HStack
        onClick={onClickHandler}
        bg="white"
        width="120px"
        borderRadius="10px"
        display="flex"
        justifyContent="center"
        _hover={{ cursor: 'pointer', bg: 'gray.100' }}
      >
        <Image src={Logo} width="42px" alt="Dan Abramov" />
        <Text fontWeight="bold">Home</Text>
      </HStack>
    );
  }
  return (
    <Button
      onClick={onClickHandler}
      leftIcon={<DetermineIcon id={id} />}
      bg="white"
    >
      {displayText}
    </Button>
  );
}

function DetermineIcon({ id }) {
  if (id === 'profile') return <Icon as={FcPodiumWithSpeaker} h={8} w={8} />;
  if (id === 'myExperience') return <Icon as={FcShop} h={8} w={8} />;
  if (id === 'logOut') return <Icon as={TiArrowForward} h={8} w={8} />;
  if (id === 'preferences') return <Icon as={FcSettings} h={8} w={8} />;
  if (id === 'explore') return <Icon as={FcSearch} h={8} w={8} />;
  return null;
}
