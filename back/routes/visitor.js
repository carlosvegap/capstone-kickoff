require('dotenv/config')
var express = require('express');
const {Parse} = require('./../parse')
var router = express.Router();

// Log In
router.post('/logIn', async (req, res) => {
  if (req.body.username === '' || req.body.password === '') {
    res.status(400);
    res.send( {error: {message: "Fill all fields"} });
  }
  else {
    try {
      const user = await Parse.User.logIn(req.body.username, req.body.password);
      res.send({ user });
    } catch (error) {
      res.status(400);
      res.send({ error });
    }
  }
});

// Sign Up
router.post('/signUp', async (req, res) => {
  const hasAllFields = Object.keys(req.body).reduce( function (hasAllFields, inputKey) {
    if (req.body[inputKey] === '') return false
    return hasAllFields
  }, true);
  if (hasAllFields) {
    // Create User in Parse
    const user = new Parse.User(req.body);
    // Create User Preferences (default) in Parse
    const prioritize = false;
    const username = req.body.username;
    const activePreferences = [];
    var UserPreference = new Parse.Object('UserPreference');
    UserPreference.set('prioritize', prioritize);
    UserPreference.set('username', username);
    UserPreference.set('activePreferences', activePreferences);
    try {
      // Save user information in Parse
      await user.signUp();
      // Save user preferences (default) in Parse
      await UserPreference.save();
      res.status(200);
      res.send({ user });
    } catch (error) {
      res.status(400);
      res.send({ error });
    }
  }
  else {
    res.status(400);
    res.send({ error: {message: 'Complete all fields to sign up'}})
  }
});

// User information
router.post('/user', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400)
    res.send({error : {message: 'No objectId provided'}})
  }
  else {
    try {
      const query = new Parse.Query("User");
      query.get(req.body.objectId);
      const user = await query.find();
      res.send(user[0])
    } catch(error) {
      res.status(400)
      res.send(error)
    }
  }
});

module.exports = router;
