import { useContext } from 'react';
import {
  Box, HStack, Badge, Button, Heading, VStack,
} from '@chakra-ui/react';
import UserContext from '../../../../Contexts/UserContext';
import useSettings from '../../useSettings';
import SelectMenu from '../../SelectMenu';
import SettingsControls from '../../SettingsControls';

export default function Feedback() {
  const { username, userType } = useContext(UserContext);
  if (username == null || userType == null) return <h2>Loading...</h2>;
  const {
    activeInfo, inactiveInfo, onAdd, onDelete, onSubmission,
  } = useSettings(userType, username);
  const hasMinFeedback = Object.keys(activeInfo).length >= 5;
  return (
    <Box justifyContent="center" width="50%" textAlign="center">
      <Heading mb="20px"> Why do you want to be remembered? </Heading>
      {!hasMinFeedback && (
        <Badge colorScheme="red" alignSelf="center">
          You need to choose at least 5
        </Badge>
      )}
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
        <SelectMenu
          inactiveItems={inactiveInfo}
          onAdd={onAdd}
          margin-right="10px"
        />
        <Button
          colorScheme="blue"
          width="100px"
          onClick={onSubmission}
          isDisabled={!hasMinFeedback}
        >
          Save
        </Button>
      </HStack>
    </Box>
  );
}
