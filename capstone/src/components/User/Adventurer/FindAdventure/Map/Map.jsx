import './Map.css';
import { useContext } from 'react';
import { VStack, Spinner, Heading } from '@chakra-ui/react';
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import AdventurerContext from '../../../../../Contexts/AdventurerContext';

export default function Map() {
  const { currentPosition, isDataFetched, restaurants } =
    useContext(AdventurerContext);
  // TODO: change center

  // returns if isLoaded when you call the API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  if (!isLoaded || !isDataFetched) {
    return (
      <VStack display="flex" flexDirection="column" justifyContent="center">
        <Heading size="lg">
          Finding your adventure's start point
        </Heading>
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
      zoom={12}
      mapContainerClassName="mapContainer"
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        maxZoom: 20,
        minZoom: 15,
      }}
    >
      {restaurants.map((restaurant, index) => (
        <MarkerF key={index} position={restaurant.geometry.location} />
      ))}
      <MarkerF
        icon="https://www.robotwoods.com/dev/misc/bluecircle.png"
        position={currentPosition}
      />
    </GoogleMap>
  );
}
