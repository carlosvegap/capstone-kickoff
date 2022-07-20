var express = require('express');
var router = express.Router();
const Parse = require('parse/node')
var axios = require('axios');

const api = process.env.NODE_ENV_GOOGLE_MAPS_API_KEY;

// Get restaurants
router.post('/restaurants', async(req, res) => {
  const input = "restaurant"
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&key=${api}`,
    headers: { }
  };
  axios(config)
  .then(function (response) {
    res.status(200);
    res.send(response.data);
  })
  .catch(function (error) {
    res.status(400);
    res.send(error)
  });
})

Parse.initialize(process.env.NODE_ENV_ID_PROJECT, process.env.NODE_ENV_PROJECT_KEY);
Parse.serverURL = 'http://parseapi.back4app.com';

// Get user's preferences
router.post('/preferences', async(req, res) => {
  
})

module.exports = router;