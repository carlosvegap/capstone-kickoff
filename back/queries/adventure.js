const { Parse } = require('./../parse');

// Find reviews of an experience on X feedback area
// Used by functions/adventure/getMean
async function ExperienceReviewsQuery(experienceID, feedbackID) {
  return await new Parse.Query('Review')
    .equalTo('experienceId', experienceID)
    .equalTo('feedbackId', feedbackID)
    .select('score')
    .find();
}

// Get active UsersPreferences fields
// Used by routes/adventure/restaurants, routes/adventure/preferences/restrictions
async function UserPreferencesQuery(username) {
  return (
    await new Parse.Query('UserPreference')
      .equalTo('username', username)
      .first()
  ).toJSON();
}

// Get all existing feedback
// Used by routes/adventure/restaurants, routes/adventure/allFeedback
async function AllFeedbackInfoQuery() {
  return (await new Parse.Query('Preference').find()).map((preference) =>
    preference.toJSON(),
  );
}

// Find all reviews of a user X
// Used by routes/adventure/restaurants
async function UserReviewsQuery(username) {
  return (
    await new Parse.Query('Review')
      .equalTo('adventurerUsername', username)
      .find()
  ).map((review) => review.toJSON());
}

/* Find all reviews of an experience by ID
   It groups those made by the same user, since each review is on a single
   preference area
Used by functions/filterAndRank */
async function AllExperienceReviewsQuery(experienceID) {
  let totalReviews = 0;
  const ratingUsers = [];
  const reviews = await new Parse.Query('Review')
      .equalTo('experienceId', experienceID)
      .find();
  reviews.map((review) => {
        if (!ratingUsers.includes(review.toJSON().adventurerUsername)) {
          totalReviews++;
          ratingUsers.push(review.toJSON().adventurerUsername);
        }
      });
  return totalReviews;
}

// Find all registered experiences on db
// Used by routes/adventure/getDatabaseRestaurants
async function ExperiencesQuery() {
  return (await new Parse.Query('Experience').find()).map((experience) =>
    experience.toJSON(),
  );
}

// Submit a review by an adventurer and return success or fail
// Used by /routes/adventure/rate
async function RateQuery(reviews, username, experienceId) {
  let hasError = false;
  await Promise.all(
    reviews.map(async (review) => {
      const newReview = new Parse.Object('Review');
      newReview.set('feedbackId', review.feedbackId);
      newReview.set('adventurerUsername', username);
      newReview.set('experienceId', experienceId);
      newReview.set('score', review.score);
      newReview.set('comment', review.comment);
      try {
        await newReview.save();
      } catch (err) {
        hasError = true;
      }
    }),
  );
  return hasError;
}

// Update preferences query
// Used by routes/adventure/preferences/update
async function UpdatePreferenceQuery(username, prioritize, activeIDs, minValues, hasMinValues) {
    // Find objectId of the current userPreference entry
    const objectId = (await new Parse.Query('UserPreference').equalTo('username', username).first()).toJSON().objectId
    // Update information for that user
    try {
      await new Parse.Object('UserPreference')
      .set('objectId', objectId)
      .set('prioritize', prioritize)
      .set('activePreferences', activeIDs)
      .set('minValues', minValues)
      .set('hasMinimumValue', hasMinValues)
      .save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
}

exports.ExperienceReviewsQuery = ExperienceReviewsQuery;
exports.UserPreferencesQuery = UserPreferencesQuery;
exports.AllFeedbackInfoQuery = AllFeedbackInfoQuery;
exports.UserReviewsQuery = UserReviewsQuery;
exports.ExperiencesQuery = ExperiencesQuery;
exports.RateQuery = RateQuery;
exports.UpdatePreferenceQuery = UpdatePreferenceQuery;
exports.AllExperienceReviewsQuery = AllExperienceReviewsQuery;
