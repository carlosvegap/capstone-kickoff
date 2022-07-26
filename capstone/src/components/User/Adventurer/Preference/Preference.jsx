import {
  Box, HStack, FormControl, FormLabel, Switch, Button, useToast,
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FilterArea from './FilterArea/FilterArea';
import FilterMenu from './FilterMenu/FilterMenu';
import UserContext from '../../../../Contexts/UserContext';

const baseURL = process.env.REACT_APP_BASE_URL;

// array with object id of the inactive preferences
async function getInactivePreferencesIDs(username) {
  const values = {
    username,
  };
  return axios.post(`${baseURL}/adventure/preferences/inactive`, values);
}

// array with object id of the active preferences
async function getActivePreferencesIDs(username) {
  const values = {
    username,
  };
  return axios.post(`${baseURL}/adventure/preferences/active`, values);
}

// array with objects with the preference information
async function getPreferenceInfo(objectIdArray) {
  const values = {
    objectIdArray,
  };
  return axios.post(`${baseURL}/adventure/preferences/find`, values);
}

// bool with the user preference about priorization
async function getPriorization(username) {
  const values = {
    username,
  };
  return axios.post(`${baseURL}/adventure/preferences/prioritize`, values);
}

async function uploadPreferences(form) {
  return axios.post(`${baseURL}/adventure/preferences/update`, form);
}

export default function Preference() {
  const { username } = useContext(UserContext);
  // contains only object Ids referencing that preference, gotten from Parse
  // will change according to user interaction, and activePreferencesIDs
  // will be updated to Parse
  const [activePreferencesIDs, setActivePreferencesIDs] = useState([]);
  const [inactivePreferencesIDs, setInactivePreferencesIDs] = useState([]);
  const [prioritize, setPrioritize] = useState(false);
  function onSwitchChange() {
    setPrioritize(!prioritize);
  }
  // get all objectId of active/inactive preferences
  useEffect(() => {
    if (username != null) {
      getActivePreferencesIDs(username)
        .then((res) => setActivePreferencesIDs(res.data));
      getInactivePreferencesIDs(username)
        .then((res) => setInactivePreferencesIDs(res.data));
      getPriorization(username)
        .then((res) => setPrioritize(res.data));
    }
  }, [username, setActivePreferencesIDs, setInactivePreferencesIDs]);

  // contains all information about that preference
  // calculated from endpoint
  const [activePreferences, setActivePreferences] = useState([]);
  const [inactivePreferences, setInactivePreferences] = useState([]);
  // Find all the information of the active/inactive preferences
  useEffect(() => {
    getPreferenceInfo(activePreferencesIDs)
      .then((res) => setActivePreferences(res.data));
  }, [activePreferencesIDs, setActivePreferences]);
  useEffect(() => {
    getPreferenceInfo(inactivePreferencesIDs)
      .then((res) => setInactivePreferences(res.data));
  }, [inactivePreferencesIDs, setInactivePreferences]);

  function handleAddition(id) {
    setActivePreferencesIDs([...activePreferencesIDs, id]);
    setInactivePreferencesIDs(
      inactivePreferencesIDs.filter((preferenceID) => preferenceID !== id),
    );
  }
  function handleDelete(id) {
    setInactivePreferencesIDs([...inactivePreferencesIDs, id]);
    setActivePreferencesIDs(
      activePreferencesIDs.filter((preferenceID) => preferenceID !== id),
    );
  }
  const toast = useToast();
  function toastMessage(isSubmitted) {
    if (isSubmitted) {
      return (
        toast({
          title: 'Preferences updated!',
          description: 'You can go back and find new adventures',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      );
    }
    return (
      toast({
        title: 'An error has ocurred',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    );
  }
  function onSubmission() {
    uploadPreferences({ username, prioritize, activePreferencesIDs })
      .then((res) => (res.data ? toastMessage(true) : toastMessage(false)));
  }
  return (
    <div className="filterExperience">
      <div className="filterOptions">
        <h2>Define your adventure path</h2>
        <Box p="10px" overflow="auto">
          <HStack>
            <Box width="100px" textAlign="center" mb="20px" border="1px solid green">
              Set minimum value
            </Box>
            <FormControl display="flex" justifyContent="center">
              <FormLabel htmlFor="prioritize">
                Prioritize preferences by order?
              </FormLabel>
              <Switch id="prioritize" onChange={onSwitchChange} isChecked={prioritize} />
            </FormControl>
          </HStack>
          {activePreferences.map((preference, index) => (
            <FilterArea
              key={preference.objectId}
              id={preference.objectId}
              priority={prioritize ? index + 1 : null}
              displayText={preference.displayText}
              minValue={preference.minValue}
              maxValue={preference.maxValue}
              defaultValue={preference.defaultValue}
              step={preference.step}
              units={preference.units}
              handleDelete={handleDelete}
            />
          ))}
        </Box>
        <HStack justifyContent="center">
          <FilterMenu
            inactivePreferences={inactivePreferences}
            handleAddition={handleAddition}
          />
          <Button colorScheme="blue" width="100px" onClick={onSubmission}>Save</Button>
        </HStack>
      </div>
      <div className="profile">
        <h2>Define your adventurer profile</h2>
      </div>
    </div>
  );
}
