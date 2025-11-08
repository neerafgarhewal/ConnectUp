const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { validationResult } = require('express-validator');
const validator = require('validator');

// Sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send JWT token
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;

  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'strict'
  };

  // Set cookie
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Input validation middleware
exports.validateSignup = [
  // Validate name
  (req, res, next) => {
    if (!req.body.name || req.body.name.trim().length < 2) {
      return next(new AppError('Name must be at least 2 characters long', 400));
    }
    next();
  },
  // Validate email
  (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
      return next(new AppError('Please provide a valid email', 400));
    }
    if (!req.body.email.endsWith('@iitrpr.ac.in')) {
      return next(new AppError('Please use your IIT Ropar email', 400));
    }
    next();
  },
  // Validate password
  (req, res, next) => {
    if (!req.body.password || req.body.password.length < 8) {
      return next(new AppError('Password must be at least 8 characters long', 400));
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError('Passwords do not match', 400));
    }
    next();
  }
];

// Signup controller
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, branch, year, interests } = req.body;

  // 1) Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new AppError('User with this email already exists', 400)
    );
  }

  // 2) Create new user (password will be hashed by pre-save middleware in User model)
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    branch: req.body.branch,
    year: req.body.year,
    interests: req.body.interests || []
  });

  // 3) Generate token and send response
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// Protect middleware to check if user is authenticated
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// Restrict access to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
