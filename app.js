const express = require('express');

// // z2TR9ItOQidXutZL
// xdYmSFPWDSjOPgWX;
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const AppError = require('./utils/appError.js');
const globakErrorHandler = require('./controllers/errorController.js');

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
  // res.status(400).json({
  //   status: 'fail',
  //   message: `cant find ${req.originalUrl} try again`,
  // });
  // const error = new Error(`cant find ${req.originalUrl} try again`);
  // error.status = 'afaill';
  // error.statusCode = 400;
  next(new AppError(`cant find ${req.originalUrl} try again`, 400));
});

app.use(globakErrorHandler);

module.exports = app;
