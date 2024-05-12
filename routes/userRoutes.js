const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const multer = require('multer');

const upload = multer({ dest: 'public/img/users' });
const router = express.Router();

router.post('/login', authController.login);
router.post('/singup', authController.singup);
router.get('/logout', authController.logout);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/updatePassword', authController.updatePassword);
router.get('/Me', userController.getMe, userController.getUser);
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
router.patch('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

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
