const { Parse } = require('./../parse');

async function UserDataQuery(objectID) {
  return (
    await new Parse.Query('User').equalTo('objectId', objectID).first()
  ).toJSON();
}

async function LoginQuery(username, password) {
  try {
    return await Parse.User.logIn(username, password);
  } catch (error) {
    return { error: { message: error.message } };
  }
}

async function GeneralSignUpQuery(userForm) {
  try {
    await new Parse.User(userForm).signUp();
    return true;
  } catch (error) {
    return { error: { message: error.message } };
  }
}

async function InitializePreferencesQuery(username) {
  await new Parse.Object('UserPreference')
    .set('prioritize', false)
    .set('username', username)
    .set('activePreferences', [])
    .set('hasMinimumValue', [])
    .set('minValues', [])
    .save();
}

exports.UserDataQuery = UserDataQuery;
exports.LoginQuery = LoginQuery;
exports.GeneralSignUpQuery = GeneralSignUpQuery;
exports.InitializePreferencesQuery = InitializePreferencesQuery;
