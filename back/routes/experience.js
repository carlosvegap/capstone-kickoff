require("dotenv/config")
var express = require('express');
var router = express.Router();
var axios = require('axios');
const {Parse} = require('./../parse');
const { query } = require("express");

// ----- Get the experience the user owns -----
router.get('/experience', async(req, res) => {
  const query = new Parse.Query('Experience');
  query.equalTo("objectId", req.body.experienceId);
  let experienceInfo = await query.first();
  res.status(200);
  res.send(experienceInfo.toJSON());
})

// Submit experience information
router.post('/myExperience', async(req, res) => {
  const findOwnerQuery = new Parse.Query('Experience');
  findOwnerQuery.equalTo("username", req.body.username);
  let existingExperience = await findOwnerQuery.first();
  let Experience = new Parse.Object('Experience')
  // overwrite existing experience if it exists
  if (existingExperience != null) {
    Experience.set('objectId', existingExperience.toJSON().objectId)
  } else {
    Experience.set('username', req.body.username)
  }
  Object.keys(req.body.formValues).map((key) => {
    Experience.set(key, req.body.formValues[key])
  })
  await Experience.save()
  res.send(true).status(200);
})

module.exports = router;