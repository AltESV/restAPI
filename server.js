require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');
const app = require('./app');


//MONGOOSE 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB)
}


// const testTour = new Tour({
//     name: 'The Park Camper',
//     rating: 3.7,
//     price: 297
// });

// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err.message)
// });

//SERVER 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app running on port ${port}...`);
});
