const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (modle) => {
  return catchAsync(async (req, res, next) => {
    const doc = await modle.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('no tour found', 404));
    }

    res.status(204).json({
      status: 'success delete',
      value: null,
    });
  });
};
exports.updateOne = (modle) => {
  return catchAsync(async (req, res, next) => {
    // console.log(req.params.id);

    const doc = await modle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('no tour found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });
};
exports.createOne = (modle) => {
  return catchAsync(async (req, res, next) => {
    const doc = await modle.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
};
exports.getOne = (modle, popOption) => {
  return catchAsync(async (req, res, next) => {
    let query = modle.findById(req.params.id);

    if (popOption) query = query.populate(popOption);

    const doc = await query;
    if (!doc) {
      return next(new AppError('no doc found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });
};
exports.getAll = (modle) => {
  return catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(modle.find(filter), req.query)
      .filter()
      .sorting()
      .limitFields()
      .pagination();

    // excute;

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { data: doc },
    });
  });
};
