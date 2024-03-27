const { json } = require('express');
const Tour = require('./../models/tourModel');

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
    const queryObj = { ...req.query };

    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    console.log(req.query.sort);

    //sorting
    if (req.query.sort) {
      const sortBY = req.query.sort.split(',').join(' ');
      query = query.sort(sortBY);
    } else {
      query = query.sort('-createdAt');
    }

    //fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //pagination

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 5;
    const skip = (page - 1) * limit;
    if (req.query.page) {
      const numTour = await Tour.countDocuments();
      console.log(skip, numTour);
      if (skip >= numTour) throw new Error('man');
    }
    query = query.skip(skip).limit(limit);

    // excute;
    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.lenght,
      data: { tours: tours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'somesing wrong',
    });
  }
};

exports.getTour = async (req, res) => {
  console.log(req.params.id);

  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour: tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'somesing wrong',
    });
  }
};
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
    console.log(newTour);
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
