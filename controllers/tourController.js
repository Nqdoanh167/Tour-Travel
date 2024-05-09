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
   if (req.files.imageCover) {
      req.body.imageCover = `tour-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
         // .resize(903, 400)
         .toFormat('jpeg')
         .jpeg({quality: 90})
         .toFile(`public/img/tours/${req.body.imageCover}`);
   }
   if (req.files.images) {
      let arr = [];
      if (req.body.images && Array.isArray(req.body.images)) {
         arr = req.body.images;
      } else if (req.body.images) {
         arr.push(req.body.images);
      }
      await Promise.all(
         req.files.images.map(async (file, i) => {
            const filename = `tour-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/tours/${filename}`);

            arr.push(filename);
            console.log('arr', arr);
         }),
      );
      req.body.images = arr;
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
