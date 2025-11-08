const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all users (except current user)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user.id } });
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// Get user profile
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update user profile
exports.updateUser = catchAsync(async (req, res, next) => {
  // 1) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = {};
  const allowedFields = ['name', 'email', 'branch', 'year', 'interests', 'bio', 'profileImage'];
  
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Delete user account
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Like a user
exports.likeUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  
  // 1) Check if user exists
  const userToLike = await User.findById(userId);
  if (!userToLike) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  // 2) Check if already liked
  if (req.user.likes.includes(userId)) {
    return next(new AppError('You have already liked this user', 400));
  }
  
  // 3) Add to likes array
  await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true }
  );
  
  // 4) Check if it's a match
  if (userToLike.likes.includes(req.user.id)) {
    // It's a match!
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { matches: userId } },
      { new: true, runValidators: true }
    );
    
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { matches: req.user.id } },
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      status: 'success',
      data: {
        isMatch: true,
        user: userToLike
      }
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      isMatch: false,
      user: userToLike
    }
  });
});

// Dislike a user
exports.dislikeUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  
  // 1) Add to dislikes array
  await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { dislikes: userId } },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    status: 'success',
    data: null
  });
});

// Get user's matches
exports.getMatches = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('matches');
  
  res.status(200).json({
    status: 'success',
    results: user.matches.length,
    data: {
      matches: user.matches
    }
  });
});
