const { Parse } = require('./../parse');

// Get all existing feedback that is available for Experience
// Used by routes/experience/preferences/all
async function AllFeedbackInfoQuery() {
  return (await new Parse.Query('Preference').equalTo('forExperience', true).find()).map((preference) =>
    preference.toJSON(),
  );
}

// Get all records of an experience
// Used by 
// -> routes/experience/preferences/status, 
// -> routes/experience/preferences/update
async function ExperienceInfoQuery(username) {
  return (await new Parse.Query('Experience').equalTo('username', username).first()).toJSON();
}

// Update active preferences of an experience
// Used by routes/experience/preferences/update
async function UpdatePreferencesQuery(objectID, activeIDs) {
  const updateQuery = new Parse.Object('Experience');
  updateQuery.set('objectId', objectID);
  updateQuery.set('activeFeedback', activeIDs);
  try {
    await updateQuery.save();
    return true;
  } catch (error) {
    return false;
  }
}

exports.AllFeedbackInfoQuery = AllFeedbackInfoQuery;
exports.ExperienceInfoQuery = ExperienceInfoQuery;
exports.UpdatePreferencesQuery = UpdatePreferencesQuery;
