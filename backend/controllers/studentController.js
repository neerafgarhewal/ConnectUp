const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// Create and send JWT token
const createSendToken = (student, statusCode, res) => {
  const token = signToken(student._id);
  
  // Remove password from output
  student.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: student
    }
  });
};

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      university,
      degree,
      branch,
      year,
      expectedGraduation,
      cgpa,
      careerInterests,
      targetCompanies,
      targetIndustries,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
    } = req.body;

    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'error',
        message: 'Database connection not available. Please try again later.',
        code: 'DB_NOT_CONNECTED'
      });
    }

    // Create new student
    const newStudent = await Student.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      university,
      degree,
      branch,
      year,
      expectedGraduation,
      cgpa,
      careerInterests,
      targetCompanies,
      targetIndustries,
      bio,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
    });

    createSendToken(newStudent, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({
        status: 'error',
        message: 'Database service temporarily unavailable. Please try again.',
        code: 'DB_ERROR'
      });
    }
    
    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered. Please use a different email.',
        code: 'DUPLICATE_EMAIL'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join('. '),
        code: 'VALIDATION_ERROR'
      });
    }
    
    res.status(400).json({
      status: 'error',
      message: error.message || 'Registration failed. Please try again.',
      code: 'REGISTRATION_ERROR'
    });
  }
};

// Login Student
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Check if student exists && password is correct
    const student = await Student.findOne({ email }).select('+password');

    if (!student || !(await student.correctPassword(password, student.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // Update last active
    student.lastActive = Date.now();
    await student.save({ validateBeforeSave: false });

    createSendToken(student, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get Student Profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('mentors', 'firstName lastName currentCompany currentPosition profilePhoto')
      .populate('connections', 'firstName lastName university degree profilePhoto');

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    // Increment profile views
    student.profileViews += 1;
    await student.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        student,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const { search, year, university, interests } = req.query;
    
    let query = { isActive: true };

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by year
    if (year) {
      query.year = year;
    }

    // Filter by university
    if (university) {
      query.university = { $regex: university, $options: 'i' };
    }

    // Filter by interests
    if (interests) {
      query.careerInterests = { $in: interests.split(',') };
    }

    const students = await Student.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
        students,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Update Student Profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const allowedFields = [
      'bio',
      'careerInterests',
      'targetCompanies',
      'targetIndustries',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl',
      'profilePhoto',
      'coverImage',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        status: 'error',
        message: 'Student not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        student,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get Current Student
exports.getCurrentStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate('mentors', 'firstName lastName currentCompany currentPosition profilePhoto')
      .populate('connections', 'firstName lastName university degree profilePhoto');

    res.status(200).json({
      status: 'success',
      data: {
        student,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
