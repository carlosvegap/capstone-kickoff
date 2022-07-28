import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Checkbox, Badge, HStack, Button } from '@chakra-ui/react';

// Top part of the filter options: set a minimum value for preference, read its name and delete it
export default function SettingsControls({
  id,
  index,
  priority,
  displayText,
  handleDelete,
  isAdventurer,
  onChangeHasMinValue,
  hasMinValue,
}) {
  return (
    <Box>
      <HStack spacing="40px" mb="20px">
        {isAdventurer && (
          <>
            <Checkbox
              isChecked={hasMinValue}
              ml="60px"
              onChange={() => onChangeHasMinValue(index)}
            />
            <Badge> {priority} </Badge>
          </>
        )}
        <Badge> {displayText} </Badge>
        <Button
          rightIcon={<DeleteIcon />}
          colorScheme="red"
          variant="outline"
          alignSelf="right"
          onClick={() => handleDelete(id)}
        >
          Delete
        </Button>
      </HStack>
    </Box>
  );
}
