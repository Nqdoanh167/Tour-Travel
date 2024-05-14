"use strict";

/** @format */
var express = require('express');
var router = express.Router();
var tourController = require('../controllers/tourController');
var authController = require('../controllers/authController');
router.get('/', tourController.getAllTour);
// Top 4 tour yeu thich nhat
router.route('/top-8').get(tourController.getTopTours, tourController.getAllTour);
//getTour by slug
router.route('/:slug').get(tourController.getTour);
router.route('/id/:id').get(tourController.getTour);
router.use(authController.protect);
router.route('/').post(authController.restrictTo('admin', 'lead-guide'), tourController.uploadTourImages, tourController.resizeTourImages, tourController.createTour);
router.route('/:id').patch(authController.restrictTo('admin', 'lead-guide'), tourController.uploadTourImages, tourController.resizeTourImages, tourController.updateTour)["delete"](authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);
module.exports = router;