const { json } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const acatch = require('./../utils/catchAsync');

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
  req.query.fields = 'name';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sorting()
      .limitFields()
      .pagination();

    // excute;

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.lenght,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = acatch(async (req, res, next) => {
  console.log(req.params.id);

  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { tour: tour },
  });
});
exports.updateTour = async (req, res) => {
  console.log(req.params.id);

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'somesing wrong',
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success delete',
      value: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'ivalid ',
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

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
