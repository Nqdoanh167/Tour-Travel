/** @format */
const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

// Top 4 tour yeu thich nhat
router.route('/top-8').get(tourController.getTopTours, tourController.getAllTour);
//getTour by slug
router.route('/:slug').get(tourController.getTour);
router.route('/id/:id').get(tourController.getTour);

router.use(authController.protect);
router
   .route('/')
   .get(tourController.getAllTour)
   .post(
      authController.restrictTo('admin', 'lead-guide'),
      tourController.uploadTourImages,
      tourController.resizeTourImages,
      tourController.createTour,
   );

router
   .route('/:id')
   .patch(
      authController.restrictTo('admin', 'lead-guide'),
      tourController.uploadTourImages,
      tourController.resizeTourImages,
      tourController.updateTour,
   )
   .delete(authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
