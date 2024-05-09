/** @format */
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
//auth

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use(authController.protect);

//crud user by me
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

//crud user by admin
router.use(authController.restrictTo('admin'));
router.get('/get-guide', userController.getGuide);

router
   .route('/')
   .get(userController.getAllUser)
   .post(userController.uploadUserPhoto, userController.resizeUserPhoto, userController.createUser);
router
   .route('/:id')
   .get(userController.getUser)
   .patch(userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateUser)
   .delete(userController.deleteUser);

module.exports = router;
