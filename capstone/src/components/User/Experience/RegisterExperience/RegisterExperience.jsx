import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ButtonGroup,
  Button,
  Badge,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useContext } from 'react';
import UserContext from '../../../../Contexts/UserContext';
import getToastOptions from '../../ToastOptions';
import InputLocation from './InputLocation';

const baseURL = process.env.REACT_APP_BASE_URL;

function validateEmail(email) {
  const emailRegex = /([a-zA-Z]|[0-9])+@[a-zA-Z]+\.[a-zA-Z]+/;
  return emailRegex.test(email);
}

async function submitExperience(formValues, username) {
  const values = {
    username,
    formValues,
  };
  return axios.post(`${baseURL}/experience/submit`, values);
}

export default function RegisterExperience({
  experienceValues,
  setExperienceValues,
}) {
  const { username } = useContext(UserContext);
  // const [experienceValues, setExperienceValues] = useState(experienceData);
  const [error, setError] = useState({
    name: '',
    address: '',
    email: '',
  });

  const fields = [
    {
      id: 'name',
      value: experienceValues.name,
      displayText: 'Name',
      placeholder: 'Your amazing business',
      isRequired: true,
      type: 'text',
      error: error.name,
    },
    {
      id: 'address',
      value: experienceValues.address,
      displayText: 'Business Address',
      placeholder: '123 Stewart Drive',
      isRequired: true,
      type: 'address',
      error: error.address,
    },
    {
      id: 'email',
      value: experienceValues.email,
      displayText: 'Email',
      placeholder: 'yourbusiness@ext.org',
      isRequired: true,
      type: 'text',
      error: error.email,
    },
    {
      id: 'description',
      value: experienceValues.description,
      displayText: 'Description',
      placeholder: 'Let people know your value in here!',
      isRequired: false,
      type: 'textArea',
      error: error.description,
    },
  ];
  function onRegistryChange(inputName, value) {
    setExperienceValues((experienceValues) => ({
      ...experienceValues,
      [inputName]: value,
    }));
    setError({ ...error, [inputName]: '' });
  }

  // used to display success message in the following function
  const toast = useToast();
  function onRegistrySubmission(form) {
    // Check for errors
    let hasError = false;
    Object.keys(form).map((key) => {
      if (key === 'email') {
        if (!validateEmail(form[key])) {
          setError({ ...error, [key]: 'Not a valid email' });
          hasError = true;
        }
      } else if (key === 'lat' || key === 'lng') {
        if (form[key] === 0) {
          setError({ ...error, address: 'Not a valid address' });
          hasError = true;
        }
      } else if (!form[key] && key !== 'description') {
        setError({ ...error, [key]: `Not a valid ${key}` });
        hasError = true;
      }
      return hasError;
    });
    if (!hasError) {
      // upload values to the database
      if (submitExperience(form, username)) {
        // display success message
        toast(getToastOptions({
          toast,
          title: 'Experience created!',
          description: 'Start preparing for new adventurers to arrive soon',
          status: 'success',
        }));
        // store locally the values
        setExperienceValues(form);
      }
    }
  }
  return (
    <Box
      width="50%"
      p="30px"
      bg="gray.100"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Heading as="h2" mb="20px" mt="10px" textAlign="center">
        Let the world find your talent
      </Heading>
      <Box width="70%" ml="15%">
        {fields.map((inputField) => (
          <FormControl
            isRequired={inputField.isRequired}
            key={inputField.id}
            p="0px 20px"
          >
            <FormLabel>{inputField.displayText}</FormLabel>
            {inputField.type === 'text' && (
              <Input
                bg="white"
                value={inputField.value}
                placeholder={inputField.placeholder}
                onChange={(e) =>
                  onRegistryChange(inputField.id, e.target.value)}
              />
            )}
            {inputField.type === 'textArea' && (
              <Textarea
                bg="white"
                value={inputField.value}
                placeholder={inputField.placeholder}
                onChange={(e) =>
                  onRegistryChange(inputField.id, e.target.value)}
              />
            )}
            {inputField.type === 'address' && (
              <InputLocation
                address={inputField.value}
                placeholder={inputField.placeholder}
                onSelect={onRegistryChange}
              />
            )}
            <Badge colorScheme="red">{inputField.error}</Badge>
          </FormControl>
        ))}
      </Box>
      <ButtonGroup spacing="6" margin="auto">
        <Button
          colorScheme="blue"
          variant="solid"
          onClick={() => onRegistrySubmission(experienceValues)}
        >
          Save
        </Button>
      </ButtonGroup>
    </Box>
  );
}
