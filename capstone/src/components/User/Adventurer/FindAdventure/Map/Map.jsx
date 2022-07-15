import './Map.css';
import { useState, useRef, useEffect } from 'react';
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';

export default function Map({ isLoggedIn }) {
  // const libraries = ['places'];
  // TODO: change center
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
    });
  }, [isLoggedIn]);
  // returns if isLoaded when you call the API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // libraries,
  });
  if (!isLoaded) return (<h3>Map is loading...</h3>);
  return (
    <GoogleMap
      center={currentPosition}
      zoom={15}
      mapContainerClassName="mapContainer"
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        maxZoom: 17,
        minZoom: 14,
      }}
    >
      <MarkerF
        icon="https://www.robotwoods.com/dev/misc/bluecircle.png"
        position={currentPosition}
      />
    </GoogleMap>

  );
}
