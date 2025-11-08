const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const alumniSchema = new mongoose.Schema(
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
    
    // Professional Information (Step 2)
    currentCompany: {
      type: String,
      required: [true, 'Current company is required'],
    },
    currentPosition: {
      type: String,
      required: [true, 'Current position is required'],
    },
    yearsOfExperience: {
      type: String,
      required: [true, 'Years of experience is required'],
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
    },
    university: {
      type: String,
      required: [true, 'University is required'],
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
    },
    graduationYear: {
      type: String,
      required: [true, 'Graduation year is required'],
    },
    
    // Mentorship Preferences (Step 3)
    mentorshipAreas: [{
      type: String,
    }],
    availability: {
      type: String,
      required: [true, 'Availability is required'],
    },
    maxMentees: {
      type: String,
      required: [true, 'Max mentees is required'],
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      minlength: 100,
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
      default: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
    },
    
    // Mentorship
    mentees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],
    pendingRequests: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
      requestedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    completedSessions: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
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
      default: 'alumni',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isMentorActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving
alumniSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
alumniSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Virtual for full name
alumniSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for current mentees count
alumniSchema.virtual('currentMenteesCount').get(function() {
  return this.mentees ? this.mentees.length : 0;
});

const Alumni = mongoose.model('Alumni', alumniSchema);
module.exports = Alumni;
