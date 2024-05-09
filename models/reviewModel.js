/** @format */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
   {
      review: {
         type: String,
         required: [true, 'Review can not be empty'],
      },
      rating: {
         type: Number,
         min: [1, 'Rating must be above 1'],
         max: [5, 'Rating must be below 5'],
      },
      createAt: {type: Date, default: Date.now(), select: false},
      tour: {
         type: mongoose.Schema.ObjectId,
         ref: 'Tour',
         required: [true, 'Review must belong to tour'],
      },
      user: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'Review must belong to user'],
      },
   },
   {
      toJSON: {
         virtuals: true,
      },
      toObject: {
         virtuals: true,
      },
   },
);
reviewSchema.index({user: 1}, {unique: true});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
