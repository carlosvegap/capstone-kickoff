import {
  Box, Heading, FormControl, FormLabel, Input, Textarea,
} from '@chakra-ui/react';

export default function RegisterExperience() {
  const fields = [
    {
      id: 'name', displayText: 'Name', placeholder: 'Your amazing business', isRequired: true, type: 'text', input: 'input',
    },
    {
      id: 'location', displayText: 'Business Location', placeholder: '123 Stewart Drive', isRequired: true, type: 'text', input: 'input',
    },
    {
      id: 'email', displayText: 'Email', placeholder: 'yourbusiness@ext.org', isRequired: true, type: 'email', input: 'input',
    },
    {
      id: 'description', displayText: 'Description', placeholder: 'Let people know your value in here!', isRequired: false, type: 'text', input: 'textArea',
    },
  ];
  return (
    <Box>
      <Heading as="h2">Let the world find your talent</Heading>
      {fields.map((inputField) => (
        <FormControl isRequired={inputField.isRequired} key={inputField.id} p="20px">
          <FormLabel>{inputField.displayText}</FormLabel>
          {inputField.input === 'input'
            ? (
              <Input
                type={inputField.type}
                placeholder={inputField.placeholder}
              />
            )
            : (
              <Textarea
                type={inputField.type}
                placeholder={inputField.placeholder}
              />
            )}
        </FormControl>
      ))}
    </Box>
  );
}
