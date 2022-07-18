import './Map.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';

const baseURL = process.env.REACT_APP_BASE_URL;

function getNearbyRestaurants(location) {
  return axios.post(`${baseURL}/adventure/restaurants`, location);
}

export default function Map({ isLoggedIn }) {
  // TODO: change center
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
    });
  }, [isLoggedIn]);

  // Fetch closest restaurants
  useEffect(() => {
    if (currentPosition.lat === 0 && currentPosition.lng === 0) {
      setRestaurants([]);
    } else {
      getNearbyRestaurants(currentPosition)
        .then((res) => setRestaurants(res.data))
        .catch(console.error);
      setIsDataFetched(true);
    }
  }, [currentPosition, setCurrentPosition, setRestaurants]);

  // returns if isLoaded when you call the API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    // libraries,
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
