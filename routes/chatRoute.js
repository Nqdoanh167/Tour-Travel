/** @format */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');

router.use(authController.protect);

router.post('/', chatController.createChat);
router.get('/', chatController.findAllUserChat);
router.get('/find/:receiveId', chatController.findChat);

module.exports = router;
