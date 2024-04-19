const catchAsyncs = require('./../utils/catchAsync');
const { promisify } = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.singup = catchAsyncs(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    passwoedConfirm: req.body.passwoedConfirm,
    PasswordChangeAt: req.body.PasswordChangeAt,
    role: req.body.role,
  });

  //   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRES_IN,
  //   });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    user: {
      data: newUser,
    },
  });
});

exports.login = catchAsyncs(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('provider email and password'));
  }
  ///+ is forn hidden password
  const user = await User.findOne({ email }).select('+password');
  //   console.log(email, user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorect email or password'));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //get token and check if it there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('you are not login please login to get access ', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  //   console.log(currentUser);
  if (!currentUser) {
    return next(new AppError('the usere belonging no longer exist'), 401);
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed password please try again ', 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'you do not have the permission to peform this action ',
          403
        )
      );
    }
    next();
  };
};
