require("dotenv/config")
var express = require('express');
var router = express.Router();
var axios = require('axios');
const { Parse } = require('./../parse')

// ----- Get the experience the user owns -----
router.get('/experience', async(req, res) => {
  const query = new Parse.Query('Experience');
  query.equalTo("objectId", req.body.experienceId)
  let experienceInfo = await query.first();
  res.status(200);
  res.send(experienceInfo.toJSON());
})

// Submit experience information
router.post('/myExperience', async(req, res) => {
  
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
router.post('/feedback/find', async(req, res) => {
  let allFeedback = await allFeedbackQuery();
  // let feedbackInfo = allFeedback.filter(())
  let feedbackInfo = req.body.objectIdArray.map((id) => 
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
  const updateQuery = new Parse.Query('Experience');
  updateQuery.set('objectId', objectId);
  updateQuery.set('activeFeedback', req.body.activeFeedback);
  try {
    await updateQuery.save();
    res.status(200).send(true);
  } catch (error) {
    res.status(400).send(false);
  }
})

module.exports = router;
