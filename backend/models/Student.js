const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    // Basic Information (Step 1)
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    
    // Academic Information (Step 2)
    university: {
      type: String,
      required: [true, 'University is required'],
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'],
    },
    expectedGraduation: {
      type: String,
      required: [true, 'Expected graduation is required'],
    },
    cgpa: {
      type: String,
      required: [true, 'CGPA is required'],
    },
    
    // Interests & Goals (Step 3)
    careerInterests: [{
      type: String,
    }],
    targetCompanies: [{
      type: String,
    }],
    targetIndustries: [{
      type: String,
    }],
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      minlength: 50,
      maxlength: 500,
    },
    linkedinUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    portfolioUrl: {
      type: String,
    },
    
    // Profile
    profilePhoto: {
      type: String,
      default: 'https://randomuser.me/api/portraits/lego/1.jpg',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
    },
    
    // Connections
    mentors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alumni',
    }],
    connections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],
    
    // Activity
    profileViews: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    
    // Status
    role: {
      type: String,
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
studentSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
