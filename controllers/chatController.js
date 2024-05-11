/** @format */

const Chat = require('../models/chatModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/** @format */
exports.createChat = catchAsync(async (req, res, next) => {
   const {receiveId} = req.body;
   const chat = await Chat.findOne({members: {$all: [receiveId, req.user._id]}}).populate('messages');
   if (chat)
      res.status(200).json({
         status: 'success',
         data: {
            chat,
         },
      });
   if (!chat) {
      const newChat = await Chat.create({
         members: [receiveId, req.user._id],
      });
      res.status(201).json({
         status: 'success',
         data: {
            chat: newChat,
         },
      });
   }
});
exports.findAllUserChat = catchAsync(async (req, res, next) => {
   const userId = req.user._id;
   const chat = await Chat.aggregate([
      {
         $match: {
            members: {
               $in: [userId],
            },
         },
      },
      {$unwind: '$members'},
      {$group: {_id: null, ids: {$addToSet: '$members'}}},
      {
         $project: {
            ids: 1,
         },
      },
   ]);
   res.status(200).json({
      status: 'success',
      data: chat[0].ids,
   });
});
exports.findChat = catchAsync(async (req, res, next) => {
   const {receiveId} = req.params;
   if (receiveId === req.user.id || !receiveId) {
      return next(new AppError('Vui lòng truyền receiveId'));
   }
   const chat = await Chat.findOne({members: {$all: [receiveId, req.user.id]}}).populate('messages');
   res.status(200).json({
      status: 'success',
      data: {
         chat,
      },
   });
});
