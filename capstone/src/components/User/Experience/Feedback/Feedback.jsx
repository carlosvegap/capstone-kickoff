import { useContext } from 'react';
import { Box, HStack, FormLabel, Button, Heading, VStack } from '@chakra-ui/react';
import UserContext from '../../../../Contexts/UserContext';
import useSettings from '../../useSettings';
import SelectMenu from '../../SelectMenu';
import SettingsControls from '../../SettingsControls';

export default function Feedback() {
  const { username, userType } = useContext(UserContext);
  if (username == null || userType == null) return <h2>Loading...</h2>;
  const { activeInfo, inactiveInfo, onAdd, onDelete, onSubmission } =
    useSettings(userType, username);

  return (
    <Box>
      <Heading> Why do you want to be remembered? </Heading>
      <VStack>
        {activeInfo.map((feedback, index) => (
          <SettingsControls
            setShowMinimumValues={false}
            key={feedback.objectId}
            id={feedback.objectId}
            priority={index}
            displayText={feedback.displayText}
            handleDelete={onDelete}
            isAdventurer={false}
          />
        ))}
      </VStack>
      <HStack justifyContent="center">
        <SelectMenu inactiveItems={inactiveInfo} onAdd={onAdd} />
        <Button colorScheme="blue" width="100px" onClick={onSubmission}>
          Save
        </Button>
      </HStack>
    </Box>
  );
}
