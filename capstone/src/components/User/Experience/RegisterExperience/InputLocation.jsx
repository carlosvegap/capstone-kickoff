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
  async function onChooseAddress(place) {
    setSearch(place);
    const res = await geocodeByAddress(place);
    const coord = await getLatLng(res[0]);
    onSelect('address', place);
    onSelect('lat', coord.lat);
    onSelect('lng', coord.lng);
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
                bg="white"
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
