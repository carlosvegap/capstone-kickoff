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

// ONLY FOR ADVENTURER
async function getActiveMinValues(username) {
  const values = { username };
  return axios.post(`${baseURL}${preferenceBaseURL}/active/values`, values);
}

// ONLY FOR ADVENTURERS
async function getBoolMinValues(username) {
  const values = { username };
  return axios.post(`${baseURL}${preferenceBaseURL}/active/hasMinimum`, values);
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
  const [minPreferenceValues, setMinPreferenceValues] = useState([]);
  // ONLY FOR ADVENTURER
  const [hasMinValues, setHasMinValues] = useState([]);
  // ONLY FOR ADVENTURER
  const [prioritize, setPrioritize] = useState(false);
  // ONLY FOR ADVENTURER
  function onSwitchChange() {
    setPrioritize(!prioritize);
  }

  // get all active/inactive IDs
  useEffect(() => {
    if (username != null) {
      getActiveIDs(username, URL).then((res) =>
        setActiveIDs(res.data),
      );
      getInactiveIDs(username, URL).then((res) =>
        setInactiveIDs(res.data),
      );
      // ONLY FOR ADVENTURER
      getPriorization(username, userType).then((res) =>
        setPrioritize(res.data),
      );
      if (isAdventurer) {
        // ONLY FOR ADVENTURER
        getActiveMinValues(username).then((res) =>
          setMinPreferenceValues(res.data),
        );
        // ONLY FOR ADVENTURER
        getBoolMinValues(username).then((res) =>
          setHasMinValues(res.data),
        );
      }
    }
  }, [
    username,
    setActiveIDs,
    setInactiveIDs,
    setPrioritize,
    setMinPreferenceValues,
    setHasMinValues,
  ]);

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
    // ONLY FOR ADVENTURER
    setMinPreferenceValues([...minPreferenceValues, 0]);
    // ONLY FOR ADVENTURER
    setHasMinValues([...hasMinValues, false]);
  }
  function onDelete(id) {
    setInactiveIDs([...inactiveIDs, id]);
    // ONLY FOR ADVENTURER
    // Get the index where the id is, and remove that number from the array
    let found = false;
    const activeIDIndex = activeIDs.reduce((index, activeID) => {
      if (found) return index;
      if (activeID === id) {
        found = true;
        return index;
      }
      return index + 1;
    }, 0);
    // Erase from activeIDs array
    setActiveIDs(activeIDs.filter((activeID) => activeID !== id));
    // ONLY FOR ADVENTURER
    minPreferenceValues.splice(activeIDIndex, 1);
    // ONLY FOR ADVENTURER
    hasMinValues.splice(activeIDIndex, 1);
  }
  // Show success/error message after submission
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
  function onChangeMinValue(index, val) {
    const newPreferenceValues = minPreferenceValues.map((value, i) => {
      if (i !== index) return value;
      return val;
    });
    setMinPreferenceValues(newPreferenceValues);
  }
  function onChangeHasMinValue(index) {
    const newHasMinValues = hasMinValues.map((value, i) => {
      if (i !== index) return value;
      return !value;
    });
    setHasMinValues(newHasMinValues);
  }
  function onSubmission() {
    if (isAdventurer) {
      update(
        {
          username,
          prioritize,
          activeIDs,
          minValues: minPreferenceValues,
          hasMinValues,
        }, URL,
      ).then((res) => submissionMessage(res.data));
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
      minPreferenceValues,
      hasMinValues,
      onChangeHasMinValue,
      onChangeMinValue,
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
