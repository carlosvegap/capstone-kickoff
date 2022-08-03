require('dotenv/config');
var express = require('express');
const {
  UserDataQuery,
  LoginQuery,
  GeneralSignUpQuery,
  InitializePreferencesQuery,
} = require('../queries/visitor');
var router = express.Router();

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// POST the user has loggedIn into Session Table
// Used in Login.jsx to check information on db and return which kind of user is logging in (adventurer or experience maker)
// If there is an error, submission will inform that to the UI
router.post('/logIn', async (req, res) => {
  if (!req.headers.username || !req.headers.password) {
    res.status(400).send({ error: { message: 'Fill all fields' } });
  } else {
    const submission = await LoginQuery(
      req.headers.username,
      req.headers.password,
    );
    if (submission.error) {
      res.status(400).send(submission);
    } else {
      // Sent as user to match UI format
      res.status(200).send({user: submission});
    }
  }
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// POST a new entry for the user table and
//    if adventurer, also post default values in UserPreference table
// Used in SignUp.jsx
router.post('/signUp', async (req, res) => {
  // Check that all input fields != undefined/null/empty
  const hasAllFields = Object.keys(req.body).every((inputKey) => {
    return req.body[inputKey];
  });
  if (hasAllFields) {
    // Create User in Parse
    const submission = await GeneralSignUpQuery(req.body);
    if (submission.error) {
      res.status(400).send(submission);
    } else {
      // Create User Preferences for the adventurer
      if (req.body.userType === 'adventurer') {
        await InitializePreferencesQuery(req.body.username);
      }
      res.status(200).send(submission);
    }
  } else {
    res
      .status(400)
      .send({ error: { message: 'Complete all fields to sign up' } });
  }
});

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
// GET all user information from DB by objectID from Headers
// Used in App.jsx to feed the userContext
router.get('/user', async (req, res) => {
  if (!req.headers.objectid) {
    res.status(400);
    res.send({ error: { message: 'No objectID provided' } });
  } else {
    const user = await UserDataQuery(req.headers.objectid);
    res.send(user).status(200);
  }
});

module.exports = router;
