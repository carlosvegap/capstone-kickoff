const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const visitorRouter = require('./routes/visitor');
const adventurerRouter = require('./routes/adventure');
const experienceRouter = require('./routes/experience');

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// ENDPOINTS
app.use('/visitor', visitorRouter);
app.use('/adventure', adventurerRouter);
app.use('/experience', experienceRouter);
app.get('/', (req, res) => {
  res.status(201).send({ ping: 'pong' });
});

module.exports = app;
