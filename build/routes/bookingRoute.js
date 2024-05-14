"use strict";

/** @format */
var express = require('express');
var router = express.Router();
var bookingController = require('../controllers/bookingController');
var authController = require('../controllers/authController');
router.use(authController.protect);
router.get('/my-booking', bookingController.getMyBooking);
router.route('/').get(authController.restrictTo('admin'), bookingController.getAllBooking).post(bookingController.createBooking);
router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking)["delete"](bookingController.deleteBooking);
module.exports = router;