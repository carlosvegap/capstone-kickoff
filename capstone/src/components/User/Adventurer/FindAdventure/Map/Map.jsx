import { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';

// process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
export default function Map() {
  // TODO: change center
  const center = { lat: 48.8584, lng: 2.2945 };
  // returns if isLoaded when you call the API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDdD2ubG53w9Pcd-G3Nv3rjbBrHk-26PU8',
  });
  if (!isLoaded) return (<h3>Map is loading...</h3>);
  return (
    <GoogleMap center={center} zoom={15} mapContainerStyle={{ width: '100%', height: '500px' }} />
  );
}
