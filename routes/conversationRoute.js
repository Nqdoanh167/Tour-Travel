/** @format */
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const conversationController = require('../controllers/conversationController');

router.use(authController.protect);

router.post('/', conversationController.createConversation);
router.get('/', conversationController.findAllUserOfAllConversation);
router.get('/find/:receiveId', conversationController.findConversation);

module.exports = router;
