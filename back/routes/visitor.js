require('dotenv/config')
var express = require('express');
const Parse = require('parse/node');
var router = express.Router();

Parse.initialize(process.env.NODE_ENV_ID_PROJECT, process.env.NODE_ENV_PROJECT_KEY);
Parse.serverURL = 'http://parseapi.back4app.com';

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
    const user = new Parse.User(req.body);
    try {
      await user.signUp();
      res.status(201);
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
    res.status(200)
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
