import {
  Heading,
  Text,
  Image,
  Button,
  HStack,
  VStack,
  Badge,
} from '@chakra-ui/react';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function ClaimRestaurant({
  restaurants,
  experienceValues,
  onUpdate,
  claimStatus,
  onSelect,
}) {
  /* If there are not restaurants to show, or if the user has claimed but there is
  not a type (since he has not made any modification on his actual data) don't display anything */
  if (
    restaurants.length === 0 ||
    (claimStatus.hasClaimed && claimStatus.type === '')
  ) {
    return null;
  }
  // the user has modified his data and also claimed a status
  if (claimStatus.hasClaimed) {
    return (
      <Badge colorScheme="purple">
        {claimStatus.type} experience registered
      </Badge>
    );
  }
  // Disabled to match google maps format
  // eslint-disable-next-line camelcase
  function onClaim({ address, lat, lng, place_id }) {
    // eslint-disable-next-line camelcase
    const newExp = { ...experienceValues, address, lat, lng, place_id };
    onUpdate(newExp);
  }
  return (
    <VStack mt="10px">
      <Heading size="md">Is any of these your restaurant?</Heading>
      <HStack bg="white">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            onSelect={onSelect}
            key={index}
            restaurant={restaurant}
            onClaim={onClaim}
          />
        ))}
      </HStack>
      <Button
        colorScheme="teal"
        onClick={() => onSelect({ hasClaimed: true, type: 'unique' })}
      >
        I am a totally new experience!
      </Button>
    </VStack>
  );
}

function RestaurantCard({ restaurant, onClaim, onSelect }) {
  const photoReference = restaurant.photos
    ? restaurant.photos[0].photo_reference
    : null;
  const photoCall = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${API_KEY}`;
  return (
    <VStack
      width="150px"
      overflow="auto"
      display="flex"
      alignContent="center"
      p="10px"
    >
      <Heading size="sm">{restaurant.name}</Heading>
      <Text fontSize="xs">{restaurant.formatted_address}</Text>
      <Image width="auto" height="150px" src={photoCall} />
      <Button
        colorScheme="green"
        width="60px"
        onClick={() => {
          onClaim({
            address: restaurant.formatted_address,
            lat: restaurant.geometry.location.lat,
            lng: restaurant.geometry.location.lng,
            place_id: restaurant.place_id,
          });
          onSelect({ hasClaimed: true, type: 'existing' });
        }}
      >
        Claim!
      </Button>
    </VStack>
  );
}
