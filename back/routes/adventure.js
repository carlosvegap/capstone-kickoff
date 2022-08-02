require('dotenv/config');
const { Parse } = require('./../parse');
const { ExperienceReviewsQuery, UserPreferencesIDsQuery, AllFeedbackInfoQuery, UserReviewsQuery, ExperiencesQuery } = require('../queries/adventure');
var express = require('express');
var router = express.Router();
var axios = require('axios');

const googleKey = process.env.NODE_ENV_GOOGLE_MAPS_API_KEY;
// QUESTION: Should I move the functions to another folder?

// TODO: Use same function to get the number of reviews
// Find mean for reviews of restaurant on a feedback
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
async function filterAndRank(userPreference, allRestaurants, allFeedbackInfo, userReviews) {
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
        const feedbackMaxValue = (allFeedbackInfo.find((feedback) => feedback.objectId === preferenceID)).maxValue
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
        activeFeedback: restaurant.activeFeedback ?? allFeedbackInfo.map((feedback) => feedback.objectId),
        // set review from the user if existing, otherwise undefined
        review: userReviews.find((review) => review.experienceId === restaurant.place_id)
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

// --------- FIND MATCHING RESTAURANTS -----
// -_-_-_-_-_-_-_-_FUNCTIONS_-_-_-_-_-_-_-_-_
// ----- Match Google API and database restaurant format -----
function formatRestaurantForGoogleAPI(restaurant) {
  return {
    name: restaurant.name,
    formatted_address: restaurant.address,
    geometry: {
      location: {
        lat: restaurant.lat,
        lng: restaurant.lng,
      },
    },
    place_id: restaurant.objectId,
    description: restaurant.description,
    username: restaurant.username,
    email: restaurant.email,
    distance: restaurant.distance,
    activeFeedback: restaurant.activeFeedback,
  };
}
// ----- Get Google API restaurants -----
async function getGoogleRestaurants(radius, lat, lng) {
  const query = 'restaurant';
  const location = `${lat},${lng}`;
  const url = encodeURI(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${googleKey}`,
  );
  var config = {
    method: 'get',
    url: url,
    headers: {},
  };
  const results = axios(config).then(function (response) {
    return response.data.results;
  });
  return results;
}
// ----- Get back4app restaurants -----
async function getDatabaseRestaurants(distance, userLat, userLng) {
  const allExperiences = await ExperiencesQuery();
  const experiences = [];
  for (const experience of allExperiences) {
    var config = {
      method: 'get',
      url: encodeURI(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLat},${userLng}&destinations=${experience.lat},${experience.lng}&key=${googleKey}`,
      ),
      headers: {},
    };
    await axios(config).then((response) => {
      if (response.data.rows[0].elements[0].distance.value <= distance) {
        experiences.push({
          ...experience,
          distance: response.data.rows[0].elements[0].distance.value,
        });
      }
    });
  }
  return experiences;
}
// -_-_-_-_-_-_-_ENDPOINT_-_-_-_-_-_-_-_-_-_
// Used in Adventurer.jsx
// ----- Get filtered restaurants ------
router.get('/restaurants', async (req, res) => {
  // Get active UsersPreferences IDs (array)
  const userPreference = await UserPreferencesIDsQuery(req.headers.username);
  // Get active UsersPreferences IDs (array)
  const allFeedbackInfo = await AllFeedbackInfoQuery();
  // Find all reviews of a user X
  const userReviews = await UserReviewsQuery(req.headers.username);
  // Contains the information of the distance from the db
  const distanceFeedback = allFeedbackInfo.find((feedback) => feedback.displayText === 'Distance')
  // Change meters to km in case distance is not defined by user
  let distance = distanceFeedback.defaultValue * 1000;
  // Get distance value by the user or by default in the database
  if (userPreference.activePreferences.includes(distanceFeedback.objectId)) {
    let index = userPreference.activePreferences.indexOf(
      distanceFeedback.objectId,
    );
    // Match km from UI options to meters in Google's API request
    if (userPreference.hasMinimumValue[index])
      distance = userPreference.minValues[index] * 1000;
    // Delete distance from userPreferences (handled by Google Maps and by our database)
    // The database records minValue even if it is not active (because if user turns it on, it should go back to that previous value) so it should be deleted
    userPreference.activePreferences.splice(index, 1);
    userPreference.hasMinimumValue.splice(index, 1);
    userPreference.minValues.splice(index, 1);
  }
  // Get restaurants from Google (limiting distance)
  const googleRestaurants = await getGoogleRestaurants(
    distance,
    req.query.lat,
    req.query.lng,
  );
  // Get restaurants from our records (limiting distance)
  let databaseRestaurants = await getDatabaseRestaurants(
    distance,
    req.query.lat,
    req.query.lng,
  );
  databaseRestaurants = databaseRestaurants.map((restaurant) =>
    formatRestaurantForGoogleAPI(restaurant),
  );
  const allRestaurants = googleRestaurants.concat(databaseRestaurants);
  // Calculate final restaurants
  const restaurants = await filterAndRank(userPreference, allRestaurants, allFeedbackInfo, userReviews);
  res.send(restaurants).status(200);
});



// NOT LONGER REQUIRED IF UserPreferencesIDsQuery work
// Find an user's preference
async function preferenceQuery(username) {
  const query = new Parse.Query('UserPreference');
  query.equalTo('username', username);
  const currentPreference = await query.first();
  return currentPreference.toJSON();
}




// ----- Get priorization preferences -----
router.post('/preferences/prioritize', async (req, res) => {
  const preference = await preferenceQuery(req.body.username);
  res.status(200).send(preference.prioritize);
});

// ----- Get active user's preferences IDs -----
router.post('/preferences/active', async (req, res) => {
  const preference = await preferenceQuery(req.body.username);
  res.status(200).send(preference.activePreferences);
});

// ----- Get active preferences' minimum values -----
router.post('/preferences/active/values', async (req, res) => {
  const preference = await preferenceQuery(req.body.username);
  res.status(200).send(preference.minValues);
});

// ----- Get validation for minimum values -----
router.post('/preferences/active/hasMinimum', async (req, res) => {
  const preference = await preferenceQuery(req.body.username);
  res.status(200).send(preference.hasMinimumValue);
});

// ----- Get all existing Preferences -----
router.post('/preferences/all', async (req, res) => {
  const query = new Parse.Query('Preference');
  let preferences = await query.find();
  res.status(200);
  res.send(preferences);
});

// ----- Get all inactive preferences IDS -----
router.post('/preferences/inactive', async (req, res) => {
  // Find current preferences
  let userPreferences = await preferenceQuery(req.body.username);
  if (userPreferences != null) {
    let activePreferences = [];
    activePreferences = userPreferences.activePreferences;
    // Get all possible preferences
    const allPreferencesQuery = new Parse.Query('Preference');
    let allPreferences = null;
    allPreferences = await allPreferencesQuery.find();
    // Find inactive preferences IDS
    let inactivePreferences = allPreferences.filter(
      (preference) => !activePreferences.includes(preference.toJSON().objectId),
    );
    const inactivePreferencesJSON = inactivePreferences.map(
      (preference) => preference.toJSON().objectId,
    );
    res.status(200);
    res.send(inactivePreferencesJSON);
  }
});

// ----- Get preferences information of a given array -----
router.post('/preferences/info', async (req, res) => {
  let preferenceInformation = [];
  const query = new Parse.Query('Preference');
  let allPreferences = [];
  allPreferences = await query.find();
  preferenceInformation = req.body.IDs.map((id) =>
    allPreferences.find((preference) => preference.toJSON().objectId === id),
  );
  preferenceInformationJSON = preferenceInformation.map((preference) =>
    preference.toJSON(),
  );
  res.status(200);
  res.send(preferenceInformationJSON);
});

// ----- Update user's preferences ------
router.post('/preferences/update', async (req, res) => {
  // Find objectId of the current user preference
  const findQuery = new Parse.Query('UserPreference');
  findQuery.equalTo('username', req.body.username);
  let objectId = null;
  let currentPreferences = await findQuery.first();
  objectId = currentPreferences.toJSON().objectId;
  // Update information for that user
  let updateQuery = new Parse.Object('UserPreference');
  updateQuery.set('objectId', objectId);
  // Determine what fields the user submitted to update them (if not found, that field remains as recorded in the db)
  updateQuery.set('prioritize', req.body.prioritize);
  updateQuery.set('activePreferences', req.body.activeIDs);
  updateQuery.set('minValues', req.body.minValues);
  updateQuery.set('hasMinimumValue', req.body.hasMinValues);
  try {
    await updateQuery.save();
    res.status(200);
    res.send(true);
  } catch (error) {
    res.send(false).status(400);
  }
});

module.exports = router;
