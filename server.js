const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: 'true',
    useCreateIndex: 'true',
    useFindAndModify: 'fasle',
  })
  .then((con) => {
    console.log('data connect successful ');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a tour must have name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  price: {
    type: Number,
    required: [(true, 'a tour must have price')],
  },
});
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'the park',
  price: 12,
});
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('errorr', err);
  });

const port = 3000;

app.listen(port, () => {
  console.log('server is live');
});
