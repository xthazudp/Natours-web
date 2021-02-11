const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const { model } = require('./tourModel');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your mail!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!!'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!!'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!!'],
    validate: {
      // this only works on SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not same!',
    },
  },
});

userSchema.pre('save', async function (next) {
  // only run this function if password was modified
  if (!this.isModified('password')) return next();

  //   Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //   Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
