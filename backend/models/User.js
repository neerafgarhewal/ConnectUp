const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      match: [/^[^\s@]+@iitrpr\.ac\.in$/, 'Please use an IIT Ropar email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    branch: {
      type: String,
      required: [true, 'Please provide your branch'],
      trim: true
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide your registration number'],
      unique: true,
      trim: true
    },
    yearOfStudy: {
      type: Number,
      required: [true, 'Please provide your year of study'],
      min: [1, 'Year of study must be at least 1'],
      max: [5, 'Year of study cannot be more than 5']
    },
    year: {
      type: String,
      required: [true, 'Please provide your year'],
      enum: {
        values: ['1st', '2nd', '3rd', '4th', '5th', 'Masters', 'PhD'],
        message: 'Year must be one of: 1st, 2nd, 3rd, 4th, 5th, Masters, PhD'
      }
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
      default: ''
    },
    profilePhoto: {
      type: String,
      default: 'default.jpg'
    },
    interests: [{
      type: String,
      trim: true
    }],
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user'
    },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastActive: {
      type: Date,
      default: Date.now
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isProfileComplete: {
      type: Boolean,
      default: false
    },
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active'
    },
    accountSuspendedUntil: Date,
    lastPasswordChange: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: String,
    twoFactorRecoveryCodes: [String],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      matches: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    },
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'friends'
      },
      showLastActive: { type: Boolean, default: true },
      allowMessagesFrom: {
        type: String,
        enum: ['everyone', 'friends', 'none'],
        default: 'friends'
      },
      showInterests: { type: Boolean, default: true }
    },
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      instagram: String
    },
    metadata: {
      appVersion: String,
      deviceInfo: String,
      lastIpAddress: String,
      userAgent: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to update last active time
userSchema.methods.updateLastActive = function() {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
