/** @format */

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email');

const signToken = (id) =>
   jwt.sign(
      {
         id,
      },
      process.env.JWT_SECRET,
      {
         expiresIn: process.env.JWT_EXPIRES_IN,
      },
   );
const createSendToken = (user, statusCode, res) => {
   const token = signToken(user._id);
   const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      // httpOnly: true,
   };

   res.cookie('jwt', token, cookieOptions);
   user.password = undefined;
   res.status(statusCode).json({
      status: 'success',
      token,
      data: {
         user,
      },
   });
};
exports.signup = catchAsync(async (req, res, next) => {
   const {email, password, passwordConfirm} = req.body;
   const newUser = await User.create({
      email,
      password,
      passwordConfirm,
   });
   const url = 'http://localhost:3000';
   await new Email(newUser, url).sendWelcome();
   createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
   const {email, password} = req.body;
   if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
   }
   const user = await User.findOne({email: email}).select('+password');
   if (!user) {
      return next(new AppError(`No user found with that ID`, 404));
   }
   const correct = await user.comparePassword(password, user.password);
   if (!correct) {
      return next(new AppError('Incorrect  password', 401));
   }
   createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
   } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
   }

   if (!token) {
      return next(new AppError('You are not logging in! Please log in to get access', 401));
   }

   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   const freshUser = await User.findById(decoded.id);
   if (!freshUser) {
      return next(new AppError(`The user belonging to this token does no longer exist`, 401));
   }
   req.user = freshUser;
   next();
});
exports.restrictTo =
   (...roles) =>
   (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(new AppError('You do not have permission to perform this action', 403));
      }
      next();
   };
exports.updatePassword = catchAsync(async (req, res, next) => {
   // 1) Get user from collection
   const user = await User.findById(req.user.id).select('+password');

   // 2) Check if POSTed current password is correct
   if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
   }

   // 3) If so, update password
   user.password = req.body.password;
   user.passwordConfirm = req.body.passwordConfirm;
   await user.save();
   // User.findByIdAndUpdate will NOT work as intended!

   // 4) Log user in, send JWT
   createSendToken(user, 200, res);
});
exports.logout = (req, res) => {
   res.clearCookie('jwt');
   res.status(200).json({
      status: 'success',
   });
};
