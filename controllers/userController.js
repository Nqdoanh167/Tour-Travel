/** @format */

const User = require('../models/userModel');
const HandleFactory = require('../controllers/handleFactory');
const upload = require('../utils/upload');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
   if (!req.file) return next();

   req.body.photo = `user-${req.user._id}-${Date.now()}.jpeg`;
   await sharp(req.file.buffer)
      .resize(84, 84)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`public/img/users/${req.body.photo}`);

   next();
});
exports.getAllUser = HandleFactory.getAll(User);
exports.getUser = HandleFactory.getOne(User);
exports.createUser = HandleFactory.createOne(User, {
   password: '123456789',
   passwordConfirm: '123456789',
});
exports.updateUser = HandleFactory.updateOne(User);
exports.deleteUser = HandleFactory.deleteOne(User);

//me
exports.getMe = catchAsync(async (req, res, next) => {
   req.params.id = req.user.id;
   next();
});
const filterObj = (obj, ...allowedFields) => {
   const newObj = {};
   Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
   });
   return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
   // 1) Create error if user POSTs password data
   if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
   }

   // 2) Filtered out unwanted fields names that are not allowed to be updated
   const filteredBody = filterObj(req.body, 'name', 'phone', 'photo');

   // 3) Update user document
   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
   });

   res.status(200).json({
      status: 'success',
      data: {
         user: updatedUser,
      },
   });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
   await User.findByIdAndUpdate(req.user.id, {deleted: false});

   res.status(204).json({
      status: 'success',
      data: null,
   });
});
exports.getGuide = catchAsync(async (req, res, next) => {
   const allGuide = await User.aggregate([
      {$match: {role: {$in: ['guide', 'lead-guide']}}},
      {$project: {_id: 1, name: 1, role: 1}},
   ]);
   res.status(200).json({
      status: 'success',
      results: allGuide.length,
      data: allGuide,
   });
});
