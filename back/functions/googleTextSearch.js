const axios = require('axios');

const googleKey = process.env.NODE_ENV_GOOGLE_MAPS_API_KEY;

// ------- Get Google API restaurants -------
async function getGoogleRestaurants(radius, lat, lng) {
  const query = 'restaurant';
  const location = `${lat},${lng}`;
  const url = encodeURI(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${location}&radius=${radius}&key=${googleKey}`,
  );
  const config = {
    method: 'get',
    url: url,
    headers: {},
  };
  const results = await axios(config).then(function(response) {
    return response.data.results;
  });
  return results;
}

exports.googleTextSearch = getGoogleRestaurants;
