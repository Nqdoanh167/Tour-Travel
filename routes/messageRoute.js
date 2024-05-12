/** @format */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');

router.use(authController.protect);

router.post('/', messageController.createMessage);
router.get('/:conversationId', messageController.getMessages);
router.post('/update-status', messageController.updateStatusMassgeOnConversation);

module.exports = router;
