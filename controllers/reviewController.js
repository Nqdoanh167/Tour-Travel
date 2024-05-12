/** @format */
const Review = require('../models/reviewModel');
const HandleFactory = require('../controllers/handleFactory');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAllReview = HandleFactory.getAll(Review);
exports.createReview = HandleFactory.createOne(Review);
exports.getReview = HandleFactory.getOne(Review);
exports.updateReview = HandleFactory.updateOne(Review);
exports.deleteReview = HandleFactory.deleteOne(Review);
exports.getAllReviewOnTour = catchAsync(async (req, res, next) => {
   const features = new APIFeatures(
      Review.find({tour: req.params.idTour}).populate({path: 'user', select: 'name photo'}),
      req.query,
   )
      .filter()
      .sort()
      .limitFields()
      .paginate();
   const datas = await features.query;
   const total = await Review.countDocuments();
   res.status(200).json({
      status: 'success',
      results: datas.length,
      total,
      data: datas,
   });
});
exports.getReviewOnTour = catchAsync(async (req, res, next) => {
   const data = await Review.findOne({
      user: req.user._id,
      tour: req.params.idTour,
   }).populate({path: 'user', select: 'name'});

   res.status(200).json({
      status: 'success',
      data: data,
   });
});
