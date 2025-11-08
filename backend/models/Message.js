const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a sender']
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a receiver']
  },
  content: {
    type: String,
    required: [true, 'Message cannot be empty']
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster querying
messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

// Populate sender and receiver when querying
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: 'name profileImage'
  }).populate({
    path: 'receiver',
    select: 'name profileImage'
  });
  
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
