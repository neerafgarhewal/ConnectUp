const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'Post cannot be empty'],
    maxlength: [5000, 'Post content cannot exceed 5000 characters']
  },
  imageUrl: {
    type: String
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: mongoose.Schema.ObjectId,
      refPath: 'comments.authorModel'
    },
    authorModel: {
      type: String,
      enum: ['Student', 'Alumni']
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  visibility: {
    type: String,
    enum: ['public', 'connections', 'private'],
    default: 'public'
  },
  tags: [{
    type: String
  }],
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Populate author details when querying
postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'firstName lastName profilePhoto email university currentCompany currentPosition'
  });
  
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
