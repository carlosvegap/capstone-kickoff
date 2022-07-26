import './Map.css';
import { useContext } from 'react';
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import AdventurerContext from '../../../../../Contexts/AdventurerContext';

export default function Map() {
  const { currentPosition, isDataFetched, restaurants } = useContext(AdventurerContext);
  // TODO: change center

  // returns if isLoaded when you call the API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  if (!isLoaded || !isDataFetched) return (<h3>Map is loading...</h3>);
  return (
    <GoogleMap
      center={currentPosition}
      zoom={12}
      mapContainerClassName="mapContainer"
      styles={[{
        featureType: 'poi',
        elementType: 'all',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      }]}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        maxZoom: 20,
        minZoom: 15,
      }}
    >
      {(restaurants).map((restaurant) => <MarkerF position={restaurant.geometry.location} />)}
      <MarkerF
        icon="https://www.robotwoods.com/dev/misc/bluecircle.png"
        position={currentPosition}
      />
    </GoogleMap>

  );
}
