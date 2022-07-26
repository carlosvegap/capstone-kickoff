import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu, MenuButton, Button, MenuList, MenuItem,
} from '@chakra-ui/react';

export default function FilterMenu({ inactivePreferences, handleAddition }) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="150px">
        Add
      </MenuButton>
      <MenuList>
        {inactivePreferences.map((preference) => (
          <MenuItem
            margin="0 auto"
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
