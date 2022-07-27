import {
  Box,
  HStack,
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
import useSettings from '../../useSettings';

export default function Preference() {
  const { username, userType } = useContext(UserContext);
  if (username == null || userType == null) return <h2>Loading...</h2>;
  const {
    activeInfo,
    inactiveInfo,
    onSwitchChange,
    prioritize,
    onAdd,
    onDelete,
    onSubmission,
  } = useSettings(userType, username);
  return (
    <Box>
      <Box>
        <Heading>Define your adventure path</Heading>
        <Box p="10px" overflow="auto">
          <HStack>
            <Box
              width="100px"
              textAlign="center"
              mb="20px"
              border="1px solid green"
            >
              Set minimum value
            </Box>
            <FormControl display="flex" justifyContent="center">
              <FormLabel htmlFor="prioritize">
                Prioritize preferences by order?
              </FormLabel>
              <Switch
                id="prioritize"
                onChange={onSwitchChange}
                isChecked={prioritize}
              />
            </FormControl>
          </HStack>
          {activeInfo.map((preference, index) => (
            <FilterArea
              key={preference.objectId}
              id={preference.objectId}
              priority={prioritize ? index + 1 : null}
              displayText={preference.displayText}
              minValue={preference.minValue}
              maxValue={preference.maxValue}
              defaultValue={preference.defaultValue}
              step={preference.step}
              units={preference.units}
              handleDelete={onDelete}
            />
          ))}
        </Box>
        <HStack justifyContent="center">
          <SelectMenu
            inactiveItems={inactiveInfo}
            onAdd={onAdd}
          />
          <Button colorScheme="blue" width="100px" onClick={onSubmission}>
            Save
          </Button>
        </HStack>
      </Box>
      <Box className="profile">
        <Heading>Define your adventurer profile</Heading>
      </Box>
    </Box>
  );
}
