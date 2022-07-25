import { useState } from 'react';
import { Input } from '@chakra-ui/react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];
export default function InputLocation({ address, placeholder, onSelect }) {
  const [search, setSearch] = useState(address);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  function onChooseAddress(place) {
    // QUESTION: Only the last setState is being respected
    setSearch(place);
    geocodeByAddress(place)
      .then((res) => getLatLng(res[0])
        .then((coord) => onSelect(place, coord.lat, coord.lng)));
  }
  if (isLoaded) {
    return (
      <div>
        <PlacesAutocomplete
          value={search}
          onChange={setSearch}
          onSelect={onChooseAddress}
        >
          {({
            getInputProps, suggestions, getSuggestionItemProps, loading,
          }) => (
            <div>
              <Input
                {...getInputProps({
                  placeholder,
                })}
              />
              {/* display suggestions */}
              <div>
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const style = suggestion.active
                    ? { backgroundColor: '#A83232', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      { suggestion.description }
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    );
  }
}
