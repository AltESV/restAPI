require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

//MONGOOSE 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB)
}

//script to import dev data into database

//step1: read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//step 2: import data into db
const importData = async () => {
    try{
        await Tour.create(tours)
        console.log('data loaded!')    
    } catch(err) {
        console.log(err)
    }
    process.exit()
};

//step 3: delete all data from collection
const deleteData = async () => {
    try{
        await Tour.deleteMany()
        console.log('data deleted!')    
    } catch(err) {
        console.log(err)
    }
    process.exit()
};

//step 4: command line 
if(process.argv[2] === '--import') {
    importData()
} else if(process.argv[2] === '--delete') {
    deleteData()
};

console.log(process.argv)