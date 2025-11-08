const Post = require('../models/Post');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all posts (community feed)
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = req.query.filter || 'all'; // all, mentors, students, following

  let query = { visibility: 'public' };

  // Apply filters
  if (filter === 'mentors') {
    query.authorModel = 'Alumni';
  } else if (filter === 'students') {
    query.authorModel = 'Student';
  } else if (filter === 'following') {
    // Get user's connections
    const currentUser = req.user;
    const connections = currentUser.connections || [];
    query.author = { $in: connections };
  }

  // Get posts with pagination
  const posts = await Post.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'author',
      select: 'firstName lastName profilePhoto email university currentCompany currentPosition degree branch'
    })
    .populate({
      path: 'comments.author',
      select: 'firstName lastName profilePhoto'
    });

  // Get total count for pagination
  const total = await Post.countDocuments(query);
  const hasMore = skip + posts.length < total;

  // Format posts with interaction status
  const formattedPosts = posts.map(post => {
    const postObj = post.toObject();
    return {
      ...postObj,
      isLiked: post.likes.some(like => like.toString() === req.user._id.toString()),
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      author: {
        id: post.author._id,
        name: `${post.author.firstName} ${post.author.lastName}`,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        profilePhoto: post.author.profilePhoto,
        email: post.author.email,
        title: post.author.currentPosition || post.author.degree,
        subtitle: post.author.currentCompany || post.author.university,
        type: post.authorModel.toLowerCase()
      }
    };
  });

  res.status(200).json({
    status: 'success',
    results: formattedPosts.length,
    data: {
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        hasMore,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

// Create a new post
exports.createPost = catchAsync(async (req, res, next) => {
  const { content, imageUrl, tags, visibility } = req.body;
  const currentUserId = req.user._id;
  const userType = req.user.userType || req.user.role;

  if (!content || content.trim().length === 0) {
    return next(new AppError('Post content cannot be empty', 400));
  }

  const authorModel = userType === 'student' ? 'Student' : 'Alumni';

  const newPost = await Post.create({
    author: currentUserId,
    authorModel,
    content,
    imageUrl,
    tags,
    visibility: visibility || 'public'
  });

  // Populate author details
  await newPost.populate({
    path: 'author',
    select: 'firstName lastName profilePhoto email university currentCompany currentPosition degree branch'
  });

  const formattedPost = {
    ...newPost.toObject(),
    isLiked: false,
    likeCount: 0,
    commentCount: 0,
    author: {
      id: newPost.author._id,
      name: `${newPost.author.firstName} ${newPost.author.lastName}`,
      firstName: newPost.author.firstName,
      lastName: newPost.author.lastName,
      profilePhoto: newPost.author.profilePhoto,
      email: newPost.author.email,
      title: newPost.author.currentPosition || newPost.author.degree,
      subtitle: newPost.author.currentCompany || newPost.author.university,
      type: authorModel.toLowerCase()
    }
  };

  res.status(201).json({
    status: 'success',
    data: {
      post: formattedPost
    }
  });
});

// Like/Unlike a post
exports.toggleLike = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const likeIndex = post.likes.indexOf(userId);
  
  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push(userId);
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      isLiked: likeIndex === -1,
      likeCount: post.likes.length
    }
  });
});

// Add comment to post
exports.addComment = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType || req.user.role;

  if (!content || content.trim().length === 0) {
    return next(new AppError('Comment cannot be empty', 400));
  }

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const authorModel = userType === 'student' ? 'Student' : 'Alumni';

  post.comments.push({
    author: userId,
    authorModel,
    content
  });

  await post.save();

  // Populate the new comment's author
  await post.populate({
    path: 'comments.author',
    select: 'firstName lastName profilePhoto'
  });

  const newComment = post.comments[post.comments.length - 1];

  res.status(201).json({
    status: 'success',
    data: {
      comment: newComment,
      commentCount: post.comments.length
    }
  });
});

// Delete a post
exports.deletePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check if user is the author
  if (post.author._id.toString() !== userId.toString()) {
    return next(new AppError('You can only delete your own posts', 403));
  }

  await Post.findByIdAndDelete(postId);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Edit a post
exports.editPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { content, imageUrl } = req.body;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  // Check if user is the author
  if (post.author._id.toString() !== userId.toString()) {
    return next(new AppError('You can only edit your own posts', 403));
  }

  post.content = content;
  if (imageUrl !== undefined) post.imageUrl = imageUrl;
  post.edited = true;
  post.editedAt = Date.now();

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// Share a post (increment share count)
exports.sharePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  post.shares += 1;
  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      shares: post.shares
    }
  });
});

module.exports = exports;
