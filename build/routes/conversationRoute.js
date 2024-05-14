"use strict";

/** @format */
var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
var conversationController = require('../controllers/conversationController');
router.use(authController.protect);
router.post('/', conversationController.createConversation);
router.get('/', conversationController.findAllUserOfAllConversation);
router.get('/find/:receiveId', conversationController.findConversation);
module.exports = router;