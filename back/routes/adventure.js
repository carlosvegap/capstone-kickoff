require('dotenv/config');
const { Parse } = require('./../parse');
var express = require('express');
var router = express.Router();
var axios = require('axios');

const googleKey = process.env.NODE_ENV_GOOGLE_MAPS_API_KEY;

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

// ----- format to match google api values with database restaurants values -----
function formatRestaurant(restaurant) {
  return (
    {
      name: restaurant.name,
      formatted_address: restaurant.address,
      geometry: {
        location: {
          lat: restaurant.lat,
          lng: restaurant.lng,
        }
      },
      place_id: restaurant.objectId,
      description: restaurant.description,
      username: restaurant.username,
      email: restaurant.email,
      activeFeedback: restaurant.activeFeedback,
    }
  )
}

// ----- Get back4app restaurants -----
async function getDatabaseRestaurants(distance, userLat, userLng) {
  const allExperiences = await new Parse.Query('Experience').find();
  let experiences = []
  allExperiences.map((exp) => {
    const experience = exp.toJSON()
    var config = {
      method: 'get',
      url: encodeURI(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userLat},${userLng}&destinations=${experience.lat},${experience.lng}&key=${googleKey}`),
      headers: { }
    };
    // QUESTION: Why is that not working?
    axios(config).then(async(response) => {
      if (response.data.rows[0].elements[0].distance.value <= distance) {
        console.log(true)
        experiences.push(experience)
        console.log(experiences)
        return experiences;
      }
    })
  })
  console.log(experiences)
  return experiences;
  // return allExperiences.map((exp) => exp.toJSON());
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

/* 
-_-_-_-_-_-_ FILTER / RANK ALGORITHM -_-_-_-_-_-_
It requires all active preferences and all restaurants. 
This restaurants went already through the distance filter
It uses getMean to go through all reviews on a feedback area and find the mean value
If it is below the threshold, it is not included in the final restaurants
If it passes the threshold and the user wants priorization:
  - It finds the percentage of the meanValue vs the maximum possible value
  - It assigns lineally more points to the first preference
RETURNS: A list of Restaurants objects, including a matchScore if priorization wanted
*/
async function filterAndRank(userPreference, allRestaurants ) {
  const priority = userPreference.prioritize
  const restaurants = [];
  for (const restaurant of allRestaurants) {
    let score = 0;
    const passesFilter = (userPreference.activePreferences).every(async (preferenceID, indexPreference) => {
      const meanReviewScore = await getMean(restaurant.place_id, preferenceId);
      if (priority) {
        const feedbackMaxValue = await new Parse.Query('Preference').equalTo('objectId', preferenceID).select('maxValue').first();
        score += ( meanReviewScore / feedbackMaxValue.toJSON().maxValue ) * ( userPreference.activePreferences.length - indexPreference )
      }
      if (!userPreference.hasMinValues[indexPreference]) return false;
      return (userPreference.minValues[indexPreference] > meanReviewScore)
    })
    if (passesFilter && priority) restaurants.push({...restaurant, matchScore: score});
    else if (passesFilter) restaurants.push(restaurant);
  }
  if (priority) {
    restaurants.sort((a, b) => {
      return b.matchScore - a.matchScore;
    })
  }
  return restaurants;
}

// ----- Get filtered restaurants ------
router.post('/restaurants', async (req, res) => {
  const userPreference = await preferenceQuery(req.body.username);

  // Contains the information of the distance from the db
  const distanceFeedback = (await new Parse.Query('Preference').equalTo('displayText', "Distance").first()).toJSON();
  
  let distance = distanceFeedback.defaultValue;
  // Get distance value by the user or by default in the database
  if (userPreference.activePreferences.includes(distanceFeedback.objectId)) {
    let index = userPreference.activePreferences.indexOf(distanceFeedback.objectId)
    // Match km from UI options to meters in Google's API request
    if (userPreference.hasMinimumValue[index]) distance = userPreference.minValues[index] * 1000;
    // Delete distance from userPreferences (handled by Google Maps and by our database)
    // The database records minValue even if it is not active (so if user turns it on, it goes back to that)
    (userPreference.activePreferences).splice(index, 1);
    (userPreference.hasMinimumValue).splice(index, 1);
    (userPreference.minValues).splice(index, 1);
  }

  // Get restaurants from Google (limiting distance)
  const googleRestaurants = await getGoogleRestaurants(
    distance,
    req.body.lat,
    req.body.lng,
  );
  // Get restaurants from our records (limiting distance)
  let databaseRestaurants = await getDatabaseRestaurants(distance, req.body.lat, req.body.lng);
  console.log('database')
  console.log(databaseRestaurants)
  databaseRestaurants = databaseRestaurants.map((restaurant) => formatRestaurant(restaurant));

  const allRestaurants = googleRestaurants.concat(databaseRestaurants)

  // Calculate final restaurants
  const restaurants = await filterAndRank(userPreference, allRestaurants);
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
