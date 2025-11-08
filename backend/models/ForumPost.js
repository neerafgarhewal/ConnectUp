const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    refPath: 'authorModel',
    required: [true, 'Post must have an author']
  },
  authorModel: {
    type: String,
    required: true,
    enum: ['Student', 'Alumni']
  },
  title: {
    type: String,
    required: [true, 'Post must have a title'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post cannot be empty'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  category: {
    type: String,
    required: [true, 'Post must have a category'],
    enum: ['Career Advice', 'Technical Help', 'Networking', 'Interview Prep', 'General Discussion', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  upvotes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  saves: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  shares: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  replies: [{
    author: {
      type: mongoose.Schema.ObjectId,
      refPath: 'replies.authorModel'
    },
    authorModel: {
      type: String,
      enum: ['Student', 'Alumni']
    },
    content: {
      type: String,
      required: true,
      maxlength: [2000, 'Reply cannot exceed 2000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  pinned: {
    type: Boolean,
    default: false
  },
  closed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
forumPostSchema.index({ author: 1, createdAt: -1 });
forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ tags: 1 });
forumPostSchema.index({ createdAt: -1 });

// Virtuals
forumPostSchema.virtual('voteCount').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

forumPostSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Populate author
forumPostSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'firstName lastName profilePhoto email university currentCompany currentPosition degree'
  });
  
  next();
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost;
