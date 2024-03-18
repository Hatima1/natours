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

const port = 3000;

app.listen(port, () => {
  console.log('server is live');
});
