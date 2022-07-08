// const app = require('./app');

const express = require('express');

const app = express();
const morgan = require('morgan');
const cors = require('cors');
const visitorRouter = require('./routes/visitor');

// const port = 8080 ;

// app.listen(port, () => {
//   console.log(`🚀 Server listening on port ${port}`);
// });

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));




// ENDPOINTS

app.use('/visitor', visitorRouter)
app.get('/', (req, res) => {
  res.status(201).send({ ping: 'pong' })
  console.log(process.env.PORT)
  console.log('response received')
})

module.exports = app;