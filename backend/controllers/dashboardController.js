const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get dashboard statistics for the logged-in user
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userType = req.user.role || req.user.userType;

  let user;
  let stats = {
    connections: 0,
    totalProfiles: 0,
    skills: 0,
    interests: 0,
    profileViews: 0,
    messages: 0,
  };

  // Get user data based on type
  if (userType === 'student') {
    user = await Student.findById(userId);
    stats.skills = user?.skills?.length || 0;
    stats.interests = user?.careerInterests?.length || 0;
  } else if (userType === 'alumni') {
    user = await Alumni.findById(userId);
    stats.skills = user?.skills?.length || 0;
    stats.interests = user?.mentorshipAreas?.length || 0;
  }

  // Get connections count (you'll need to implement connections model)
  stats.connections = user?.connections?.length || 0;

  // Get total profiles count (excluding current user)
  const [studentsCount, alumniCount] = await Promise.all([
    Student.countDocuments({ _id: { $ne: userId } }),
    Alumni.countDocuments({ _id: { $ne: userId } }),
  ]);
  stats.totalProfiles = studentsCount + alumniCount;

  // Profile views (if you have a views tracking system)
  stats.profileViews = user?.profileViews || 0;

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// Get recent activity for dashboard
exports.getRecentActivity = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // This is a placeholder - implement based on your activity tracking
  const activities = [
    {
      id: 1,
      type: 'connection',
      message: 'New connection request',
      timestamp: new Date(),
      read: false,
    },
  ];

  res.status(200).json({
    status: 'success',
    data: {
      activities,
    },
  });
});

// Get recommended profiles based on user interests
exports.getRecommendedProfiles = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userType = req.user.role || req.user.userType;
  const limit = parseInt(req.query.limit) || 6;

  let user;
  let userInterests = [];

  // Get current user's interests
  if (userType === 'student') {
    user = await Student.findById(userId);
    userInterests = user?.careerInterests || [];
  } else {
    user = await Alumni.findById(userId);
    userInterests = user?.mentorshipAreas || [];
  }

  // Find profiles with matching interests
  let recommendedProfiles = [];

  if (userType === 'student') {
    // Students get alumni recommendations
    recommendedProfiles = await Alumni.find({
      _id: { $ne: userId },
      $or: [
        { mentorshipAreas: { $in: userInterests } },
        { skills: { $in: user?.skills || [] } },
      ],
    })
      .limit(limit)
      .select('firstName lastName email profilePhoto currentPosition currentCompany mentorshipAreas skills');
  } else {
    // Alumni get student recommendations
    recommendedProfiles = await Student.find({
      _id: { $ne: userId },
      $or: [
        { careerInterests: { $in: userInterests } },
        { skills: { $in: user?.skills || [] } },
      ],
    })
      .limit(limit)
      .select('firstName lastName email profilePhoto degree branch university careerInterests skills');
  }

  res.status(200).json({
    status: 'success',
    results: recommendedProfiles.length,
    data: {
      profiles: recommendedProfiles,
    },
  });
});

module.exports = exports;
