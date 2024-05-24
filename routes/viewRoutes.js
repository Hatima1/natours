const express = require('express');
const viewsController = require('../controllers/viewsController');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const { route } = require('./reviewRoutes');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
// router.get('/tour', viewsController.getTour);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

// router.get('/overview', viewsController.getOverview);
// router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/my-tours',
  bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours
);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
