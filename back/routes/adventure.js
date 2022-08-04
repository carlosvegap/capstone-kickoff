require('dotenv/config');
const {
  UserPreferencesQuery,
  AllFeedbackInfoQuery,
  UserReviewsQuery,
  ExperiencesQuery,
  RateQuery,
  UpdatePreferenceQuery,
} = require('../queries/adventure');
const { filterAndRank } = require('../functions/adventure');
var express = require('express');
var router = express.Router();
var axios = require('axios');

const googleKey = process.env.NODE_ENV_GOOGLE_MAPS_API_KEY;

// --------- FIND MATCHING RESTAURANTS -----
// -_-_-_-_-_-_-_-_FUNCTIONS_-_-_-_-_-_-_-_-_
// ------- Match Google API and database restaurant format -------
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
// ------- Get Google API restaurants -------
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
// ------- Get back4app restaurants -------
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
// ------- Find distance by user or set default value -------
function determineDistance(userPreference, distanceFeedback) {
  // Change meters to km in case distance is not defined by user
  let distance = distanceFeedback.defaultValue * 1000;
  // Get distance value by the user if existing
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
  return { userPreference, distance };
}
// -_-_-_-_-_-_-_ENDPOINT_-_-_-_-_-_-_-_-_-_
// ----- Get filtered restaurants ------
// Used in Adventurer.jsx so that the adventurerContext can provide all restaurants information
router.get('/restaurants', async (req, res) => {
  // Get active UsersPreferences from db
  const registeredUserPreference = await UserPreferencesQuery(
    req.headers.username,
  );
  const allFeedbackInfo = await AllFeedbackInfoQuery();
  // Find all reviews of a user X
  const userReviews = await UserReviewsQuery(req.headers.username);
  // Contains the information of the distance from the db
  const distanceFeedback = allFeedbackInfo.find(
    (feedback) => feedback.displayText === 'Distance',
  );
  // Find working distance and remove it from userPreference if exists (will be processed differently)
  const { userPreference, distance } = determineDistance(
    registeredUserPreference,
    distanceFeedback,
  );
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
  const restaurants = await filterAndRank(
    userPreference,
    allRestaurants,
    allFeedbackInfo,
    userReviews,
  );
  res.send(restaurants).status(200);
});

// -_-_-_-_-_-_-_ENDPOINT_-_-_-_-_-_-_-_-_-_
// ----- Get all Feedback Info ------
// Used in Adventurer.jsx in a useContext so that the rest of components can consume it
router.get('/preferences/all', async (req, res) => {
  const feedbackInfo = await AllFeedbackInfoQuery();
  res.status(200).send(feedbackInfo);
});

// -_-_-_-_-_-_-_ENDPOINT_-_-_-_-_-_-_-_-_-_
// ----- Get Feedback status ------
// Used in useSettings.jsx
// Returns an object in format {active: ['feedbackKey'...], inactive: ['feedbackKey'...]}
router.get('/preferences/status', async (req, res) => {
  // Find current preferences
  const userPreferences = await UserPreferencesQuery(req.headers.username);
  // Find all possible Feedback areas
  const allFeedback = await AllFeedbackInfoQuery();
  // There should be preferences since they are created when SignUp is correct
  if (userPreferences != null) {
    const activePreferencesIDs = userPreferences.activePreferences;
    // Find inactive preferences IDS
    const inactivePreferences = allFeedback.filter(
      (feedback) => !activePreferencesIDs.includes(feedback.objectId),
    );
    const inactivePreferencesIDs = inactivePreferences.map(
      (preference) => preference.objectId,
    );
    res
      .status(200)
      .send({ active: activePreferencesIDs, inactive: inactivePreferencesIDs });
  } else {
    res
      .status(400)
      .send({
        error: { message: 'No existing preferences record for that user' },
      });
  }
});

// -_-_-_-_-_-_-_ENDPOINT_-_-_-_-_-_-_-_-_-_
// ----- Submit a review ------
// Used in ExperienceInfo.jsx
// Returns a bool with submission status
router.post('/rate', async (req, res) => {
  const hasError = RateQuery(
    req.body.reviews,
    req.headers.username,
    req.headers.experienceid,
  );
  res.status(200).send(hasError);
});

// -_-_-_-_-_-_-_ENDPOINT_-_-_-_-_-_-_-_-_-_
// ----- Update user's preferences ------
// Used in useSettings.jsx
// Returns a bool with update status
router.post('/preferences/update', async (req, res) => {
  const isUpdated = await UpdatePreferenceQuery(
    req.headers.username,
    req.body.prioritize,
    req.body.activeIDs,
    req.body.minValues,
    req.body.hasMinValues,
  );
  res.status(200).send(isUpdated);
});

// -_-_-_-_-_-_-_ENDPOINT_-_-_-_-_-_-_-_-_-_
// ----- Preferences restrictions ------
// Used in useSettings.jsx
// Returns priorization (bool indicating if ranking algorithm is active), minValues (array of values) and hasMinValues (array of bools stating if the minValue is active - to filter)
// Format: {prioritize, minValues, hasMinimumValue}
router.get('/preferences/restrictions', async (req, res) => {
  const preference = await UserPreferencesQuery(req.headers.username);
  res
    .status(200)
    .send({
      prioritize: preference.prioritize,
      minValues: preference.minValues,
      hasMinimumValue: preference.hasMinimumValue,
    });
});
    
module.exports = router;
