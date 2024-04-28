const mongoose = require('mongoose');
const slugify = require('slugify');
const Tour = require('./../models/tourModel');
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'revirw cant be empty'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  tour: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong tou tour'],
    },
  ],
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to user'],
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },
  ],
});
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'user', select: 'name photo' }).populate({
  //   path: 'tour',
  //   select: 'name',
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // console.log(stats);
  console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findbyidanddelete
// findbyidandUpdate
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // this.r is now update tricke

  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
