import { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';

// process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
export default function Map() {
  // TODO: change center
  const center = { lat: 48.8584, lng: 2.2945 };
  // returns if isLoaded when you call the API
  console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  if (!isLoaded) return (<h3>Map is loading...</h3>);
  return (
    <GoogleMap
      center={center}
      zoom={15}
      mapContainerStyle={{ width: '100%', height: '500px' }}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        maxZoom: 17,
        minZoom: 14,
      }}
    />
  );
}
