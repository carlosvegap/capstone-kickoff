var express = require('express');
var router = express.Router();
var axios = require('axios');

const api = "AIzaSyCOE5i7_2ohB9yGCmgAjR4LrQZ3hzwCY10"

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

module.exports = router;