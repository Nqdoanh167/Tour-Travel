"use strict";

/** @format */
var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var messageController = require('../controllers/messageController');
router.use(authController.protect);
router.post('/', messageController.createMessage);
router.get('/:conversationId', messageController.getMessages);
router.post('/update-status', messageController.updateStatusMassgeOnConversation);
module.exports = router;