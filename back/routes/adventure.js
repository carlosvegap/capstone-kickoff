require("dotenv/config")
var express = require('express');
var router = express.Router();
var axios = require('axios');
const { Console } = require("console");

// Get restaurants
router.post('/restaurants', async(req, res) => {
  const comma = "%2C"
  const location = `${req.body.lat}${comma}${req.body.lng}`;
  const query = "restaurant";
  const radius = 1000;
  var config = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${process.env.NODE_ENV_GOOGLE_MAPS_API_KEY}`,
    headers: { }
  };
  axios(config)
  .then(function (response) {
    res.status(200);
    res.send(response.data.results);
  })
  .catch(function (error) {
    res.status(400);
    res.send(error)
  });
})

module.exports = router;