import { useContext } from 'react';
import { VStack, Box, Badge, Heading } from '@chakra-ui/react';
import AdventurerContext from '../../../../../Contexts/AdventurerContext';

export default function List() {
  const { isDataFetched, restaurants } = useContext(AdventurerContext);
  if (isDataFetched) {
    return (
      <VStack mt="20px" mb="20px" spacing="20px">
        {restaurants.map((restaurant, index) => (
          <Box key={index} shadow="md" width="60%" display="flex" bg="white" borderRadius="10px">
            <Badge height="100%" mr="20px" colorScheme="teal">
              {index + 1}
            </Badge>
            <VStack>
              <Heading size="md">{restaurant.name}</Heading>
            </VStack>
          </Box>
        ))}
      </VStack>
    );
  }
  return (
    <Heading>Loading restaurants</Heading>
  );
}
