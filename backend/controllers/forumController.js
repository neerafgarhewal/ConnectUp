const ForumPost = require('../models/ForumPost');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all forum posts with filters
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { category, tag, sort = '-createdAt' } = req.query;

  let query = {};

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Tag filter
  if (tag) {
    query.tags = tag;
  }

  // Get posts
  const posts = await ForumPost.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'author',
      select: 'firstName lastName profilePhoto email university currentCompany currentPosition degree branch'
    });

  const total = await ForumPost.countDocuments(query);
  const hasMore = skip + posts.length < total;

  // Format posts
  const formattedPosts = posts.map(post => ({
    ...post.toObject(),
    voteCount: post.upvotes.length - post.downvotes.length,
    replyCount: post.replies.length,
    isUpvoted: post.upvotes.some(id => id.toString() === req.user._id.toString()),
    isDownvoted: post.downvotes.some(id => id.toString() === req.user._id.toString()),
    isSaved: post.saves.some(id => id.toString() === req.user._id.toString()),
    author: {
      id: post.author._id,
      name: `${post.author.firstName} ${post.author.lastName}`,
      firstName: post.author.firstName,
      lastName: post.author.lastName,
      profilePhoto: post.author.profilePhoto,
      title: post.author.currentPosition || post.author.degree,
      subtitle: post.author.currentCompany || post.author.university,
      type: post.authorModel.toLowerCase()
    }
  }));

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

// Create forum post
exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content, category, tags } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType || req.user.role;

  const authorModel = userType === 'student' ? 'Student' : 'Alumni';

  const newPost = await ForumPost.create({
    author: userId,
    authorModel,
    title,
    content,
    category,
    tags: tags || []
  });

  await newPost.populate({
    path: 'author',
    select: 'firstName lastName profilePhoto email university currentCompany currentPosition degree'
  });

  res.status(201).json({
    status: 'success',
    data: {
      post: newPost
    }
  });
});

// Upvote/downvote post
exports.votePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { voteType } = req.body; // 'up' or 'down'
  const userId = req.user._id;

  const post = await ForumPost.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const upvoteIndex = post.upvotes.indexOf(userId);
  const downvoteIndex = post.downvotes.indexOf(userId);

  if (voteType === 'up') {
    // Remove from downvotes if exists
    if (downvoteIndex > -1) {
      post.downvotes.splice(downvoteIndex, 1);
    }
    
    // Toggle upvote
    if (upvoteIndex > -1) {
      post.upvotes.splice(upvoteIndex, 1);
    } else {
      post.upvotes.push(userId);
    }
  } else if (voteType === 'down') {
    // Remove from upvotes if exists
    if (upvoteIndex > -1) {
      post.upvotes.splice(upvoteIndex, 1);
    }
    
    // Toggle downvote
    if (downvoteIndex > -1) {
      post.downvotes.splice(downvoteIndex, 1);
    } else {
      post.downvotes.push(userId);
    }
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      voteCount: post.upvotes.length - post.downvotes.length,
      isUpvoted: post.upvotes.includes(userId),
      isDownvoted: post.downvotes.includes(userId)
    }
  });
});

// Save/unsave post
exports.toggleSave = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await ForumPost.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const saveIndex = post.saves.indexOf(userId);
  
  if (saveIndex > -1) {
    post.saves.splice(saveIndex, 1);
  } else {
    post.saves.push(userId);
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      isSaved: saveIndex === -1
    }
  });
});

// Share post
exports.sharePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await ForumPost.findById(postId);
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

// Get forum stats
exports.getForumStats = catchAsync(async (req, res, next) => {
  const [totalPosts, totalReplies, totalUsers] = await Promise.all([
    ForumPost.countDocuments(),
    ForumPost.aggregate([
      { $project: { replyCount: { $size: '$replies' } } },
      { $group: { _id: null, total: { $sum: '$replyCount' } } }
    ]),
    ForumPost.distinct('author').then(authors => authors.length)
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalPosts,
        totalReplies: totalReplies[0]?.total || 0,
        totalUsers
      }
    }
  });
});

// Get popular tags
exports.getPopularTags = catchAsync(async (req, res, next) => {
  const tags = await ForumPost.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      tags: tags.map(t => ({ name: t._id, count: t.count }))
    }
  });
});

// Get trending posts
exports.getTrendingPosts = catchAsync(async (req, res, next) => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const posts = await ForumPost.find({
    createdAt: { $gte: threeDaysAgo }
  })
    .sort('-views -replies')
    .limit(5)
    .select('title views replies createdAt')
    .populate({
      path: 'author',
      select: 'firstName lastName'
    });

  res.status(200).json({
    status: 'success',
    data: {
      posts: posts.map(p => ({
        id: p._id,
        title: p.title,
        views: p.views,
        replies: p.replies.length,
        author: `${p.author.firstName} ${p.author.lastName}`
      }))
    }
  });
});

// Add reply to post
exports.addReply = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType || req.user.role;

  const post = await ForumPost.findById(postId);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  const authorModel = userType === 'student' ? 'Student' : 'Alumni';

  post.replies.push({
    author: userId,
    authorModel,
    content
  });

  await post.save();

  res.status(201).json({
    status: 'success',
    data: {
      replyCount: post.replies.length
    }
  });
});

module.exports = exports;
