const { Parse } = require('./../parse');

async function UserDataQuery(objectID) {
  return (
    await new Parse.Query('User').equalTo('objectId', objectID).first()
  ).toJSON();
}

async function LoginQuery(username, password) {
  return await Parse.User.logIn(username, password);
}

async function GeneralSignUpQuery(userForm) {
  try {
    await new Parse.User(userForm).signUp();
    return true;
  } catch (error) {
    return { error: { message: error.message }};
  }
}

async function InitializePreferencesQuery(username) {
  await new Parse.Object('UserPreference')
    .set('prioritize', false)
    .set('username', username)
    .set('activePreferences', [])
    .set('hasMinimumValue', [])
    .set('minValues', []).save();
}

async function InitializeExperienceQuery(username) {
  await new Parse.Object('Experience')
  .set('username', username)
  .set('name', '')
  .set('description', '')
  .set('email', '')
  .set('address', '')
  .set('lat', 0)
  .set('lng', 0)
  .set('activeFeedback', [])
  .save();
}

exports.UserDataQuery = UserDataQuery;
exports.LoginQuery = LoginQuery;
exports.GeneralSignUpQuery = GeneralSignUpQuery;
exports.InitializePreferencesQuery = InitializePreferencesQuery;
exports.InitializeExperienceQuery = InitializeExperienceQuery