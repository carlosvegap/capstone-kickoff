import {
  Heading,
  Badge,
  Button,
  HStack,
  Image,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import UserContext from '../../../../Contexts/UserContext';
import RateExperience from './RateExperience';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const baseURL = process.env.REACT_APP_BASE_URL;

async function submitRate(username, experienceId, reviews) {
  const values = { username, experienceId, reviews };
  return axios.post(`${baseURL}/review/rate`, values);
}

function getPhotoReference(restaurant) {
  return restaurant.photos ? restaurant.photos[0].photo_reference : null;
}

export default function ExperienceInfo({ restaurants, onSubmit }) {
  const { username } = useContext(UserContext);
  const [indexRestaurant, setIndexRestaurant] = useState(0);
  const [newReview, setNewReview] = useState([]);
  // Get the restaurant viewing now
  const currentRestaurant = restaurants.length > 0 ? restaurants[indexRestaurant] : null;
  const isRated = currentRestaurant?.review != null;

  // find the photo reference of that restaurant
  const photoReference = currentRestaurant
    ? getPhotoReference(currentRestaurant)
    : null;

  function resetRatingForm() {
    if (currentRestaurant?.activeFeedback) {
      return currentRestaurant.activeFeedback.map((feedback) => ({
        feedbackId: feedback.objectId,
        score: 0,
        comment: '',
      }));
    }
    return {};
  }

  useEffect(() => {
    if (!isRated) {
      setNewReview(resetRatingForm);
    }
  }, [currentRestaurant, setNewReview]);

  function onNewReviewChange(feedbackId, input, value) {
    const array = newReview.map((review) => {
      if (review.feedbackId === feedbackId) {
        review[input] = value;
      }
      return review;
    });
    setNewReview(array);
  }

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

  const toast = useToast();
  function onSubmission() {
    submitRate(username, currentRestaurant.place_id, newReview).then((res) => {
      if (res.data) {
        onSubmit([...restaurants, { ...currentRestaurant, review: newReview }]);
        return toast({
          title: 'Successfully rated',
          description: 'Thanks for rating!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      return toast({
        title: 'An error happened',
        description: 'Try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });
  }

  if (currentRestaurant) {
    return (
      <VStack width="50%">
        <Image
          height="300px"
          src={photoCall}
          fallbackSrc="https://northernvirginiamag.com/wp-content/uploads/2021/03/restaurant.jpg"
          mt="20px"
          borderRadius="30px"
          alt="restaurant photo"
        />
        {currentRestaurant.matchScore ? (
          <Badge colorScheme="purple">
            {currentRestaurant.matchScore.toFixed(2)} match points
          </Badge>
        ) : null}
        <HStack justifyContent="center">
          <Button onClick={onPrevious} isDisabled={indexRestaurant === 0}>
            Previous
          </Button>
          <Badge>#{indexRestaurant + 1}</Badge>
          <Button
            onClick={onNext}
            isDisabled={indexRestaurant + 1 === restaurants.length}
          >
            Next
          </Button>
        </HStack>
        <VStack justifyContent="center" display="flex">
          {!isRated ? (
            <RateExperience
              name={currentRestaurant.name}
              // TODO: Requires all information of the activeFeedback.
              feedbackAreas={currentRestaurant.activeFeedback}
              onChange={onNewReviewChange}
              onReset={resetRatingForm}
              onSubmit={onSubmission}
            />
          ) : (
            <Badge colorScheme="teal">Rated</Badge>
          )}
          <Heading as="h2" size="lg">
            {currentRestaurant.name}
          </Heading>
          <h4>{currentRestaurant.formatted_address}</h4>
        </VStack>
      </VStack>
    );
  }
}
