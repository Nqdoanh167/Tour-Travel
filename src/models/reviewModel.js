/** @format */

const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
reviewSchema.methods.calcAverageRatings = async function (tourId) {
   const stats = await this.constructor.aggregate([
      {
         $match: {
            tour: tourId,
         },
      },
      {
         $group: {
            _id: '$tour',
            nRating: {$sum: 1},
            avgRating: {$avg: '$rating'},
         },
      },
   ]);
   if (stats.length > 0) {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: stats[0].nRating,
         ratingsAverage: stats[0].avgRating,
      });
   } else {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: 0,
         ratingsAverage: 4.5,
      });
   }
};
reviewSchema.post('save', function () {
   this.calcAverageRatings(this.tour);
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
