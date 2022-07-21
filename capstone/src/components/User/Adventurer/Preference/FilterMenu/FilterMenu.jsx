import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu, MenuButton, Button, MenuList, MenuItem,
} from '@chakra-ui/react';

// inactivePreferences={inactivePreferences}
//           setInactivePreferences={setInactivePreferences}
//           setActivePreferencesIDs={setActivePreferencesIDs}
function handleAddition(objectId, inactivePreferences, setInactivePreferences, activePreferencesIDs, setActivePreferencesIDs) {
  setActivePreferencesIDs([...activePreferencesIDs, objectId]);
  setInactivePreferences(
    inactivePreferences.filter((preferences) => preferences.objectId !== objectId),
  );
}

export default function FilterMenu({
  inactivePreferences, setInactivePreferences, activePreferencesIDs, setActivePreferencesIDs,
}) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="1000px">
        Add
      </MenuButton>
      <MenuList>
        {inactivePreferences.map((preference) => (
          <MenuItem
            key={preference.objectId}
            value={preference.objectId}
            onClick={(e) => handleAddition(e.target.value, inactivePreferences, setInactivePreferences, activePreferencesIDs, setActivePreferencesIDs)}
          >
            {preference.displayText}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
