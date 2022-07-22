require("dotenv/config")
var express = require('express');
var router = express.Router();
var axios = require('axios');
const {Parse} = require('./../parse')

// ----- Get the experience the user owns -----
router.get('/experience', async(req, res) => {
  const query = new Parse.Query('Experience');
  query.equalTo("objectId", req.body.experienceId)
  let experienceInfo = await query.first();
  res.status(200);
  res.send(experienceInfo.toJSON());
})