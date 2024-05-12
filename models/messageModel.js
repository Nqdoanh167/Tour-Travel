/** @format */

const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const messageSchema = new mongoose.Schema(
   {
      conversationId: {
         type: mongoose.Schema.ObjectId,
         ref: 'Conversation',
         required: [true, 'Message must belong to a Conversation!'],
      },
      senderId: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'Message must have senderId!'],
      },
      text: {
         type: String,
         required: [true, 'Message must have text!'],
      },
      seen: {
         type: Boolean,
         default: false,
      },
      receiveId: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
      },
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
messageSchema.pre('save', async function (next) {
   // Kiểm tra nếu conversationId đã được thiết lập và receiveId chưa được thiết lập
   if (this.conversationId && this.senderId) {
      // Lấy thông tin của conversationId
      const conversation = await this.model('Conversation').findById(this.conversationId);
      if (!conversation) {
         return next(new AppError('Conversation not found', 404));
      }
      if (!conversation.members.includes(this.senderId)) {
         return next(new AppError('You can not chat at this Conversation', 401));
      }
      // Thiết lập receiveId bằng userId khác với senderId trong cuộc trò chuyện
      this.receiveId = conversation.members.find((receiveId) => receiveId !== this.senderId);
   }

   next();
});
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
