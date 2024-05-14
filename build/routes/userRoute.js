"use strict";

/** @format */
var express = require('express');
var userController = require('../controllers/userController');
var authController = require('../controllers/authController');
var router = express.Router();
//auth

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.use(authController.protect);

//crud user by me
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.get('/get-admin', userController.getAdmin);
router.patch('/updateMe', userController.uploadUserPhoto, userController.uploadUser, userController.updateMe);
router["delete"]('/deleteMe', userController.deleteMe);
router.post('/get-many-user', userController.getManyUser);
//crud user by admin
router.use(authController.restrictTo('admin'));
router.get('/get-guide', userController.getGuide);
router.get('/get-all-id', userController.getAllId);
router.route('/').get(userController.getAllUser).post(userController.uploadUserPhoto, userController.uploadUser, userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.uploadUserPhoto, userController.uploadUser, userController.updateUser)["delete"](userController.deleteUser);
module.exports = router;