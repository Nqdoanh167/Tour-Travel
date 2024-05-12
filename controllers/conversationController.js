/** @format */

const Conversation = require('../models/conversationModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/** @format */
exports.createConversation = catchAsync(async (req, res, next) => {
   const {receiveId} = req.body;
   const conversation = await Conversation.findOne({members: {$all: [receiveId, req.user._id]}}).populate({
      path: 'messages',
      select: 'senderId text seen receiveId',
   });
   if (conversation)
      res.status(200).json({
         status: 'success',
         data: conversation,
      });
   if (!conversation) {
      const newConversation = await Conversation.create({
         members: [receiveId, req.user._id],
      });
      res.status(201).json({
         status: 'success',
         data: newConversation,
      });
   }
});
exports.findAllUserOfAllConversation = catchAsync(async (req, res, next) => {
   const userId = req.user._id;
   const conversation = await Conversation.aggregate([
      {
         $match: {
            members: {
               $in: [userId],
            },
         },
      },
      {$unwind: '$members'},

      {
         $group: {
            _id: null,
            ids: {
               $addToSet: {
                  $cond: {
                     if: {$eq: ['$members', userId]},
                     then: '$$REMOVE',
                     else: '$members',
                  },
               },
            },
         },
      },
      {
         $project: {
            ids: 1,
         },
      },
   ]);
   res.status(200).json({
      status: 'success',
      data: conversation[0]?.ids,
   });
});
exports.findConversation = catchAsync(async (req, res, next) => {
   const {receiveId} = req.params;
   if (receiveId === req.user.id || !receiveId) {
      return next(new AppError('Vui lòng truyền receiveId'));
   }
   const conversation = await Conversation.findOne({members: {$all: [receiveId, req.user.id]}}).populate({
      path: 'messages',
      select: 'senderId text seen receiveId',
   });
   res.status(200).json({
      status: 'success',
      data: conversation,
   });
});
