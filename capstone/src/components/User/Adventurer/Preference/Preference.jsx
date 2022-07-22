import './Preference.css';
import { Box } from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FilterArea from './FilterArea/FilterArea';
import FilterMenu from './FilterMenu/FilterMenu';
import UserContext from '../../../../Contexts/UserContext';

const baseURL = process.env.REACT_APP_BASE_URL;

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

async function getPreferenceInfo(objectIdArray) {
  const values = {
    objectIdArray,
  };
  return axios.post(`${baseURL}/adventure/preferences/find`, values);
}

export default function Preference() {
  // TODO: Change contextprovider so you only receive what you REALLY need
  const {
    firstName, lastName, username, age, userType, createdAt, updatedAt, ACL, objectId,
  } = useContext(UserContext);

  // contains only object Ids referencing that preference, gotten from Parse
  // will change according to user interaction, and activePreferencesIDs 
  // will be updated to Parse
  const [activePreferencesIDs, setActivePreferencesIDs] = useState([]);
  const [inactivePreferencesIDs, setInactivePreferencesIDs] = useState([]);
  // get all objectId of active/inactive preferences
  useEffect(() => {
    if (username != null) {
      getActivePreferencesIDs(username)
        .then((res) => setActivePreferencesIDs(res.data));
      getInactivePreferencesIDs(username)
        .then((res) => setInactivePreferencesIDs(res.data));
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
  return (
    <div className="filterExperience">
      <div className="filterOptions">
        <h2>Define your adventure path</h2>
        <Box p="10px" overflow="auto">
          <Box width="100px" textAlign="center" mb="20px">
            Set minimum value
          </Box>
          {activePreferences.map((preference, index) => (
            <FilterArea
              key={preference.objectId}
              id={preference.objectId}
              priority={index + 1}
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
        <FilterMenu
          // to display information
          inactivePreferences={inactivePreferences}
          handleAddition={handleAddition}
        />
      </div>
      <div className="profile">
        <h2>Define your adventurer profile</h2>
      </div>
    </div>
  );
}
