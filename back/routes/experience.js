require('dotenv/config');
var express = require('express');
const { Parse } = require('./../parse');
const {
  AllFeedbackInfoQuery,
  ExperienceInfoQuery,
  UpdatePreferencesQuery,
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

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// ----- Submit feedback preferences to db -----
router.post('/preferences/update', async (req, res) => {
  const objectId = (await ExperienceInfoQuery(req.headers.username)).objectId;
  const isUpdated = await UpdatePreferencesQuery(objectId, req.body.activeIDs)
  res.status(200).send(isUpdated);
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

module.exports = router;
