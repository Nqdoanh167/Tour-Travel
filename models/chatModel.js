/** @format */

const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const chatSchema = new mongoose.Schema(
   {
      members: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Conversation must belong to a User!'],
         },
      ],
      createAt: {type: Date, default: Date.now(), select: false},
   },
   {
      toJSON: {
         virtuals: true,
      },
      toObject: {
         virtuals: true,
      },
   },
);
chatSchema.virtual('messages', {
   ref: 'Message',
   foreignField: 'chatId',
   localField: '_id',
});
chatSchema.pre('save', function (next) {
   if (this.members.length > 2) {
      return next(new AppError('Số lượng user không được vượt quá 2'));
   } else {
      next();
   }
});
const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
