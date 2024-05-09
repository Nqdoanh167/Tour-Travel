/** @format */
const Booking = require('../models/bookingModel');
const HandleFactory = require('../controllers/handleFactory');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllBooking = catchAsync(async (req, res, next) => {
   const features = new APIFeatures(Booking.find().populate('tour', 'name slug'), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
   const data = await features.query;
   res.status(200).json({
      status: 'success',
      results: data.length,
      data: data,
   });
});
exports.createBooking = HandleFactory.createOne(Booking);
exports.getBooking = HandleFactory.getOne(Booking);
exports.updateBooking = HandleFactory.updateOne(Booking);
exports.deleteBooking = HandleFactory.deleteOne(Booking);
// exports.getMyBooking = HandleFactory.getAll(Booking, 'booking');
exports.getMyBooking = catchAsync(async (req, res, next) => {
   const features = new APIFeatures(Booking.find({user: req.user._id}).populate('tour', 'name slug'), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
   const data = await features.query;
   res.status(200).json({
      status: 'success',
      results: data.length,
      data: data,
   });
});
