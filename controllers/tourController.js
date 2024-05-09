/** @format */
const Tour = require('../models/tourModel');
const HandleFactory = require('../controllers/handleFactory');
const upload = require('../utils/upload');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.uploadTourImages = upload.fields([
   {
      name: 'imageCover',
      maxCount: 1,
   },
   {
      name: 'images',
      maxCount: 4,
   },
]);
exports.resizeTourImages = catchAsync(async (req, res, next) => {
   if (req?.files.imageCover) {
      req.body.imageCover = req.files.imageCover[0].path;
   }
   if (req?.files.images) {
      req.body.images = req?.files.images.map((image) => image.path);
   }

   next();
});
exports.getAllTour = HandleFactory.getAll(Tour);
exports.createTour = HandleFactory.createOne(Tour);
exports.updateTour = HandleFactory.updateOne(Tour);
exports.deleteTour = HandleFactory.deleteOne(Tour);
exports.getTopTours = (req, res, next) => {
   req.query.limit = '8';
   req.query.sort = '-ratingsAverage';
   next();
};
exports.getTour = HandleFactory.getOne(Tour);
