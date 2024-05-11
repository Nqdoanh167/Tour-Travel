/** @format */
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.createMessage = catchAsync(async (req, res, next) => {
   const {chatId, text} = req.body;
   const chat = await Chat.findById(chatId);
   if (!chat) return next(new AppError('Conversation is not found'), 404);
   const message = await Message.create({chatId, senderId: req.user._id, text});
   res.status(201).json({
      status: 'success',
      data: {
         message,
      },
   });
});
exports.getMessages = catchAsync(async (req, res, next) => {
   const {chatId} = req.params;
   const messages = await Message.find({chatId});
   res.status(200).json({
      status: 'success',
      data: {
         messages,
      },
   });
});
exports.updateStatusMassgeOnChat = catchAsync(async (req, res, next) => {
   const {receiveId, chatId} = req.body;
   const messages = await Message.updateMany(
      {
         chatId: chatId,
         senderId: {
            $ne: receiveId,
         },
      },
      {seen: true},
      {
         new: true,
         runValidators: true,
      },
   );
   res.status(200).json({
      status: 'update success',
      data: messages,
   });
});
