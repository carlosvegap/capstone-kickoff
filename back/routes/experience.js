require('dotenv/config');
var express = require('express');
const { Parse } = require('./../parse');
const {
  AllFeedbackInfoQuery,
  ExperienceInfoQuery,
} = require('../queries/experience');
var router = express.Router();

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// ----- Get feedback information of a given array -----
router.get('/preferences/all', async (req, res) => {
  const allFeedbackInfo = await AllFeedbackInfoQuery();
  res.status(200).send(allFeedbackInfo);
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// ----- Get Preference status ------
// Used in useSettings.jsx
// Returns an object in format {active: ['feedbackKey'...], inactive: ['feedbackKey'...]}
router.get('/preferences/status', async (req, res) => {
  const experienceInfo = await ExperienceInfoQuery(req.headers.username);
  const allFeedback = await AllFeedbackInfoQuery();
  // It should pass, since Experience is created with sign up by default
  if (experienceInfo) {
    const activePreferencesIDs = experienceInfo.activeFeedback;
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
        error: { message: 'An error just happened.' },
      });
  }
});

/* 
---------------------------
---------------------------
---------------------------
OLD VERSION
---------------------------
---------------------------
----------------------------
*/

// ----- Get the experience the user owns -----
router.post('/info', async (req, res) => {
  const query = new Parse.Query('Experience');
  query.equalTo('username', req.body.username);
  const experienceInfo = await query.first();
  res.status(200).send(experienceInfo);
});

// Submit experience information
router.post('/submit', async (req, res) => {
  const findOwnerQuery = new Parse.Query('Experience');
  findOwnerQuery.equalTo('username', req.body.username);
  const existingExperience = await findOwnerQuery.first();
  const Experience = new Parse.Object('Experience');
  // overwrite existing experience if it exists
  if (existingExperience != null) {
    Experience.set('objectId', existingExperience.toJSON().objectId);
  } else {
    Experience.set('username', req.body.username);
  }
  Object.keys(req.body.formValues).map((key) => {
    Experience.set(key, req.body.formValues[key]);
  });
  await Experience.save();
  res.send(true).status(200);
});

// -_-_-_-_-_-_-_-_ QUERIES -_-_-_-_-_-_-_

// ----- Query for active feedback areas -----
async function activeFeedbackQuery(username) {
  const query = new Parse.Query('Experience');
  query.equalTo('username', username);
  const experienceInfo = await query.first();
  if (experienceInfo) return experienceInfo.toJSON().activeFeedback;
  return [];
}

// ----- Query for all feedback areas -----
async function allFeedbackQuery() {
  const query = new Parse.Query('Preference');
  query.equalTo('forExperience', true);
  const feedbackInfo = await query.find();
  return feedbackInfo;
}

// -_-_-_-_-_-_-_-_ ENDPOINTS -_-_-_-_-_-_-_

// ------ Get active feedback areas IDs -----
router.post('/feedback/active', async (req, res) => {
  const activeFeedback = await activeFeedbackQuery(req.body.username);
  res.status(200).send(activeFeedback);
});

// ----- Get inactive feedback areas IDs ------
router.post('/feedback/inactive', async (req, res) => {
  // Find active areas
  const activeFeedback = await activeFeedbackQuery(req.body.username);
  // Find all feedback areas
  const allFeedback = await allFeedbackQuery();
  // Discard active from all to get inactive
  const inactiveFeedback = allFeedback.filter(
    (feedback) => !activeFeedback.includes(feedback.toJSON().objectId),
  );
  // Return only the id of the feedback
  const inactiveFeedbackIDs = inactiveFeedback.map(
    (feedback) => feedback.toJSON().objectId,
  );
  res.status(200).send(inactiveFeedbackIDs);
});

// ----- Get feedback information of a given array -----
router.post('/feedback/info', async (req, res) => {
  const allFeedback = await allFeedbackQuery();
  // let feedbackInfo = allFeedback.filter(())
  const feedbackInfo = req.body.IDs.map((id) =>
    allFeedback.find((feedback) => feedback.toJSON().objectId === id),
  );
  const feedbackInfoJSON = feedbackInfo.map((feedback) => feedback.toJSON());
  res.status(200).send(feedbackInfoJSON);
});

// ----- Submit feedback preferences to db -----
router.post('/preferences/update', async (req, res) => {
  const findQuery = new Parse.Query('Experience');
  findQuery.equalTo('username', req.headers.username);
  const currentExperience = await findQuery.first();
  const objectId = currentExperience.toJSON().objectId;
  const updateQuery = new Parse.Object('Experience');
  updateQuery.set('objectId', objectId);
  updateQuery.set('activeFeedback', req.body.activeIDs);
  try {
    await updateQuery.save();
    res.status(200).send(true);
  } catch (error) {
    res.status(400).send(false);
  }
});

module.exports = router;
