const Match = require('../models/Match');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new match
exports.createMatch = catchAsync(async (req, res, next) => {
  const newMatch = await Match.create({
    user1: req.user.id,
    user2: req.body.user2Id,
    status: 'pending'
  });

  res.status(201).json({
    status: 'success',
    data: {
      match: newMatch
    }
  });
});

// Get all matches
exports.getAllMatches = catchAsync(async (req, res, next) => {
  const matches = await Match.find()
    .populate('user1', 'name email profilePhoto')
    .populate('user2', 'name email profilePhoto');

  res.status(200).json({
    status: 'success',
    results: matches.length,
    data: {
      matches
    }
  });
});

// Get a specific match
exports.getMatch = catchAsync(async (req, res, next) => {
  const match = await Match.findById(req.params.id)
    .populate('user1', 'name email profilePhoto')
    .populate('user2', 'name email profilePhoto');

  if (!match) {
    return next(new AppError('No match found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      match
    }
  });
});

// Update a match
exports.updateMatch = catchAsync(async (req, res, next) => {
  const match = await Match.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!match) {
    return next(new AppError('No match found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      match
    }
  });
});

// Delete a match
exports.deleteMatch = catchAsync(async (req, res, next) => {
  const match = await Match.findByIdAndDelete(req.params.id);

  if (!match) {
    return next(new AppError('No match found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get matches for current user
exports.getMyMatches = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const matches = await Match.find({
    $or: [{ user1: userId }, { user2: userId }],
    status: 'matched'
  })
    .populate('user1', 'name profilePhoto')
    .populate('user2', 'name profilePhoto');

  res.status(200).json({
    status: 'success',
    results: matches.length,
    data: {
      matches
    }
  });
});
