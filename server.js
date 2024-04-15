const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
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

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);

  process.exit(1);
});

// production
// const port = process.env.PORT || 3000;
const port = 3000;

const server = app.listen(port, () => {
  console.log('server is live');
});
console.log(process.env.NODE_ENV);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
