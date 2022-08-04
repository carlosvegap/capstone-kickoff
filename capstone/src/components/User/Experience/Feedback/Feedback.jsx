import { useContext } from 'react';
import {
  Box, HStack, Badge, Button, Heading, VStack,
} from '@chakra-ui/react';
import UserContext from '../../../../Contexts/UserContext';
import useSettings from '../../useSettings';
import SelectMenu from '../../SelectMenu';
import SettingsControls from '../../SettingsControls';
import FeedbackContext from '../../../../Contexts/FeedbackContext';

export default function Feedback() {
  const { username, userType } = useContext(UserContext);
  // All feedback information (including distance, which is not rateable)
  const feedbackInfo = useContext(FeedbackContext);
  if (username == null || userType == null) return <h2>Loading...</h2>;
  const {
    activeIDs, inactiveIDs, onAdd, onDelete, onSubmission,
  } = useSettings(userType, username);

  const hasMinFeedback = activeIDs.length >= 5;
  // Find the information of the active and inactive IDs
  // Map function so it respects the order it is in
  const activeInfo = activeIDs.map((ID) =>
    feedbackInfo.find((feedback) => ID === feedback.objectId),
  );
  const inactiveInfo = feedbackInfo.filter((feedback) =>
    inactiveIDs.includes(feedback.objectId),
  );
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
