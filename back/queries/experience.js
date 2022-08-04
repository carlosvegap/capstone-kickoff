const { Parse } = require('./../parse');

// Get all existing feedback that is available for Experience
// Used by routes/experience/preferences/all
async function AllFeedbackInfoQuery() {
  return (await new Parse.Query('Preference').equalTo('forExperience', true).find()).map((preference) =>
    preference.toJSON(),
  );
}

exports.AllFeedbackInfoQuery = AllFeedbackInfoQuery;
