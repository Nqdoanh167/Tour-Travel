"use strict";

/** @format */

var multer = require('multer');
var _require = require('multer-storage-cloudinary'),
  CloudinaryStorage = _require.CloudinaryStorage;
var cloudinary = require('../configs/cloudinary');
var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'img',
  allowedFormats: ['jpg', 'png', 'jepg']
});
var multerFilter = function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image ! Please upload only images', 400), false);
  }
};
var upload = multer({
  storage: storage,
  fileFilter: multerFilter
});
module.exports = upload;