const {
  ExperienceReviewsQuery,
} = require('../queries/adventure');


// TODO: Use same function to get the number of reviews
// ----- Find mean for reviews of restaurant on a feedback -----
async function getMean(experienceID, feedbackID) {
  // Find reviews of an experience on X feedback area
  const reviews = await ExperienceReviewsQuery(experienceID, feedbackID);
  // If it exists, return the mean of all reviews
  if (reviews[0]) {
    const sum = reviews.reduce((sum, score) => sum + score.toJSON().score, 0);
    return sum / reviews.length;
  }
  return 0;
}
/* 
-_-_-_-_-_-_ FILTER / RANK ALGORITHM -_-_-_-_-_-_
It requires all active user preferences, all restaurants, feedback information and the reviews of the user 
These restaurants went already through the distance filter
It uses getMean to go through all reviews on a feedback area and find the mean value
If it is below the threshold, it is not included in the final restaurants
If it passes the threshold and the user wants priorization:
  - It finds the percentage of the meanValue vs the maximum possible value (found in allFeedbackInfo)
  - It assigns lineally more points to the first preference
Additionally it includes if it is rated already by the user (found in userReviews)
RETURNS: A list of Restaurants objects, including a matchScore if priorization wanted
*/
async function filterAndRank(
  userPreference,
  allRestaurants,
  allFeedbackInfo,
  userReviews,
) {
  const priority = userPreference.prioritize;
  const restaurants = [];
  for (const restaurant of allRestaurants) {
    let score = 0;
    let passesFilter = true;
    let indexPreference = 0;
    for (const preferenceID of userPreference.activePreferences) {
      const meanReviewScore = await getMean(restaurant.place_id, preferenceID);
      // Find the matching score if the user has priorities
      if (priority) {
        // Find the max value of the current experience
        const feedbackMaxValue = allFeedbackInfo.find(
          (feedback) => feedback.objectId === preferenceID,
        ).maxValue;
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
    }
    if (passesFilter) {
      restaurants.push({
        ...restaurant,
        matchScore: priority ? score : undefined,
        // activeFeedback was set in database restaurants. if it doesn't exist, it's a google restaurant: all feedback applies
        activeFeedback:
          restaurant.activeFeedback ??
          allFeedbackInfo.map((feedback) => feedback.objectId),
        // set review from the user if existing, otherwise undefined
        review: userReviews.find(
          (review) => review.experienceId === restaurant.place_id,
        ),
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
