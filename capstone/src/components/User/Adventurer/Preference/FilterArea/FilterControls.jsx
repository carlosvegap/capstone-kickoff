import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Checkbox, Badge, HStack, Button } from '@chakra-ui/react';

// Top part of the filter options: set a minimum value for preference, read its name and delete it
export default function FilterControls({
  id, setShowMinimumValues, priority, displayText, handleDelete,
}) {
  return (
    <Box>
      <HStack spacing="40px" mb="20px">
        <Checkbox
          ml="45px"
          onChange={(e) => setShowMinimumValues(e.target.checked)}
        />
        <Badge> {priority} </Badge>
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
