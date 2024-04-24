const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllReview = catchAsync(async (req, res) => {
  const review = await Review.find();
  res.status(200).json({
    status: 'success',
    result: Review.length,
    data: {
      review,
    },
  });
});
exports.createReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newReview,
    },
  });
});
