const mongoose = require('mongoose');
const slugify = require('slugify');
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

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'user', select: '-PasswordChangeAt -__v' });
//   this.populate({ path: 'tour', select: '-PasswordChangeAt -__v' });

//   next();
// });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
