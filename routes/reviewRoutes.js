const express = require('express');

const reviwController = require('./../controllers/reviwController');
// const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(reviwController.getAllReview)
  .post(reviwController.createReview);

module.exports = router;
