const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.lenght,
    data: { tours: tours },
  });
};
exports.createTour = (req, res) => {
  NewId = tours[tours.length - 1].id + 1;
  newTour = Object.assign({ id: NewId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      data: 'ivalid id',
    });
  }
  res.status(200).json({
    status: 'success',

    data: { tour: tour },
  });
};
