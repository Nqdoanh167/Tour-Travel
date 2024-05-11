/** @format */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
   {
      chatId: {
         type: mongoose.Schema.ObjectId,
         ref: 'Chat',
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
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
