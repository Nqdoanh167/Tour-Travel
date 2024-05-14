"use strict";

/** @format */

var mongoose = require('mongoose');
var bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  nameUserBooking: {
    type: String,
    required: [true, 'Booking must have nameUserBooking!']
  },
  phoneUserBooking: {
    type: String,
    required: [true, 'Booking must have phoneUserBooking!']
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  quantityGroup: {
    type: Number,
    required: [true, 'Booking must have a group size']
  },
  startDate: {
    type: Date,
    required: [true, 'Booking must have startDate']
  },
  note: {
    type: String
  },
  paid: {
    type: Boolean,
    "default": true
  },
  createdAt: {
    type: Date,
    "default": Date.now()
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
bookingSchema.virtual('nameTour', {
  ref: 'Tour',
  localField: 'tour',
  foreignField: '_id',
  justOne: true,
  get: function get() {
    return this.tour ? this.tour.name : null;
  }
});
var Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;

// bookingSchema.pre(/^find/, function (next) {
//    this.model.aggregate([
//       {
//          $lookup: {
//             from: 'tours',
//             localField: 'tour',
//             foreignField: '_id',
//             as: 'tour_info',
//          },
//       },
//       {
//          $unwind: '$tour_info',
//       },
//       {
//          $lookup: {
//             from: 'users',
//             localField: 'user',
//             foreignField: '_id',
//             as: 'user_info',
//          },
//       },
//       {
//          $unwind: '$user_info',
//       },
//       {
//          $project: {
//             nameUserBooking: 1,
//             phoneUserBooking: 1,
//             price: 1,
//             quantityGroup: 1,
//             startDate: 1,
//             note: 1,
//             paid: 1,
//             createdAt: 1,
//             tourName: '$tour_info.name',
//             tourId: '$tour_info._id',
//             userId: '$tour_info._id',
//          },
//       },
//    ]);
//    next();
// });