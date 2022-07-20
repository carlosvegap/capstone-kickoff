var express = require('express');
var router = express.Router();
const Parse = require('parse/node')
var axios = require('axios');

const api = process.env.NODE_ENV_GOOGLE_MAPS_API_KEY;

// ----- Get restaurants ------
router.post('/restaurants', async(req, res) => {
  const input = "restaurant"
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=${api}`,
    headers: { }
  };
  axios(config)
  .then(function (response) {
    res.status(200);
    res.send(response.data);
  })
  .catch(function (error) {
    res.status(400);
    res.send(error)
  });
})

Parse.initialize(process.env.NODE_ENV_ID_PROJECT, process.env.NODE_ENV_PROJECT_KEY);
Parse.serverURL = 'http://parseapi.back4app.com';

// ----- Get active user's preferences -----
router.post('/preferences/active', async(req, res) => {
  const query = new Parse.Query('UserPreference');
  query.equalTo("username", req.body.username)
  try {
    let currentPreferences = await query.find();
    res.status(200);
    res.send(currentPreferences[0].toJSON().activePreferences);
  } catch(error) {
    res.status(400);
    res.send(error);
  }
})

// ----- Get all existing Preferences -----
router.get('/preferences/all', async(req, res) => {
  const query = new Parse.Query('Preference');
  try {
    let preferences = await query.find();
    res.status(200);
    res.send(preferences);
  } catch(error) {
    res.status(400);
    res.send(error);
  }
})

// ----- Get all inactive preferences -----
router.post('/preferences/inactive', async(req, res) => {
  // req.body elements
  const username = req.body.username
  // Find current preferences
  const getUserPreferenceQuery = new Parse.Query('UserPreference');
  getUserPreferenceQuery.equalTo("username", username)
  let activePreferences = [];
  let userPreferences = await getUserPreferenceQuery.first();
  if (userPreferences != null) {
    activePreferences = userPreferences.toJSON().activePreferences;
  
    // Get all possible preferences
    const allPreferencesQuery = new Parse.Query('Preference');
    let allPreferences = null;
    allPreferences = await allPreferencesQuery.find();
  
    // Find inactive preferences
    let inactivePreferences = allPreferences.filter((preference) => !activePreferences.includes(preference.toJSON().objectId));
    const inactivePreferencesJSON = inactivePreferences.map((preference) => preference.toJSON())
    res.status(201);
    res.send(inactivePreferencesJSON);
  }
})

// ----- Get preferences information of a given array -----
router.post('/preferences/find', async(req, res) => {
  // req.body elements
  const objectIdArray = req.body.objectIdArray;
  let preferenceInformation = []
  const query = new Parse.Query("Preference");
  let allPreferences = [];
  try {
    allPreferences = await query.find()
  } catch(error) {
    res.status(400);
    res.send(error);
  }
  preferenceInformation = allPreferences.filter((preference) => objectIdArray.includes(preference.toJSON().objectId))
  preferenceInformationJSON = preferenceInformation.map((preference) => preference.toJSON())
  res.status(200);
  res.send(preferenceInformationJSON);
})

// ----- Update user's preferences ------
router.post('/preferences/update', async(req, res) => {
  // req.body elements
  const prioritize = req.body.prioritize;
  const activePreferences = req.body.activePreferences;
  const username = req.body.username;
  // Define changing elements
  let differentPriority = false;
  let differentActivePrefences = false;
  if (req.body.prioritize != null) differentPriority = true;
  if (req.body.activePreferences != null) differentActivePrefences = true;
  // Find objectId of the current user preference
  const findQuery = new Parse.Query('UserPreference');
  findQuery.equalTo("username", username)
  let objectId = null;
  try {
    let currentPreferences = await findQuery.find();
    objectId = currentPreferences[0].toJSON().objectId
  } catch(error) {
    res.status(401);
    res.send(error);
  }
  // Update information for that user
  let updateQuery = new Parse.Object('UserPreference');
  updateQuery.set('objectId', objectId)
  if (differentPriority) updateQuery.set('prioritize', prioritize)
  if (differentActivePrefences) updateQuery.set('activePreferences', activePreferences)
  try {
    await updateQuery.save();
    res.status(200);
    res.send('Success');
  } catch(error) {
    res.status(402);
    res.send(error);
  }
})

module.exports = router;