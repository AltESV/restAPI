const mongoose = require('mongoose');
const validator = require('validator')

const userSchma = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password']
    }
});

const User = mongoose.model('User', userSchma);

module.exports =  User;