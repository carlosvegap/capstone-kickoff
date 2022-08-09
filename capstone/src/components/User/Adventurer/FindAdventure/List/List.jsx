import { useContext } from 'react';
import { VStack, Box, Badge, Heading, Image, Text } from '@chakra-ui/react';
import AdventurerContext from '../../../../../Contexts/AdventurerContext';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function List() {
  const { isDataFetched, restaurants } = useContext(AdventurerContext);
  if (isDataFetched) {
    return (
      <VStack mt="20px" mb="20px" spacing="20px">
        {restaurants.map((restaurant, index) => (
          <Box
            key={restaurant.place_id}
            shadow="md"
            width="60%"
            display="flex"
            flexDirection="row"
            bg="white"
            borderRadius="10px"
            padding="10px"
          >
            <Badge height="100%" mr="20px" colorScheme="orange">
              {index + 1}
            </Badge>
            <VStack width="60%" mr="20px">
              <Heading size="md" textAlign="center">{restaurant.name}</Heading>
              {restaurant.matchScore
                ? <Badge colorScheme="purple">{restaurant.matchScore}% match</Badge>
                : null
              }
              {restaurant.review 
                ? <Badge colorScheme="teal">Rated</Badge>
                : <Badge colorScheme="pink">Try me!</Badge>
              }
              <Text textAlign="center">{restaurant.formatted_address}</Text>
            </VStack>
            <Image
              alignSelf="center"
              margin="auto"
              width="100px"
              height="100px"
              borderRadius="10px"
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${
                restaurant.photos ? restaurant.photos[0].photo_reference : null
              }&key=${API_KEY}`}
            />
          </Box>
        ))}
      </VStack>
    );
  }
  return <Heading>Loading restaurants</Heading>;
}
