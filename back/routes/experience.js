require("dotenv/config")
var express = require('express');
var router = express.Router();
const { Parse } = require('./../parse')

// ----- Get the experience the user owns -----
router.post('/info', async(req, res) => {
  const query = new Parse.Query('Experience');
  query.equalTo("username", req.body.username);
  let experienceInfo = await query.first();
  res.status(200).send(experienceInfo);
})

// Submit experience information
router.post('/submit', async(req, res) => {
  const findOwnerQuery = new Parse.Query('Experience');
  findOwnerQuery.equalTo("username", req.body.username);
  let existingExperience = await findOwnerQuery.first();
  let Experience = new Parse.Object('Experience')
  // overwrite existing experience if it exists
  if (existingExperience != null) {
    Experience.set('objectId', existingExperience.toJSON().objectId)
  } else {
    Experience.set('username', req.body.username)
  }
  Object.keys(req.body.formValues).map((key) => {
    Experience.set(key, req.body.formValues[key])
  })
  await Experience.save()
  res.send(true).status(200);
})

// -_-_-_-_-_-_-_-_ QUERIES -_-_-_-_-_-_-_

// ----- Query for active feedback areas -----
async function activeFeedbackQuery(username){
  const query = new Parse.Query('Experience');
  query.equalTo("username", username);
  let experienceInfo = await query.first();
  return experienceInfo.toJSON().activeFeedback
}

// ----- Query for active feedback areas -----
async function allFeedbackQuery(){
  let query = new Parse.Query('Feedback');
  let feedbackInfo = await query.find();
  return feedbackInfo
}

// -_-_-_-_-_-_-_-_ ENDPOINTS -_-_-_-_-_-_-_

// ------ Get active feedback areas IDs -----
router.post('/feedback/active', async(req, res) => {
  let activeFeedback = await activeFeedbackQuery(req.body.username);
  res.status(200).send(activeFeedback)
})

// ----- Get inactive feedback areas IDs ------
router.post('/feedback/inactive', async(req, res) => {
  // Find active areas
  let activeFeedback = await activeFeedbackQuery(req.body.username);
  // Find all feedback areas
  let allFeedback = await allFeedbackQuery();
  // Discard active from all to get inactive
  let inactiveFeedback = allFeedback.filter((feedback) => !activeFeedback.includes(feedback.toJSON().objectId))
  // Return only the id of the feedback
  let inactiveFeedbackIDs = inactiveFeedback.map((feedback) => feedback.toJSON().objectId)
  res.status(200).send(inactiveFeedbackIDs);
})

// ----- Get feedback information of a given array -----
router.post('/feedback/info', async(req, res) => {
  let allFeedback = await allFeedbackQuery();
  // let feedbackInfo = allFeedback.filter(())
  let feedbackInfo = req.body.IDs.map((id) => 
    allFeedback.find((feedback) =>
      feedback.toJSON().objectId === id)
  )
  let feedbackInfoJSON = feedbackInfo.map((feedback) => feedback.toJSON())
  res.status(200).send(feedbackInfoJSON)
})

// ----- Submit feedback preferences to db -----
router.post('/feedback/update', async(req, res) => {
  const findQuery = new Parse.Query('Experience');
  findQuery.equalTo("username", req.body.username);
  let currentExperience = await findQuery.first();
  let objectId = currentExperience.toJSON().objectId;
  const updateQuery = new Parse.Object('Experience');
  updateQuery.set('objectId', objectId);
  updateQuery.set('activeFeedback', req.body.activeIDs);
  try {
    await updateQuery.save();
    res.status(200).send(true);
  } catch (error) {
    res.status(400).send(false);
  }
})

module.exports = router;
