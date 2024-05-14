/** @format */
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.get('/my-booking', bookingController.getMyBooking);
router
   .route('/')
   .get(authController.restrictTo('admin'), bookingController.getAllBooking)
   .post(bookingController.createBooking);
router
   .route('/:id')
   .get(bookingController.getBooking)
   .patch(bookingController.updateBooking)
   .delete(bookingController.deleteBooking);

module.exports = router;
