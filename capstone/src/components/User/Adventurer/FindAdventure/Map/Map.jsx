import { useContext, useState, Fragment } from 'react';
import {
  VStack,
  Spinner,
  Heading,
  Box,
  Text,
  Badge,
  Image,
} from '@chakra-ui/react';
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  InfoWindowF,
} from '@react-google-maps/api';
import AdventurerContext from '../../../../../Contexts/AdventurerContext';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function Map({onSelectRestaurant}) {
  const { currentPosition, isDataFetched, restaurants } =
    useContext(AdventurerContext);
  const [activeRestaurant, setActiveRestaurant] = useState(null);

  // returns if isLoaded when you call the API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  if (!isLoaded || !isDataFetched) {
    return (
      <VStack display="flex" flexDirection="column" justifyContent="center">
        <Heading size="lg">Finding your adventure&apos;s start point</Heading>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </VStack>
    );
  }
  return (
    <GoogleMap
      center={currentPosition}
      zoom={14}
      mapContainerStyle={{
        width: '80%',
        height: '700px',
        marginTop: '10px',
        marginLeft: '10%',
        borderRadius: '20px',
      }}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        maxZoom: 20,
        minZoom: 12,
      }}
    >
      {restaurants.map((restaurant, index) => (
        <Fragment key={restaurant.place_id}>
          <MarkerF
            position={restaurant.geometry.location}
            onMouseOver={() => setActiveRestaurant(restaurant.place_id)}
            onMouseOut={() => setActiveRestaurant(null)}
            onClick={() => onSelectRestaurant(index)}
          >
            {activeRestaurant === restaurant.place_id ? (
              <InfoWindowF position={restaurant.geometry.location}>
                <Box
                  width="120px"
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Heading size="l">{restaurant.name}</Heading>
                  <Text size="l">{restaurant.formatted_address}</Text>
                  <Image
                    width="auto"
                    height="70px"
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${
                      restaurant.photos
                        ? restaurant.photos[0].photo_reference
                        : null
                    }&key=${API_KEY}`}
                  />
                  {restaurant.matchScore ? (
                    <Badge mt="5px" colorScheme="purple">
                      {restaurant.matchScore}% match
                    </Badge>
                  ) : null}
                  {restaurant.reviewsNumber ? (
                    <Badge mt="5px" colorScheme="blue">
                      {restaurant.reviewsNumber} reviews
                    </Badge>
                  ) : null}
                </Box>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        </Fragment>
      ))}
      <MarkerF
        icon="https://www.robotwoods.com/dev/misc/bluecircle.png"
        position={currentPosition}
      />
    </GoogleMap>
  );
}
