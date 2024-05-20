// // z2TR9ItOQidXutZL
// xdYmSFPWDSjOPgWX;

const rateLimit = require('express-rate-limit');
const path = require('path');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bookingRouter = require('./routes/bookingRoutes.js');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const viewrouter = require('./routes/viewRoutes.js');
const AppError = require('./utils/appError.js');
const globakErrorHandler = require('./controllers/errorController.js');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1 / global middlewares;
//server static
app.use(express.static(path.join(__dirname, 'public')));

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

//data sanitizantion against no sql query injection
app.use(express.json(mongoSanitize()));
app.use(cookieParser());

//data sanitizantion aganist xss
app.use(express.json(xss()));

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'duration',
      'difficulty',
    ],
  })
);

app.use((req, res, next) => {
  //   console.log('test');
  next();
});

//routes
// app.get('/', (req, res) => {
//   res.status(200).render('base', {
//     x: 'forst tiker',
//     user: 'hatim',
//   });
// });
// app.get('/overview', (req, res) => {
//   res.status(200).render('base', {
//     x: 'man ',
//     user: 'hatim',
//   });
// });
// app.get('/tour', (req, res) => {
//   res.status(200).render('base', {
//     x: 'test',
//     user: 'hatim',
//   });
// });

// app.get('/api/v2/tours', getAllTours);

// app.post('/api/v2/tours', createTour);

// app.get('/api/v2/tours/:id', getTour);

app.use('/', viewrouter);
app.use('/api/v2/tours', tourRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/reviews', reviewRouter);
app.use('/api/v2/bookings', bookingRouter);

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
