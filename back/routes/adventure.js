require('dotenv/config');
const { Parse } = require('./../parse');
const {
  UserPreferencesQuery,
  AllFeedbackInfoQuery,
  UserReviewsQuery,
  ExperiencesQuery,
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
    const inactivePreferencesIDs = inactivePreferences.map((preference) => preference.objectId)
    res.status(200).send({ active: activePreferencesIDs, inactive: inactivePreferencesIDs });
  } else {
    res.status(400).send({ error : { message: "No existing preferences record for that user" }})
  }
});

/* 
    
----------------------------------------------------
            NOT CHANGE YET !!!
----------------------------------------------------
*/

// TODO: Refactor code. This still works this way
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

// ----- Get priorization preferences -----
router.post('/preferences/prioritize', async (req, res) => {
  const preference = await UserPreferencesQuery(req.body.username);
  res.status(200).send(preference.prioritize);
});

// ----- Get active user's preferences IDs -----
router.post('/preferences/active', async (req, res) => {
  const preference = await UserPreferencesQuery(req.body.username);
  res.status(200).send(preference.activePreferences);
});

// ----- Get active preferences' minimum values -----
router.post('/preferences/active/values', async (req, res) => {
  const preference = await UserPreferencesQuery(req.body.username);
  res.status(200).send(preference.minValues);
});

// ----- Get validation for minimum values -----
router.post('/preferences/active/hasMinimum', async (req, res) => {
  const preference = await UserPreferencesQuery(req.body.username);
  res.status(200).send(preference.hasMinimumValue);
});

// ----- Get all inactive preferences IDS -----
router.post('/preferences/inactive', async (req, res) => {
  // Find current preferences
  let userPreferences = await UserPreferencesQuery(req.body.username);
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



module.exports = router;
