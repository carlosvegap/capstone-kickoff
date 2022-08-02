const { Parse } = require('./../parse');

// Find reviews of an experience on X feedback area
// Used by /restaurants
async function ExperienceReviewsQuery(experienceID, feedbackID) {
  return await new Parse.Query('Review')
    .equalTo('experienceId', experienceID)
    .equalTo('feedbackId', feedbackID)
    .select('score')
    .find();
}

// Get active UsersPreferences IDs (array)
// Used by /restaurants
async function UserPreferencesIDsQuery(username) {
  return (
    await new Parse.Query('UserPreference')
      .equalTo('username', username)
      .first()
  ).toJSON();
}

// Get active UsersPreferences IDs (array)
// Used by /restaurants
async function AllFeedbackInfoQuery() {
  return (await new Parse.Query('Preference').find()).map((preference) =>
    preference.toJSON(),
  );
}

// Find all reviews of a user X
// Used by /restaurants
async function UserReviewsQuery(username) {
  return (
    await new Parse.Query('Review')
      .equalTo('adventurerUsername', username)
      .find()
  ).map((review) => review.toJSON());
}

// Find all experiences
// Used by /restaurants getDatabaseRestaurants
async function ExperiencesQuery() {
  return (await new Parse.Query('Experience').find()).map((experience) =>
    experience.toJSON(),
  );
}

exports.ExperienceReviewsQuery = ExperienceReviewsQuery;
exports.UserPreferencesIDsQuery = UserPreferencesIDsQuery;
exports.AllFeedbackInfoQuery = AllFeedbackInfoQuery;
exports.UserReviewsQuery = UserReviewsQuery;
exports.ExperiencesQuery = ExperiencesQuery;
