// // z2TR9ItOQidXutZL
// xdYmSFPWDSjOPgWX;

const rateLimit = require('express-rate-limit');
const express = require('express');
const helmet = require('helmet');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const AppError = require('./utils/appError.js');
const globakErrorHandler = require('./controllers/errorController.js');

const app = express();
//set security http header
app.use(helmet());

//limit requests from api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'to mant requests from this ip please try again later',
});
app.use('/api', limiter);

//read data from body
app.use(express.json({ limit: '10kb' }));
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
