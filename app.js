const express = require('express');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log('test');

  next();
});

// app.get('/api/v2/tours', getAllTours);

// app.post('/api/v2/tours', createTour);

// app.get('/api/v2/tours/:id', getTour);

app.use('/api/v2/tours', tourRouter);
app.use('/api/v2/users', userRouter);

module.exports = app;
