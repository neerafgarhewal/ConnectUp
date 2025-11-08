const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.ObjectId,
    refPath: 'organizerModel',
    required: [true, 'Event must have an organizer']
  },
  organizerModel: {
    type: String,
    required: true,
    enum: ['Student', 'Alumni']
  },
  title: {
    type: String,
    required: [true, 'Event must have a title'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event must have a description'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event must have a category'],
    enum: ['Workshop', 'Webinar', 'Networking', 'Career Fair', 'Conference', 'Meetup', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Event must have a date']
  },
  startTime: {
    type: String,
    required: [true, 'Event must have a start time']
  },
  endTime: {
    type: String
  },
  location: {
    type: String,
    required: [true, 'Event must have a location']
  },
  format: {
    type: String,
    enum: ['Virtual', 'In-person', 'Hybrid'],
    default: 'Virtual'
  },
  coverImage: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  attendees: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  meetingLink: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ location: 1, date: 1 });
eventSchema.index({ tags: 1 });

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees.length;
});

// Populate organizer
eventSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'organizer',
    select: 'firstName lastName profilePhoto email university currentCompany currentPosition'
  });
  
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
