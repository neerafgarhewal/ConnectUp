const jwt = require('jsonwebtoken');
const Alumni = require('../models/Alumni');

// Sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// Create and send JWT token
const createSendToken = (alumni, statusCode, res) => {
  const token = signToken(alumni._id);
  
  // Remove password from output
  alumni.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: alumni
    }
  });
};

// Register Alumni
exports.registerAlumni = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      currentCompany,
      currentPosition,
      yearsOfExperience,
      industry,
      university,
      degree,
      graduationYear,
      mentorshipAreas,
      availability,
      maxMentees,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
    } = req.body;

    // Create new alumni
    const newAlumni = await Alumni.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      currentCompany,
      currentPosition,
      yearsOfExperience,
      industry,
      university,
      degree,
      graduationYear,
      mentorshipAreas,
      availability,
      maxMentees,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
    });

    createSendToken(newAlumni, 201, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Login Alumni
exports.loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Check if alumni exists && password is correct
    const alumni = await Alumni.findOne({ email }).select('+password');

    if (!alumni || !(await alumni.correctPassword(password, alumni.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // Update last active
    alumni.lastActive = Date.now();
    await alumni.save({ validateBeforeSave: false });

    createSendToken(alumni, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get Alumni Profile
exports.getAlumniProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id)
      .populate('mentees', 'firstName lastName university degree profilePhoto')
      .populate('pendingRequests.student', 'firstName lastName university degree profilePhoto');

    if (!alumni) {
      return res.status(404).json({
        status: 'error',
        message: 'Alumni not found',
      });
    }

    // Increment profile views
    alumni.profileViews += 1;
    await alumni.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        alumni,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get All Alumni (Mentors)
exports.getAllAlumni = async (req, res) => {
  try {
    const { search, company, industry, mentorshipAreas, experience } = req.query;
    
    let query = { isActive: true, isMentorActive: true };

    // Search by name or company
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { currentCompany: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by company
    if (company) {
      query.currentCompany = { $regex: company, $options: 'i' };
    }

    // Filter by industry
    if (industry) {
      query.industry = industry;
    }

    // Filter by mentorship areas
    if (mentorshipAreas) {
      query.mentorshipAreas = { $in: mentorshipAreas.split(',') };
    }

    // Filter by experience
    if (experience) {
      query.yearsOfExperience = experience;
    }

    const alumni = await Alumni.find(query)
      .select('-password')
      .sort('-rating -completedSessions')
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: alumni.length,
      data: {
        alumni,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update Alumni Profile
exports.updateAlumniProfile = async (req, res) => {
  try {
    const allowedFields = [
      'bio',
      'mentorshipAreas',
      'availability',
      'maxMentees',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl',
      'profilePhoto',
      'coverImage',
      'isMentorActive',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const alumni = await Alumni.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!alumni) {
      return res.status(404).json({
        status: 'error',
        message: 'Alumni not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        alumni,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Accept Mentorship Request
exports.acceptMentorshipRequest = async (req, res) => {
  try {
    const { studentId } = req.body;
    const alumniId = req.params.id;

    const alumni = await Alumni.findById(alumniId);

    if (!alumni) {
      return res.status(404).json({
        status: 'error',
        message: 'Alumni not found',
      });
    }

    // Remove from pending requests
    alumni.pendingRequests = alumni.pendingRequests.filter(
      (req) => req.student.toString() !== studentId
    );

    // Add to mentees
    if (!alumni.mentees.includes(studentId)) {
      alumni.mentees.push(studentId);
    }

    await alumni.save();

    res.status(200).json({
      status: 'success',
      message: 'Mentorship request accepted',
      data: {
        alumni,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get Current Alumni
exports.getCurrentAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.user.id)
      .populate('mentees', 'firstName lastName university degree profilePhoto')
      .populate('pendingRequests.student', 'firstName lastName university degree profilePhoto');

    res.status(200).json({
      status: 'success',
      data: {
        alumni,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
