import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { Heading, Box } from '@chakra-ui/react';
import UserContext from './../../../../Contexts/UserContext';

const baseURL = process.env.REACT_APP_BASE_URL;

// TODO: Same functions as in Preference.jsx, take a look to refactor
async function getInactiveFeedbackIDs(username) {
  const values = {
    username,
  };
  return axios.post(`${baseURL}/experience/feedback/inactive`, values);
}

async function getActiveFeedbackIDs(username) {
  const values = {
    username,
  };
  return axios.post(`${baseURL}/experience/feedback/active`, values);
}

async function getFeedbackInfo(objectIdArray) {
  const values = {
    objectIdArray,
  };
  return axios.post(`${baseURL}/experience/feedback/find`, values);
}

export default function Feedback() {
  const { username } = useContext(UserContext);

  const [activeFeedbackIDs, setActiveFeedbackIDs] = useState([]);
  const [inactivePreferencesIDs, setInactivePreferencesIDs] = useState([]);

  useEffect(() => {
    if (username != null) {
      getActiveFeedbackIDs(username).then((res) =>
        setActiveFeedbackIDs(res.data),
      );
      getInactiveFeedbackIDs(username).then((res) =>
        setInactivePreferencesIDs(res.data),
      );
    }
  });

  return (
    <Box>
      <Heading> How do you want to be remembered? </Heading>
    </Box>
  );
}
