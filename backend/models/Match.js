const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A match must have a first user']
    },
    user2: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A match must have a second user']
    },
    status: {
      type: String,
      enum: ['pending', 'matched', 'rejected', 'expired'],
      default: 'pending'
    },
    lastMessage: {
      type: String,
      trim: true
    },
    lastMessageAt: {
      type: Date
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    commonInterests: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent duplicate matches
matchSchema.index({ user1: 1, user2: 1 }, { unique: true });

// Populate user data when querying
matchSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user1',
    select: 'name profilePhoto'
  }).populate({
    path: 'user2',
    select: 'name profilePhoto'
  });
  next();
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
