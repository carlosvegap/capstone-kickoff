import axios from 'axios';
import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const baseURL = process.env.REACT_APP_BASE_URL;
const preferenceBaseURL = '/adventure/preferences';
const feedbackBaseURL = '/experience/feedback';

function defineURL(userType) {
  const KeysURL = ['inactive', 'active', 'info', 'update'];
  const URL = {};
  KeysURL.forEach((key) => {
    if (userType === 'adventurer') {
      URL[key] = `${baseURL}${preferenceBaseURL}/${key}`;
    } else {
      URL[key] = `${baseURL}${feedbackBaseURL}/${key}`;
    }
  });
  return URL;
}

async function getInactiveIDs(username, URL) {
  const values = { username };
  return axios.post(URL.inactive, values);
}

async function getActiveIDs(username, URL) {
  const values = { username };
  return axios.post(URL.active, values);
}

async function getInfo(IDs, URL) {
  const values = { IDs };
  return axios.post(URL.info, values);
}

async function update(form, URL) {
  return axios.post(URL.update, form);
}

// ONLY FOR ADVENTURER
async function getPriorization(username, userType) {
  if (userType === 'adventurer') {
    const values = { username };
    return axios.post(`${baseURL}${preferenceBaseURL}/prioritize`, values);
  }
  return { res: { data: false } };
}

export default function useSettings(userType, username) {
  const URL = defineURL(userType);
  const isAdventurer = userType === 'adventurer';
  const [activeIDs, setActiveIDs] = useState([]);
  const [inactiveIDs, setInactiveIDs] = useState([]);
  // ONLY FOR ADVENTURER
  const [prioritize, setPrioritize] = useState(false);
  // ONLY FOR ADVENTURER
  function onSwitchChange() {
    setPrioritize(!prioritize);
  }

  // get all active/inactive IDs
  useEffect(() => {
    if (username != null) {
      getActiveIDs(username, URL).then((res) => setActiveIDs(res.data));
      getInactiveIDs(username, URL).then((res) => setInactiveIDs(res.data));
      // ONLY FOR ADVENTURER
      getPriorization(username, userType).then((res) => setPrioritize(res.data));
    }
  }, [username, setActiveIDs, setInactiveIDs, setPrioritize]);

  const [activeInfo, setActiveInfo] = useState([]);
  const [inactiveInfo, setInactiveInfo] = useState([]);
  // get information from the IDs
  useEffect(() => {
    getInfo(activeIDs, URL).then((res) => setActiveInfo(res.data));
  }, [activeIDs, setActiveInfo]);
  useEffect(() => {
    getInfo(inactiveIDs, URL).then((res) => setInactiveInfo(res.data));
  }, [inactiveIDs, setInactiveInfo]);

  // HANDLERS
  function onAdd(id) {
    setActiveIDs([...activeIDs, id]);
    setInactiveIDs(inactiveIDs.filter((inactiveID) => inactiveID !== id));
  }
  function onDelete(id) {
    setInactiveIDs([...inactiveIDs, id]);
    setActiveIDs(activeIDs.filter((activeID) => activeID !== id));
  }
  const toast = useToast();
  function submissionMessage(isSubmitted) {
    const adventurerTitle = 'Preferences updated!';
    const adventurerDescription = 'You can go back and find new adventures';
    const experienceTitle = 'Information updated!!';
    const experienceDescription = 'Get ready to outstand in this categories';
    if (isSubmitted) {
      return toast({
        title: isAdventurer ? adventurerTitle : experienceTitle,
        description: isAdventurer
          ? adventurerDescription
          : experienceDescription,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }
    return toast({
      title: 'An error has ocurred',
      description: 'Please try again later',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
  function onSubmission() {
    if (isAdventurer) {
      update({ username, prioritize, activeIDs }, URL).then((res) =>
        submissionMessage(res.data),
      );
    } else {
      update({ username, activeIDs }, URL).then((res) =>
        submissionMessage(res.data),
      );
    }
  }
  if (isAdventurer) {
    return {
      activeInfo,
      inactiveInfo,
      onSwitchChange,
      prioritize,
      onAdd,
      onDelete,
      onSubmission,
    };
  }
  return {
    activeInfo,
    inactiveInfo,
    onAdd,
    onDelete,
    onSubmission,
  };
}
