const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,

    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },

  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    //   validate: {
    //     validator: function (val) {
    //       // this only points to current doc on NEW document creation
    //       return val < this.price;
    //     },
    //     message: 'Discount price ({VALUE}) should be below regular price',
    //   },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    // select: false,
  },
  startDates: [Date],
  // secretTour: {
  //   type: Boolean,
  //   default: false,
  // },
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
