"use strict";

/** @format */
var express = require('express');
var router = express.Router();
var reviewController = require('../controllers/reviewController');
var authController = require('../controllers/authController');
router.route('/get-all-review-on-tour/:idTour').get(reviewController.getAllReviewOnTour);
router.use(authController.protect);
router.route('/get-review-on-tour/:idTour').get(reviewController.getReviewOnTour);
router.route('/').get(authController.restrictTo('admin'), reviewController.getAllReview).post(reviewController.createReview);
router.route('/:id').get(reviewController.getReview).patch(reviewController.updateReview)["delete"](reviewController.deleteReview);
module.exports = router;