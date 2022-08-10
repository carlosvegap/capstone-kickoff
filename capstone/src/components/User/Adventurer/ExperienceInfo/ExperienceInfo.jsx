import {
  Heading,
  Badge,
  Button,
  HStack,
  Image,
  VStack,
  useToast,
  Progress,
  Text,
  Box,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import AdventurerContext from '../../../../Contexts/AdventurerContext';
import FeedbackContext from '../../../../Contexts/FeedbackContext';
import UserContext from '../../../../Contexts/UserContext';
import RateExperience from './RateExperience';
import getToastOptions from '../../ToastOptions';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const baseURL = process.env.REACT_APP_BASE_URL;

async function submitRate(username, experienceId, reviews) {
  return axios.post(
    `${baseURL}/adventure/rate`,
    { reviews },
    { headers: { username, experienceId } },
  );
}

function getPhotoReference(restaurant) {
  return restaurant.photos ? restaurant.photos[0].photo_reference : null;
}

function calculateNewMeanReviews(meanScores, reviewsNumber, newReview) {
  return meanScores.map((scoreObject) => {
    const newVal = (newReview.find(
      (review) => review.feedbackId === scoreObject.feedbackId,
    )).score;
    return {
      ...scoreObject,
      meanReviewScore:
        ((newVal / 5 * 100) + scoreObject.meanReviewScore * reviewsNumber) /
        (reviewsNumber + 1),
    };
  });
}

export default function ExperienceInfo({
  onUpdateRestaurants,
  indexRestaurant,
  onSelectRestaurant,
}) {
  const { username } = useContext(UserContext);
  const { restaurants } = useContext(AdventurerContext);
  // All feedback information (including distance, which is not rateable)
  const feedbackInfo = useContext(FeedbackContext);
  const [newReview, setNewReview] = useState([]);
  // Get the restaurant viewing now
  const currentRestaurant =
    restaurants.length > 0 ? restaurants[indexRestaurant] : null;
  const isRated = currentRestaurant ? currentRestaurant.review != null : false;
  // Get the information for the active feedback areas
  // discarding distance (that is not to be rated forExperience)
  const feedbackAreas = feedbackInfo?.filter(
    (feedback) =>
      feedback.forExperience &&
      currentRestaurant?.activeFeedback.includes(feedback.objectId),
  );
  // find the photo reference of that restaurant
  const photoReference = currentRestaurant
    ? getPhotoReference(currentRestaurant)
    : null;

  function resetRatingForm() {
    if (feedbackAreas.length > 0) {
      return feedbackAreas.map((feedback) => ({
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
  }, [currentRestaurant, setNewReview, isRated]);

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
      onSelectRestaurant(indexRestaurant + 1);
    }
  }

  function onPrevious() {
    if (indexRestaurant > 0) {
      onSelectRestaurant(indexRestaurant - 1);
    }
  }

  const toast = useToast();
  function onSubmission() {
    submitRate(username, currentRestaurant.objectId, newReview).then((res) => {
      if (res.data) {
        restaurants[indexRestaurant] = {
          ...restaurants[indexRestaurant],
          review: newReview,
          meanScores: calculateNewMeanReviews(
            currentRestaurant.meanScores,
            currentRestaurant.reviewsNumber,
            newReview,
          )
        };
        onUpdateRestaurants([...restaurants]);
        toast(
          getToastOptions({
            title: 'Successfully rated',
            description: 'Thanks for rating!',
            status: 'success',
          }),
        );
      } else {
        toast(getToastOptions({ toast, status: 'error' }));
      }
    });
  }

  if (currentRestaurant) {
    return (
      <VStack width="50%" display="flex" justifyContent="flex-start">
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
            {currentRestaurant.matchScore}% match
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
        {!isRated ? (
          <RateExperience
            name={currentRestaurant.name}
            feedbackAreas={feedbackAreas}
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
        <Text>{currentRestaurant.formatted_address}</Text>
        <Box width="100%" mt="30px">
          <Heading textAlign="center" size="md">
            Statistics:
          </Heading>
          <Text textAlign="center">Ordered according to your preferences</Text>
        </Box>
        <VStack width="60%" spacing="20px" m="10px">
          {currentRestaurant.meanScores.map((meanScore) => (
            <Box
              width="80%"
              display="flex"
              flexDirection="column"
              alignContent="center"
            >
              <Text>{meanScore.preferenceName}</Text>
              <Progress
                height="20px"
                width="100%"
                value={meanScore.meanReviewScore}
                colorScheme="yellow"
              />
            </Box>
          ))}
        </VStack>
      </VStack>
    );
  }
}
