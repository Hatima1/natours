const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/singup', authController.singup);

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
