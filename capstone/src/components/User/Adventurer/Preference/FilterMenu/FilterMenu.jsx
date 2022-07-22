import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu, MenuButton, Button, MenuList, MenuItem,
} from '@chakra-ui/react';

export default function FilterMenu({
  inactivePreferences, setInactivePreferences, activePreferencesIDs, setActivePreferencesIDs,
}) {
  function handleAddition(objectId) {
    setActivePreferencesIDs([...activePreferencesIDs, objectId]);
    setInactivePreferences(
      inactivePreferences.filter((preferences) => preferences.objectId !== objectId),
    );
  }
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="1000px">
        Add
      </MenuButton>
      <MenuList>
        {inactivePreferences.map((preference) => (
          <MenuItem
            key={preference.objectId}
            onClick={() => handleAddition(preference.objectId)}
          >
            {preference.displayText}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
