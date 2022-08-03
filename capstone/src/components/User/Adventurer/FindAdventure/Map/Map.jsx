import { useContext, useState, Fragment } from 'react';
import {
  VStack, Spinner, Heading, Box, Text,
} from '@chakra-ui/react';
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  InfoWindowF,
} from '@react-google-maps/api';
import AdventurerContext from '../../../../../Contexts/AdventurerContext';

export default function Map() {
  const { currentPosition, isDataFetched, restaurants } = useContext(AdventurerContext);

  const [activeRestaurant, setActiveRestaurant] = useState(null);
  // TODO: change center

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
        height: '400px',
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
      {restaurants.map((restaurant) => (
        <Fragment key={restaurant.place_id}>
          <MarkerF
            position={restaurant.geometry.location}
            onMouseOver={() => setActiveRestaurant(restaurant.place_id)}
            onMouseOut={() => setActiveRestaurant(null)}
          >
            {activeRestaurant === restaurant.place_id ? (
              <InfoWindowF position={restaurant.geometry.location}>
                <Box width="120px">
                  <Heading size="l">{restaurant.name}</Heading>
                  <Text size="l">{restaurant.formatted_address}</Text>
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
