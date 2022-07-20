import './Preference.css';
import { Box } from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FilterArea from './FilterArea/FilterArea';
import UserContext from '../../../../Contexts/UserContext';

const baseURL = process.env.REACT_APP_BASE_URL;

async function getInactivePreferences(username) {
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
  // contains only object Id
  const [activePreferencesId, setActivePreferencesIDs] = useState([]);
  // contains all information for active preferences
  const [activePreferences, setActivePreferences] = useState([]);
  // contains all information for inactive preferences
  const [inactivePreferences, setInactivePreferences] = useState([]);

  // get all information for inactive preferences and current objectId of active preferences
  useEffect(() => {
    if (username != null) {
      getActivePreferencesIDs(username)
        .then((res) => setActivePreferencesIDs(res.data));
      getInactivePreferences(username)
        .then((res) => setInactivePreferences(res.data));
    }
  }, [username, setActivePreferencesIDs, setInactivePreferences]);

  // Find all the information of the active preferences
  useEffect(() => {
    getPreferenceInfo(activePreferencesId)
      .then((res) => setActivePreferences(res.data));
  }, [activePreferencesId, setActivePreferences]);

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
            />
          ))}
        </Box>
        <button type="button" value="add" className="addFilter">Add preferences</button>
      </div>
      <div className="profile">
        <h2>Define your adventurer profile</h2>
      </div>
    </div>
  );
}
