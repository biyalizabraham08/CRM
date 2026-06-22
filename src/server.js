
const dotenv = require('dotenv');
const db = require('./config/db');
const app = require('./app');




dotenv.config();
db();



const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});