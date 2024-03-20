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

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /b\gte||gt||lt||lte\b/g,
      (match) => `$${match}`
    );

    console.log(JSON.parse(queryStr));

    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);

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
