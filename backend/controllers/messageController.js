const Message = require('../models/Message');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Send a message
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { receiverId, content } = req.body;
  
  // 1) Check if receiver exists and is a match
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  // 2) Check if users are matched
  if (!req.user.matches.includes(receiverId)) {
    return next(new AppError('You can only message matched users', 403));
  }
  
  // 3) Create message
  const message = await Message.create({
    sender: req.user.id,
    receiver: receiverId,
    content
  });
  
  // 4) Populate sender and receiver details
  await message.populate('sender receiver');
  
  res.status(201).json({
    status: 'success',
    data: {
      message
    }
  });
});

// Get conversation between two users
exports.getConversation = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  
  // 1) Check if users are matched
  if (!req.user.matches.includes(userId)) {
    return next(new AppError('You can only view conversations with matched users', 403));
  }
  
  // 2) Get messages between the two users
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: userId },
      { sender: userId, receiver: req.user.id }
    ]
  }).sort('createdAt');
  
  // 3) Mark messages as read
  await Message.updateMany(
    { sender: userId, receiver: req.user.id, read: false },
    { $set: { read: true } }
  );
  
  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages
    }
  });
});

// Get list of conversations
exports.getConversations = catchAsync(async (req, res, next) => {
  // 1) Get all users the current user has matched with
  const user = await User.findById(req.user.id).populate({
    path: 'matches',
    select: 'name profileImage lastActive'
  });
  
  // 2) Get last message for each conversation
  const conversations = await Promise.all(
    user.matches.map(async (match) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: req.user.id, receiver: match._id },
          { sender: match._id, receiver: req.user.id }
        ]
      }).sort('-createdAt').limit(1);
      
      // Count unread messages
      const unreadCount = await Message.countDocuments({
        sender: match._id,
        receiver: req.user.id,
        read: false
      });
      
      return {
        user: match,
        lastMessage: lastMessage || null,
        unreadCount
      };
    })
  );
  
  // Sort conversations by last message time (most recent first)
  conversations.sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return b.lastMessage.createdAt - a.lastMessage.createdAt;
  });
  
  res.status(200).json({
    status: 'success',
    results: conversations.length,
    data: {
      conversations
    }
  });
});
