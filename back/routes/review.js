require("dotenv/config")
var express = require('express');
var router = express.Router();
const { Parse } = require('./../parse')

// ----- Get Reviews for an Experience -----
router.post('/experience/reviews', async(req, res) => {
  const query = new Parse.Query('Review');
  query.equalTo("experienceId", req.body.experienceId);
  let experienceReviews = await query.find();
  res.status(200).send(experienceReviews);
})

// Find review of a user X to experience Y
async function getReview(username, experienceId) {
  const query = new Parse.Query('Review');
  query.equalTo('adventurerUsername', username);
  query.equalTo('experienceId', experienceId);
  return query.first()
}

// ----- Check if an user has rated that experience -----
router.post('/isRated', async(req, res) => {
  let review = await getReview(req.body.username, req.body.experienceId)
  if (review) {
    res.status(200).send(true)
  } else {
    res.status(200).send(false);
  }
})

// ----- Submit a review -----
router.post('/rate', async(req, res) => {
  let hasError = false
  await Promise.all((req.body.reviews).map(async (adventurerReview) => {
    const review = new Parse.Object('Review');
    review.set('feedbackId', adventurerReview.feedbackId)
    review.set('adventurerUsername', req.body.username)
    review.set('experienceId', req.body.experienceId)
    review.set('score', adventurerReview.score)
    review.set('comment', adventurerReview.comment)
    try {
      await review.save();
    } catch(err) {
      hasError = true
    }
  }))
  if (hasError) {
    res.status(400).send(false);
  }
  else {
    res.status(200).send(true);
  }
})

// Query for all reviews
async function getReviews(experienceId) {
  const query = new Parse.Query('Review');
  query.equalTo("experienceId", experienceId);
  const reviews = await query.find();
  return reviews.map((review) => review.toJSON())
}

// ----- Receive ALL reviews according to experienceId -----
router.post('/all', async(req, res) => {
  const reviews = await getReviews(req.body.experienceId)
  res.status(200).send(reviews);
})

// Query for active feedback areas 
async function activeFeedbackQuery(objectId){
  const query = new Parse.Query('Experience');
  query.equalTo('objectId', objectId);
  let experienceInfo = await query.first();
  if (experienceInfo) {
    return experienceInfo.toJSON().activeFeedback
  }
  const allFeedbackQuery = new Parse.Query('Feedback');
  const allFeedback = await allFeedbackQuery.find();
  const allFeedbackIDs = allFeedback.map((feedback) => feedback.toJSON().objectId)
  return allFeedbackIDs;
}

// ----- Get feedback areas of an experience -----
router.post('/active/info', async(req, res) => {
  const activeFeedbackIDs = await activeFeedbackQuery(req.body.experienceId);
  const allFeedbackQuery = new Parse.Query('Feedback');
  const allFeedback = await allFeedbackQuery.find();
  const activeFeedbackInfo = activeFeedbackIDs.map((idActive) => 
    allFeedback.find((feedback) => 
      feedback.toJSON().objectId === idActive
    )
  )
  res.status(200).send(activeFeedbackInfo);
})
   
// ----- Receive only reviews where the experience has declared they want feedback -----
router.post('/active', async(req, res) => {
  const reviews = await getReviews(req.body.experienceId)
  const activeFeedback = await activeFeedbackQuery(req.body.experienceId)
  const activeReviews = reviews.filter((review) => activeFeedback.includes(review.feedbackId))
  res.status(200).send(activeReviews)
})

module.exports = router;
