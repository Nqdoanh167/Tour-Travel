/** @format */

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
   },
   email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowerCase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
   },
   phone: {
      type: String,
   },
   photo: {
      type: String,
      default: 'https://res.cloudinary.com/dq3tanxae/image/upload/v1715269247/default.jpg',
   },
   role: {
      type: String,
      enum: {
         values: ['user', 'guide', 'lead-guide', 'admin'],
         message: 'Role is either: user, guide, lead-guide, admin',
      },
      default: 'user',
   },
   password: {
      type: String,
      required: [true, 'Please provide your password'],
      minlength: [8, 'A password must have less or equal then 8 characters'],
      select: false,
   },
   passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
         // this only works CREATE and SAVE
         validator: function (el) {
            return el === this.password;
         },
         message: 'Passwords are not the same',
      },
   },
   deleted: {
      type: Boolean,
      default: false,
      select: false,
   },
});
userSchema.pre('save', async function (next) {
   this.password = await bcrypt.hash(this.password, 12);
   this.passwordConfirm = undefined;
   next();
});
userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
   return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
