import {
  Heading,
  Badge,
  Button,
  HStack,
  Image,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useContext } from 'react';
import UserContext from '../../../../Contexts/UserContext';
import RateExperience from './RateExperience';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const baseURL = process.env.REACT_APP_BASE_URL;

async function getIsRated(username, experienceId) {
  const values = { username, experienceId };
  const result = await axios.post(`${baseURL}/review/isRated`, values);
  return result.data;
}

function getPhotoReference(restaurant) {
  return restaurant.photos ? restaurant.photos[0].photo_reference : null;
}

export default function ExperienceInfo({ restaurants }) {
  const { username } = useContext(UserContext);
  const [indexRestaurant, setIndexRestaurant] = useState(0);
  // Get the restaurant viewing now
  const currentRestaurant = restaurants.length > 0 ? restaurants[indexRestaurant] : null;
  // let isRated = false;
  // if (currentRestaurant) {
  //   isRated = getIsRated(username, currentRestaurant.place_id);
  // }
  // find the photo reference of that restaurant
  const photoReference = currentRestaurant
    ? getPhotoReference(currentRestaurant)
    : null;

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
      <VStack>
        {/* TODO: Deal with different image sizes */}
        <Image boxSize="250px" src={photoCall} fallbackSrc="https://northernvirginiamag.com/wp-content/uploads/2021/03/restaurant.jpg" mt="20px" borderRadius="30px" alt="restaurant photo" />
        <HStack justifyContent="center">
          <Button onClick={onPrevious}>Previous</Button>
          <Badge>#{indexRestaurant + 1}</Badge>
          <Button onClick={onNext}>Next</Button>
        </HStack>
        <VStack justifyContent="center" display="flex">
          {/* PLACE IS RATED */}
          {true && (<RateExperience name={currentRestaurant.name} />)}
          <Heading as="h2" size="lg">{currentRestaurant.name}</Heading>
          <h4>{currentRestaurant.formatted_address}</h4>
        </VStack>
      </VStack>
    );
  }
}
