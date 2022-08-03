import {
  Box,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Button,
  Heading,
} from '@chakra-ui/react';
import { useContext } from 'react';
import FilterArea from './FilterArea/FilterArea';
import SelectMenu from '../../SelectMenu';
import UserContext from '../../../../Contexts/UserContext';
import FeedbackContext from '../../../../Contexts/FeedbackContext';
import useSettings from '../../useSettings';

export default function Preference() {
  const { username, userType } = useContext(UserContext);
  const feedbackInfo = useContext(FeedbackContext);
  if (username == null || userType == null) return <h2>Loading...</h2>;
  const {
    activeIDs,
    inactiveIDs,
    onSwitchChange,
    prioritize,
    onAdd,
    onDelete,
    onSubmission,
    minPreferenceValues,
    hasMinValues,
    onChangeHasMinValue,
    onChangeMinValue,
  } = useSettings(userType, username);
  if (!feedbackInfo) return <h2>Loading</h2>;
  // Find the information of the active and inactive IDs
  // Map function so it respects the order it is in
  const activeInfo = activeIDs.map((ID) =>
    feedbackInfo.find((feedback) => ID === feedback.objectId),
  );
  const inactiveInfo = feedbackInfo.filter((feedback) =>
    inactiveIDs.includes(feedback.objectId),
  );
  return (
    <HStack>
      <Box bg="gray.100" width="50%">
        <Heading mt="20px" mb="20px" textAlign="center">
          Define your adventure path
        </Heading>
        <Box p="10px" overflow="auto">
          <HStack mb="30px">
            <Box marginLeft="20px" textAlign="center">
              Set minimum value
            </Box>
            <FormControl display="flex" justifyContent="center">
              <VStack spacing="0px">
                <FormLabel htmlFor="prioritize">
                  Prioritize preferences by order?
                </FormLabel>
                <Switch
                  id="prioritize"
                  onChange={onSwitchChange}
                  isChecked={prioritize}
                />
              </VStack>
            </FormControl>
          </HStack>
          {activeInfo.map((preference, index) => (
            <FilterArea
              key={preference.objectId}
              id={preference.objectId}
              index={index}
              priority={prioritize ? index + 1 : null}
              displayText={preference.displayText}
              minValue={preference.minValue}
              maxValue={preference.maxValue}
              defaultValue={minPreferenceValues[index]}
              hasMinValue={hasMinValues[index]}
              step={preference.step}
              units={preference.units}
              isDirectlyProportional={preference.directlyProportional}
              handleDelete={onDelete}
              onChangeHasMinValue={onChangeHasMinValue}
              onChangeMinValue={onChangeMinValue}
            />
          ))}
        </Box>
        <HStack justifyContent="center">
          <SelectMenu inactiveItems={inactiveInfo} onAdd={onAdd} />
          <Button colorScheme="blue" width="100px" onClick={onSubmission}>
            Save
          </Button>
        </HStack>
      </Box>
      <Box width="50%" display="flex" alignItems="flex-start">
        <Heading>Define your adventurer profile</Heading>
      </Box>
    </HStack>
  );
}
