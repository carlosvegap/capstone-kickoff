import {
  Heading, Badge, Button, HStack, Image, VStack,
} from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function getPhotoReference(restaurant) {
  return restaurant.photos[0].photo_reference;
}

export default function ExperienceInfo({ restaurants }) {
  const [indexRestaurant, setIndexRestaurant] = useState(0);
  // Get the restaurant viewing now
  const currentRestaurant = restaurants.length > 0 ? restaurants[indexRestaurant] : null;
  // const currentRestaurant = useMemo (
  //   (restaurants.length > 0 )
  //   ? (() => restaurants[indexRestaurant], [indexRestaurant, restaurants])
  //   : null
  // );
  // find the photo reference of that restaurant
  const photoReference = currentRestaurant ? getPhotoReference(currentRestaurant) : null;
  // const photoReference = useMemo (
  //   () => getPhotoReference(currentRestaurant), [currentRestaurant]
  // )

  // fetch a photo from the place
  const photoCall = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${API_KEY}`;

  function onNext() {
    if (indexRestaurant < restaurants.length - 1) {
      setIndexRestaurant(indexRestaurant + 1);
    }
  }

  function onPrevious() {
    if (indexRestaurant > 0) {
      setIndexRestaurant(indexRestaurant - 1);
    }
  }
  if (currentRestaurant) {
    return (
      <div className="experienceInfo">
        <h2>Experience Information</h2>
        {/* TODO: Deal with different image sizes */}
        <Image src={photoCall} alt="" />
        <HStack>
          <Button onClick={onPrevious}>Previous</Button>
          <Badge>#{indexRestaurant + 1}</Badge>
          <Button onClick={onNext}>Next</Button>
        </HStack>
        <VStack>
          <Heading>{currentRestaurant.name}</Heading>
          <h4>{currentRestaurant.formatted_address}</h4>
        </VStack>
      </div>
    );
  }
}
