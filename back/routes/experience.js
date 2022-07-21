require("dotenv/config")
var express = require('express');
var router = express.Router();
const Parse = require('parse/node')
var axios = require('axios');

Parse.initialize(process.env.NODE_ENV_ID_PROJECT, process.env.NODE_ENV_PROJECT_KEY);
Parse.serverURL = 'http://parseapi.back4app.com';

// ----- Get the experience the user owns -----
router.get('/experience', async(req, res) => {
  const query = new Parse.Query('Experience');
  query.equalTo("objectId", req.body.experienceId)
  let experienceInfo = await query.first();
  res.status(200);
  res.send(experienceInfo.toJSON());
})