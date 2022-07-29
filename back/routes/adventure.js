require('dotenv/config');
const { Parse } = require('./../parse');
var express = require('express');
var router = express.Router();
var axios = require('axios');

const api = process.env.NODE_ENV_GOOGLE_MAPS_API_KEY;

// ----- Get Google API restaurants -----
async function getGoogleRestaurants(radius, lat, lng) {
  const query = 'restaurant';
  const location = `${lat},${lng}`;
  const url = encodeURI(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${process.env.NODE_ENV_GOOGLE_MAPS_API_KEY}`,
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

// Find an user's preference
async function preferenceQuery(username) {
  const query = new Parse.Query('UserPreference');
  query.equalTo('username', username);
  const currentPreference = await query.first();
  return currentPreference.toJSON();
}

// Find mean for reviews of restaurant on a feedback
async function getMean(experienceId, feedbackId) {
  const values = await new Parse.Query('Review')
    .equalTo('experienceId', experienceId)
    .equalTo('feedbackId', feedbackId)
    .select('score')
    .find();
  if (values[0]) {
    const sum = values.reduce((sum, score) => sum + score.toJSON().score, 0);
    return sum / values.length;
  }
  return 0;
}

// ----- Get filtered restaurants ------
router.post('/restaurants', async (req, res) => {
  const userPreference = await preferenceQuery(req.body.username);
  let distance = 1000;
  if (userPreference.activePreferences.includes("FTmQoqHFVb")) {
    let index = userPreference.activePreferences.indexOf("FTmQoqHFVb")
    if (userPreference.hasMinimumValue[index]) distance = userPreference.minValues[index] * 1000
  }
  const allRestaurants = await getGoogleRestaurants(
    distance,
    req.body.lat,
    req.body.lng,
  );
  const restaurants = [];
  for (const restaurant of allRestaurants) {
    let passesFilter = true;
    let indexPreference = 0;
    for (const preferenceId of userPreference.activePreferences) {
      const val = await getMean(restaurant.place_id, preferenceId);
      if (userPreference.hasMinimumValue[indexPreference] && userPreference.minValues[indexPreference] > val) {
        passesFilter = false;
        break;
      }
      indexPreference++;
    }
    if (passesFilter) restaurants.push(restaurant);
  }
  res.send(restaurants).status(200);
});

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
