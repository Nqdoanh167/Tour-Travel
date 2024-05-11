/** @format */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');

router.use(authController.protect);

router.post('/', messageController.createMessage);
router.get('/:chatId', messageController.getMessages);
router.post('/update-status', messageController.updateStatusMassgeOnChat);

module.exports = router;
