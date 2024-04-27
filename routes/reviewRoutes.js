const express = require('express');

const reviwController = require('./../controllers/reviwController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviwController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviwController.createReview
  );
router
  .route('/:id')
  .get(reviwController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviwController.deleteReview
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviwController.updateReview
  );

module.exports = router;
