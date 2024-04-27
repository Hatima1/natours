const { json } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsyncs = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'no name or price ',
    });
  }
  next();
};
// );

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price';
  req.query.fields = '';
  next();
};

exports.getTourStats = catchAsyncs(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 1 } },
    },
    {
      $group: {
        _id: '$difficulty',
        all: { $sum: 1 },
        allprice: { $sum: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
        max: { $max: '$price' },
      },
    },
  ]);
  res.status(201).json({
    status: 'success',
    data: {
      tour: stats,
    },
  });
});

exports.getMonthlyplan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          all: { $sum: 1 },
          tour: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $sort: { all: -1 },
      },
      {
        $project: { _id: 0 },
      },
    ]);
    res.status(201).json({
      status: 'success',
      data: {
        tour: plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.getAllTours = factory.getAll(Tour);

exports.deleteTour = factory.deleteOne(Tour);
exports.createTour = factory.createOne(Tour);

// const queryObj = { ...req.query };

// const excludedFields = ['limit', 'sort', 'page', 'fields'];
// excludedFields.forEach((el) => delete queryObj[el]);

// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

// console.log(JSON.parse(queryStr));

// let query = Tour.find(JSON.parse(queryStr));
// console.log(req.query.sort);

// //sorting
// if (req.query.sort) {
//   const sortBY = req.query.sort.split(',').join(' ');
//   query = query.sort(sortBY);
// } else {
//   query = query.sort('-createdAt');
// }

// //fields
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields);
// } else {
//   query = query.select('-__v');
// }

// //pagination

// const page = +req.query.page || 1;
// const limit = +req.query.limit || 5;
// const skip = (page - 1) * limit;
// if (req.query.page) {
//   const numTour = await Tour.countDocuments();
//   console.log(skip, numTour);
//   if (skip >= numTour) throw new Error('man');
// }
// query = query.skip(skip).limit(limit);
