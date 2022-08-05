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
// Used by routes/adventure/restaurants
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

// Find all registered experiences on db
// Used by routes/adventure/getDatabaseRestaurants
async function ExperiencesQuery() {
  return (await new Parse.Query('Experience').find()).map((experience) =>
    experience.toJSON(),
  );
}

exports.ExperienceReviewsQuery = ExperienceReviewsQuery;
exports.UserPreferencesQuery = UserPreferencesQuery;
exports.AllFeedbackInfoQuery = AllFeedbackInfoQuery;
exports.UserReviewsQuery = UserReviewsQuery;
exports.ExperiencesQuery = ExperiencesQuery;
