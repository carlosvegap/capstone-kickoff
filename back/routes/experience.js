require('dotenv/config');
const express = require('express');
const {
  AllFeedbackInfoQuery,
  ExperienceInfoQuery,
  UpdatePreferencesQuery,
  SubmitExperienceQuery,
  ReviewsQuery,
} = require('../queries/experience');
const { googleTextSearch } = require('../functions/googleTextSearch');
const router = express.Router();

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// ----- Get all Feedback Info ------
// Used in Adventurer.jsx in a useContext
// so that the rest of components can consume it
router.get('/preferences/all', async (req, res) => {
  const allFeedbackInfo = await AllFeedbackInfoQuery();
  res.status(200).send(allFeedbackInfo);
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// ----- Get Preference status ------
// Used in useSettings.jsx
// Returns an object in format
// {active: ['feedbackKey'...], inactive: ['feedbackKey'...]}
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
    res.status(400).send({
      error: { message: 'An error just happened.' },
    });
  }
});

/* -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
----- Get the information of an experience that user X owns -----
Used in Experience.jsx to determine if more information is needed
to redirect to register page */
router.get('/info', async (req, res) => {
  const experienceInfo = await ExperienceInfoQuery(req.headers.username);
  res.status(200).send(experienceInfo);
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// ----- Submit feedback preferences to db -----
router.post('/preferences/update', async (req, res) => {
  const objectId = (await ExperienceInfoQuery(req.headers.username)).objectId;
  const isUpdated = await UpdatePreferencesQuery(objectId, req.body.activeIDs);
  res.status(200).send(isUpdated);
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// Submit experience information
router.post('/submit', async (req, res) => {
  const objectID = (await ExperienceInfoQuery(req.headers.username)).objectId;
  const isSubmitted = await SubmitExperienceQuery(
    objectID,
    req.body.formValues,
  );
  res.status(200).send(isSubmitted);
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// ----- Get possible claimed restaurant ------
router.get('/similar', async (req, res) => {
  const results = await googleTextSearch(100, req.query.lat, req.query.lng);
  res.status(200).send(results.filter((res, index) => index < 3));
});

/* -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
----- Get all reviews and comments for an experience -----
Used in Performance.jsx, to display statistics */
router.get('/performance', async (req, res) => {
  const experienceReviews = await ReviewsQuery(req.query.experienceID);
  res.status(200).send(experienceReviews);
});

module.exports = router;
