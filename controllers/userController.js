const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUser = async (req, res) => {
  const user = await User.find();
  res.status(200).json({
    status: 'success',
    result: user.length,
    data: {
      user,
    },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not fore update password please try /updatePassword'
      )
    );
  }
  const filterBody = filterObj(req.body, 'name', 'email');
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      updateUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.createUser = (req, res) => {
  res.status(505).json({
    status: 'error',
    data: 'this route not ready yet',
  });
};
exports.getUser = (req, res) => {
  res.status(505).json({
    status: 'error',
    data: 'this route not ready yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(505).json({
    status: 'error',
    data: 'this route not ready yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(505).json({
    status: 'error',
    data: 'this route not ready yet',
  });
};
