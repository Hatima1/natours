const express = require('express');

// // z2TR9ItOQidXutZL
// xdYmSFPWDSjOPgWX;
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  //   console.log('test');

  next();
});

// app.get('/api/v2/tours', getAllTours);

// app.post('/api/v2/tours', createTour);

// app.get('/api/v2/tours/:id', getTour);

app.use('/api/v2/tours', tourRouter);
app.use('/api/v2/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(400).json({
    status: 'fail',
    message: `cant find ${req.originalUrl} try again`,
  });
});

module.exports = app;
