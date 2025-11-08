const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
    required: [true, 'Message must belong to a conversation']
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    refPath: 'senderModel',
    required: [true, 'Message must have a sender']
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['Student', 'Alumni']
  },
  content: {
    type: String,
    required: [true, 'Message cannot be empty']
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'voice'],
    default: 'text'
  },
  attachmentUrl: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  },
  delivered: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  replyTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Message'
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster querying
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

// Populate sender when querying
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: 'firstName lastName profilePhoto email'
  }).populate({
    path: 'replyTo',
    select: 'content sender createdAt'
  });
  
  next();
});

const MessageEnhanced = mongoose.model('MessageEnhanced', messageSchema);

module.exports = MessageEnhanced;
