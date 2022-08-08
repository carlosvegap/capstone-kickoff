const { Parse } = require('./../parse');

// Get all existing feedback that is available for Experience
// Used by routes/experience/preferences/all
async function AllFeedbackInfoQuery() {
  return (await new Parse.Query('Preference').equalTo('forExperience', true).find()).map((preference) =>
    preference.toJSON(),
  );
}

// Get all records of an experience
// Used by routes/experience/preferences/status
async function ExperienceInfoQuery(username) {
  const experienceInfo = (await new Parse.Query('Experience').equalTo('username', username).first())
  return experienceInfo.toJSON();
}

exports.AllFeedbackInfoQuery = AllFeedbackInfoQuery;
exports.ExperienceInfoQuery = ExperienceInfoQuery;
