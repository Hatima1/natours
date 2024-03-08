const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

console.log(process.env);
const port = 3000;

app.listen(port, () => {
  console.log('server is live');
});
