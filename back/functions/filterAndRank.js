const {
  ExperienceReviewsQuery,
  AllExperienceReviewsQuery,
} = require('../queries/adventure');

// ----- Find mean for reviews of restaurant on a feedback -----
async function getMean(experienceID, feedbackID) {
  // Find reviews of an experience on X feedback area
  const reviews = await ExperienceReviewsQuery(experienceID, feedbackID);
  // If it exists, return the mean of all reviews
  if (reviews[0]) {
    const sum = reviews.reduce((sum, score) => sum + score.toJSON().score, 0);
    return sum / reviews.length;
  }
  return null;
}

// Find max points an experience can get
function getMaxPoints(numberPreferences) {
  // factorial sum formula - Gauss technique
  return (numberPreferences + 1) * (numberPreferences / 2);
}

// Get the total number of reviews an experience has
async function getReviews(experienceID) {
  const reviewsNumber = await AllExperienceReviewsQuery(experienceID);
  return reviewsNumber;
}
/*
-_-_-_-_-_-_ FILTER / RANK ALGORITHM -_-_-_-_-_-_
It requires all active user preferences, all restaurants, feedback information
and the reviews of the user
These restaurants went already through the distance filter
It uses getMean to go through all reviews on a feedback area
and find the mean value
It uses getMaxPoints to find the maximum score an experience can have
(all perfect reviews)
If it is below the threshold, it is not included in the final restaurants
If it passes the threshold and the user wants priorization:
  - It finds the percentage of the meanValue vs the maximum possible value
  (found in allFeedbackInfo)
  - It assigns lineally more points to the first preference
  - It adds all those scores and compare it to the max points to
  determine match %
Additionally it includes if it is rated already by the user
(found in userReviews)
RETURNS: A list of Restaurants objects, including a matchScore
if priorization wanted
*/
async function filterAndRank(
  userPreference,
  allRestaurants,
  allFeedbackInfo,
  userReviews,
) {
  const priority = userPreference.prioritize;
  const restaurants = [];
  const maxPoints = getMaxPoints(userPreference.activePreferences.length);
  for (const restaurant of allRestaurants) {
    const meanScores = [];
    let score = 0;
    let passesFilter = true;
    let indexPreference = 0;
    const reviewsNumber = await getReviews(restaurant.place_id);
    for (const preferenceID of userPreference.activePreferences) {
      const feedbackMaxValue = allFeedbackInfo.find(
        (feedback) => feedback.objectId === preferenceID,
      ).maxValue;
      const preferenceName = allFeedbackInfo.find(
        (feedback) => feedback.objectId === preferenceID,
      ).displayText;
      const meanReviewScore = await getMean(restaurant.place_id, preferenceID);
      meanScores.push({
        preferenceName,
        meanReviewScore: (meanReviewScore / feedbackMaxValue) * 100,
      });
      // Find the matching score if the user has priorities
      if (priority) {
        // Find the max value of the current experience
        score +=
          (meanReviewScore / feedbackMaxValue) *
          (userPreference.activePreferences.length - indexPreference);
      }
      if (
        userPreference.hasMinimumValue[indexPreference] &&
        userPreference.minValues[indexPreference] > meanReviewScore
      ) {
        passesFilter = false;
        break;
      }
      indexPreference++;
    }
    if (passesFilter) {
      restaurants.push({
        ...restaurant,
        matchScore: priority
          ? Math.round((100 * score) / maxPoints)
          : undefined,
        /* activeFeedback was set in database restaurants.
        if it doesn't exist, it's a google restaurant,
        therefore all feedback applies */
        activeFeedback:
          restaurant.activeFeedback ??
          allFeedbackInfo.map((feedback) => feedback.objectId),
        // set review from the user if existing, otherwise undefined
        review: userReviews.find(
          (review) => review.experienceId === restaurant.place_id,
        ),
        reviewsNumber: reviewsNumber,
        meanScores,
      });
    }
  }
  if (priority) {
    restaurants.sort((a, b) => {
      return b.matchScore - a.matchScore;
    });
  }
  return restaurants;
}

exports.filterAndRank = filterAndRank;
