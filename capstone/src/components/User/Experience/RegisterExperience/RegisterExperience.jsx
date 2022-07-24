import {
  Box, Heading, FormControl, FormLabel, Input, Textarea, ButtonGroup, Button,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useContext } from 'react';
import UserContext from '../../../../Contexts/UserContext';

const baseURL = process.env.REACT_APP_BASE_URL;

function validateEmail(email) {
  const emailRegex = /([a-zA-Z]|[0-9])+@[a-zA-Z]+\.[a-zA-Z]+/;
  return emailRegex.test(email);
}

async function submitExperience(formValues, username) {
  const values = {
    username,
    // TODO: Change later to formValues, this format because of location change
    formValues: {
      name: formValues.name,
      // TODO: USE GOOGLE TO FIND A LOCATION BY ADDRESS AND RETRIEVE ITS VALUES
      location: { lat: 5, lng: 10 },
      email: formValues.email,
      description: formValues.description,
    },
  };
  return axios.post(`${baseURL}/experience/myExperience`, values);
}

export default function RegisterExperience() {
  const { username } = useContext(UserContext);
  const [experienceValues, setExperienceValues] = useState({
    name: '',
    location: { lat: 0, lng: 0 },
    email: '',
    description: '',
  });
  const [error, setError] = useState({
    name: '',
    location: '',
    email: '',
    description: '',
  });
  const fields = [
    {
      id: 'name', value: experienceValues.name, displayText: 'Name', placeholder: 'Your amazing business', isRequired: true, type: 'text', input: 'input',
    },
    {
      id: 'location', value: experienceValues.location, displayText: 'Business Location', placeholder: '123 Stewart Drive', isRequired: true, type: 'text', input: 'input',
    },
    {
      id: 'email', value: experienceValues.email, displayText: 'Email', placeholder: 'yourbusiness@ext.org', isRequired: true, type: 'email', input: 'input',
    },
    {
      id: 'description', value: experienceValues.description, displayText: 'Description', placeholder: 'Let people know your value in here!', isRequired: false, type: 'text', input: 'textArea',
    },
  ];
  function onRegistryChange(inputName, value) {
    setExperienceValues({ ...experienceValues, [inputName]: value });
  }
  function onRegistrySubmission(form) {
    let hasError = false;
    Object.keys(form).map((key) => {
      if (key === 'email') {
        if (!(validateEmail(form[key]))) {
          setError({ ...error, [key]: 'Not a valid email' });
          console.log(`error in ${key}: ${form[key]}`);
          hasError = true;
        }
      } else if (!(form[key])) {
        setError({ ...error, [key]: 'Not a valid value' });
        hasError = true;
      }
      return hasError;
    });
    if (!hasError) submitExperience(form, username);
  }
  return (
    <Box>
      <Heading as="h2">
        Let the world find your talent
      </Heading>
      {fields.map((inputField) => (
        <FormControl isRequired={inputField.isRequired} key={inputField.id} p="20px">
          <FormLabel>{inputField.displayText}</FormLabel>
          {inputField.input === 'input'
            ? (
              <Input
                value={inputField.value}
                type={inputField.type}
                placeholder={inputField.placeholder}
                onChange={(e) => onRegistryChange(inputField.id, e.target.value)}
              />
            )
            : (
              <Textarea
                value={inputField.value}
                type={inputField.type}
                placeholder={inputField.placeholder}
                onChange={(e) => onRegistryChange(inputField.id, e.target.value)}
              />
            )}
        </FormControl>
      ))}
      <ButtonGroup variant="outline" spacing="6" border="1px solid grey" padding="20px" margin="auto">
        <Button colorScheme="blue" onClick={() => onRegistrySubmission(experienceValues)}>Save</Button>
      </ButtonGroup>
    </Box>
  );
}
