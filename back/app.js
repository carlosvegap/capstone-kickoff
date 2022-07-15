// const app = require('./app');

const express = require('express');

const app = express();
const morgan = require('morgan');
const cors = require('cors');
const visitorRouter = require('./routes/visitor');

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));




// ENDPOINTS

app.use('/visitor', visitorRouter)
app.get('/', (req, res) => {
  res.status(201).send({ ping: 'pong' })
})

module.exports = app;