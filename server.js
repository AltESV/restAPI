require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');
const app = require('./app');

//MONGOOSE 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB)
}

//SERVER 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app running on port ${port}...`);
});
