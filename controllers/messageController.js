/** @format */
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.createMessage = catchAsync(async (req, res, next) => {
   const {conversationId, text} = req.body;
   const message = await Message.create({conversationId, senderId: req.user._id, text});
   res.status(201).json({
      status: 'success',
      data: message,
   });
});
exports.getMessages = catchAsync(async (req, res, next) => {
   const {conversationId} = req.params;
   const messages = await Message.find({conversationId});
   res.status(200).json({
      status: 'success',
      data: messages,
   });
});
exports.updateStatusMassgeOnConversation = catchAsync(async (req, res, next) => {
   const {receiveId, conversationId} = req.body;
   const messages = await Message.updateMany(
      {
         conversationId,
         receiveId,
      },
      {seen: true},
      {
         new: true,
         runValidators: true,
      },
   );
   res.status(200).json({
      status: 'update success',
   });
});
