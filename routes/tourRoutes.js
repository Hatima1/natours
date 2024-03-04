const express = require('express');

const tourController = require('./../controllers/tourController');

const router = express.Router();
router.param('id', (req, res, next, value) => {
  console.log(`tihs is ${value}`);
  next();
});
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router.route('/:id').get(tourController.getTour);

module.exports = router;
