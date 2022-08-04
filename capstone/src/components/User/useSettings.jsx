import axios from 'axios';
import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import callToast from './Toast';

const baseURL = process.env.REACT_APP_BASE_URL;
const adventurerURL = '/adventure/preferences';
const experienceURL = '/experience/preferences';

function defineURL(userType) {
  const KeysURL = ['status', 'update'];
  const URL = {};
  KeysURL.forEach((key) => {
    if (userType === 'adventurer') {
      URL[key] = `${baseURL}${adventurerURL}/${key}`;
    } else {
      URL[key] = `${baseURL}${experienceURL}/${key}`;
    }
  });
  return URL;
}

// TODO: Adapt URL when work done with Experience's back
async function getPreferenceStatusIDs(username, URL) {
  return axios.get(URL.status, {
    headers: { username },
  });
}

async function update(form, username, URL) {
  return axios.post(URL.update, form, { headers: { username } });
}

// ONLY FOR ADVENTURER
async function getPreferenceRestrictions(username) {
  return axios.get(`${baseURL}${adventurerURL}/restrictions`, {
    headers: { username },
  });
}

export default function useSettings(userType, username) {
  const toast = useToast();
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
      getPreferenceStatusIDs(username, URL).then((res) => {
        if (res.data.error) {
          callToast({ toast, status: 'error' });
        } else {
          setActiveIDs(res.data.active);
          setInactiveIDs(res.data.inactive);
        }
      });
      if (isAdventurer) {
        getPreferenceRestrictions(username).then((res) => {
          setPrioritize(res.data.prioritize);
          setMinPreferenceValues(res.data.minValues);
          setHasMinValues(res.data.hasMinimumValue);
        });
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
  // ---------------------------------
  // Show success/error message after submission
  function submissionMessage(isSubmitted) {
    const adventurerTitle = 'Preferences updated!';
    const adventurerDescription = 'You can go back and find new adventures';
    const experienceTitle = 'Information updated!';
    const experienceDescription = 'Get ready to outstand in this categories';
    if (isSubmitted) {
      const title = isAdventurer ? adventurerTitle : experienceTitle;
      const description = isAdventurer
        ? adventurerDescription
        : experienceDescription;
      callToast({ toast, title, description, status: 'success' });
    } else {
      callToast({ toast, status: 'error' });
    }
  }
  // ---------------------------------
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
          prioritize,
          activeIDs,
          minValues: minPreferenceValues,
          hasMinValues,
        },
        username,
        URL,
      ).then((res) => submissionMessage(res.data));
    } else {
      update({ activeIDs }, username, URL).then((res) =>
        submissionMessage(res.data),
      );
    }
  }
  if (isAdventurer) {
    return {
      activeIDs,
      inactiveIDs,
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
    activeIDs,
    inactiveIDs,
    onAdd,
    onDelete,
    onSubmission,
  };
}
