var express = require('express');

const Parse = require('parse/node');
var router = express.Router();


Parse.initialize('syA4xlmOFpvn380vlkhyAHhG3vKzXRbMkhtqTga9', 'pw3zWl5Nu8zxYuGKOU2I6DvLiCVVVeJ3PtGsIiW4');
Parse.serverURL = 'http://parseapi.back4app.com';

// // Log In
// router.post('/', async (req, res) => {
//   try {
//     const user = await Parse.User.logIn(req.body.username, req.body.password);
//     console.log(req.body)
//     res.send({ user });
//   } catch (error) {
//     res.status(400);
//     res.send({ error });
//   }
// });

// Sign Up
router.post('/signUp', async (req, res) => {
//   let subtotalPrice = shoppingCart.reduce( function (subtotal, shoppingCartProduct) {
//     let currentProduct = products.find((product) => product.id === shoppingCartProduct.itemId);
//     return subtotal + currentProduct.price*shoppingCartProduct.quantity
// }, 0)
  const hasAllFields = Object.keys(req.body).reduce( function (hasAllFields, inputKey) {
    if (req.body[inputKey] === '') return false
    return hasAllFields
  }, true);
  if (hasAllFields) {
    const user = new Parse.User(req.body);
    console.log({user: user})
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

module.exports = router;
