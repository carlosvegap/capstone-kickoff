import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu, MenuButton, Button, MenuList, MenuItem,
} from '@chakra-ui/react';

export default function SelectMenu({ inactiveItems, onAdd }) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="gray.300" width="150px">
        Add
      </MenuButton>
      <MenuList>
        {inactiveItems.map((item) => (
          <MenuItem
            margin="0 auto"
            key={item.objectId}
            onClick={() => onAdd(item.objectId)}
          >
            {item.displayText}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
