const Event = require('../models/Event');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get all events with filters
exports.getAllEvents = catchAsync(async (req, res, next) => {
  const { category, location, format, search, sort = 'date' } = req.query;
  
  let query = { status: 'upcoming', date: { $gte: new Date() } };

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Location filter
  if (location && location !== 'all') {
    query.location = location;
  }

  // Format filter
  if (format) {
    query.format = format;
  }

  // Search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Sorting
  let sortOption = 'date';
  if (sort === 'popular') sortOption = '-attendees';
  else if (sort === 'date') sortOption = 'date';

  const events = await Event.find(query)
    .sort(sortOption)
    .populate({
      path: 'organizer',
      select: 'firstName lastName profilePhoto email university currentCompany currentPosition'
    });

  // Format events
  const formattedEvents = events.map(event => ({
    ...event.toObject(),
    attendeeCount: event.attendees.length,
    isRegistered: event.attendees.some(id => id.toString() === req.user._id.toString()),
    organizer: {
      id: event.organizer._id,
      name: `${event.organizer.firstName} ${event.organizer.lastName}`,
      firstName: event.organizer.firstName,
      lastName: event.organizer.lastName,
      profilePhoto: event.organizer.profilePhoto,
      title: event.organizer.currentPosition || 'Student',
      company: event.organizer.currentCompany || event.organizer.university
    }
  }));

  res.status(200).json({
    status: 'success',
    results: formattedEvents.length,
    data: {
      events: formattedEvents
    }
  });
});

// Create event
exports.createEvent = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    category,
    date,
    startTime,
    endTime,
    location,
    format,
    coverImage,
    tags,
    maxAttendees,
    meetingLink
  } = req.body;

  const userId = req.user._id;
  const userType = req.user.userType || req.user.role;
  const organizerModel = userType === 'student' ? 'Student' : 'Alumni';

  const newEvent = await Event.create({
    organizer: userId,
    organizerModel,
    title,
    description,
    category,
    date,
    startTime,
    endTime,
    location,
    format,
    coverImage,
    tags: tags || [],
    maxAttendees,
    meetingLink
  });

  await newEvent.populate({
    path: 'organizer',
    select: 'firstName lastName profilePhoto email university currentCompany currentPosition'
  });

  res.status(201).json({
    status: 'success',
    data: {
      event: newEvent
    }
  });
});

// Register for event (RSVP)
exports.registerForEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Check if already registered
  const alreadyRegistered = event.attendees.some(id => id.toString() === userId.toString());

  if (alreadyRegistered) {
    // Unregister
    event.attendees = event.attendees.filter(id => id.toString() !== userId.toString());
  } else {
    // Check max attendees
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return next(new AppError('Event is full', 400));
    }
    
    // Register
    event.attendees.push(userId);
  }

  await event.save();

  res.status(200).json({
    status: 'success',
    data: {
      isRegistered: !alreadyRegistered,
      attendeeCount: event.attendees.length
    }
  });
});

// Get event by ID
exports.getEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId)
    .populate({
      path: 'organizer',
      select: 'firstName lastName profilePhoto email university currentCompany currentPosition'
    })
    .populate({
      path: 'attendees',
      select: 'firstName lastName profilePhoto'
    });

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  const formattedEvent = {
    ...event.toObject(),
    attendeeCount: event.attendees.length,
    isRegistered: event.attendees.some(a => a._id.toString() === req.user._id.toString()),
    organizer: {
      id: event.organizer._id,
      name: `${event.organizer.firstName} ${event.organizer.lastName}`,
      firstName: event.organizer.firstName,
      lastName: event.organizer.lastName,
      profilePhoto: event.organizer.profilePhoto,
      title: event.organizer.currentPosition || 'Student',
      company: event.organizer.currentCompany || event.organizer.university
    },
    attendees: event.attendees.map(a => ({
      id: a._id,
      name: `${a.firstName} ${a.lastName}`,
      profilePhoto: a.profilePhoto
    }))
  };

  res.status(200).json({
    status: 'success',
    data: {
      event: formattedEvent
    }
  });
});

// Get locations
exports.getLocations = catchAsync(async (req, res, next) => {
  const locations = await Event.distinct('location');

  res.status(200).json({
    status: 'success',
    data: {
      locations
    }
  });
});

// Get event categories with counts
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Event.aggregate([
    { $match: { status: 'upcoming', date: { $gte: new Date() } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      categories: categories.map(c => ({ name: c._id, count: c.count }))
    }
  });
});

// Update event
exports.updateEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Check if user is organizer
  if (event.organizer._id.toString() !== userId.toString()) {
    return next(new AppError('You can only update your own events', 403));
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      event: updatedEvent
    }
  });
});

// Delete event
exports.deleteEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  // Check if user is organizer
  if (event.organizer._id.toString() !== userId.toString()) {
    return next(new AppError('You can only delete your own events', 403));
  }

  await Event.findByIdAndDelete(eventId);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = exports;
