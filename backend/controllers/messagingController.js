const Conversation = require('../models/Conversation');
const MessageEnhanced = require('../models/MessageEnhanced');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Get or create conversation between two users
exports.getOrCreateConversation = catchAsync(async (req, res, next) => {
  const { participantId } = req.body;
  const currentUserId = req.user._id;

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [currentUserId, participantId] }
  }).populate({
    path: 'participants',
    select: 'firstName lastName profilePhoto email currentPosition university'
  }).populate({
    path: 'lastMessage',
    select: 'content createdAt messageType'
  });

  // Create new conversation if doesn't exist
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [currentUserId, participantId],
      unreadCount: {
        [currentUserId]: 0,
        [participantId]: 0
      }
    });

    await conversation.populate({
      path: 'participants',
      select: 'firstName lastName profilePhoto email currentPosition university'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      conversation
    }
  });
});

// Get all conversations for current user
exports.getAllConversations = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const userType = req.user.role || req.user.userType;

  // Find all conversations where user is a participant
  const conversations = await Conversation.find({
    participants: currentUserId
  })
    .populate({
      path: 'participants',
      select: 'firstName lastName profilePhoto email currentPosition university degree branch'
    })
    .populate({
      path: 'lastMessage',
      select: 'content createdAt messageType sender read'
    })
    .sort('-lastMessageTime');

  // Format conversations with other participant info
  const formattedConversations = conversations.map(conv => {
    const otherParticipant = conv.participants.find(
      p => p._id.toString() !== currentUserId.toString()
    );

    const unreadCount = conv.unreadCount?.get(currentUserId.toString()) || 0;

    return {
      id: conv._id,
      participant: {
        id: otherParticipant._id,
        name: `${otherParticipant.firstName} ${otherParticipant.lastName}`,
        firstName: otherParticipant.firstName,
        lastName: otherParticipant.lastName,
        profilePhoto: otherParticipant.profilePhoto,
        email: otherParticipant.email,
        title: otherParticipant.currentPosition || otherParticipant.degree,
        subtitle: otherParticipant.university || otherParticipant.branch
      },
      lastMessage: conv.lastMessage ? {
        content: conv.lastMessage.content,
        createdAt: conv.lastMessage.createdAt,
        messageType: conv.lastMessage.messageType,
        isOwnMessage: conv.lastMessage.sender?.toString() === currentUserId.toString()
      } : null,
      lastMessageTime: conv.lastMessageTime,
      unreadCount,
      createdAt: conv.createdAt
    };
  });

  res.status(200).json({
    status: 'success',
    results: formattedConversations.length,
    data: {
      conversations: formattedConversations
    }
  });
});

// Get messages for a conversation with pagination
exports.getMessages = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  // Verify user is part of conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  if (!conversation.participants.includes(req.user._id)) {
    return next(new AppError('You are not part of this conversation', 403));
  }

  // Get messages with pagination
  const messages = await MessageEnhanced.find({
    conversation: conversationId,
    deleted: false
  })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'sender',
      select: 'firstName lastName profilePhoto'
    })
    .populate({
      path: 'replyTo',
      select: 'content sender'
    });

  // Reverse to show oldest first
  messages.reverse();

  // Get total count
  const total = await MessageEnhanced.countDocuments({
    conversation: conversationId,
    deleted: false
  });

  const hasMore = skip + messages.length < total;

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    }
  });
});

// Send a message
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const { content, messageType = 'text', attachmentUrl, replyTo } = req.body;
  const currentUserId = req.user._id;
  const userType = req.user.role || req.user.userType;

  // Verify conversation exists and user is participant
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  if (!conversation.participants.includes(currentUserId)) {
    return next(new AppError('You are not part of this conversation', 403));
  }

  // Determine sender model
  const senderModel = userType === 'student' ? 'Student' : 'Alumni';

  // Create message
  const message = await MessageEnhanced.create({
    conversation: conversationId,
    sender: currentUserId,
    senderModel,
    content,
    messageType,
    attachmentUrl,
    replyTo,
    delivered: true,
    deliveredAt: new Date()
  });

  // Populate sender details
  await message.populate({
    path: 'sender',
    select: 'firstName lastName profilePhoto'
  });

  // Update conversation last message
  conversation.lastMessage = message._id;
  conversation.lastMessageTime = message.createdAt;

  // Increment unread count for other participant
  const otherParticipantId = conversation.participants.find(
    p => p.toString() !== currentUserId.toString()
  );
  
  const currentUnread = conversation.unreadCount.get(otherParticipantId.toString()) || 0;
  conversation.unreadCount.set(otherParticipantId.toString(), currentUnread + 1);

  await conversation.save();

  res.status(201).json({
    status: 'success',
    data: {
      message
    }
  });
});

// Mark messages as read
exports.markMessagesAsRead = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const { messageIds } = req.body;
  const currentUserId = req.user._id;

  // Verify conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }

  if (!conversation.participants.includes(currentUserId)) {
    return next(new AppError('You are not part of this conversation', 403));
  }

  // Mark messages as read
  await MessageEnhanced.updateMany(
    {
      _id: { $in: messageIds },
      conversation: conversationId,
      sender: { $ne: currentUserId },
      read: false
    },
    {
      $set: {
        read: true,
        readAt: new Date()
      }
    }
  );

  // Reset unread count for current user
  conversation.unreadCount.set(currentUserId.toString(), 0);
  await conversation.save();

  res.status(200).json({
    status: 'success',
    message: 'Messages marked as read'
  });
});

// Edit message
exports.editMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const currentUserId = req.user._id;

  const message = await MessageEnhanced.findById(messageId);
  if (!message) {
    return next(new AppError('Message not found', 404));
  }

  if (message.sender.toString() !== currentUserId.toString()) {
    return next(new AppError('You can only edit your own messages', 403));
  }

  message.content = content;
  message.edited = true;
  message.editedAt = new Date();
  await message.save();

  res.status(200).json({
    status: 'success',
    data: {
      message
    }
  });
});

// Delete message
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;
  const currentUserId = req.user._id;

  const message = await MessageEnhanced.findById(messageId);
  if (!message) {
    return next(new AppError('Message not found', 404));
  }

  if (message.sender.toString() !== currentUserId.toString()) {
    return next(new AppError('You can only delete your own messages', 403));
  }

  message.deleted = true;
  message.content = 'This message was deleted';
  await message.save();

  res.status(200).json({
    status: 'success',
    message: 'Message deleted'
  });
});

// Search in conversation
exports.searchMessages = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const { q } = req.query;

  if (!q) {
    return next(new AppError('Please provide a search query', 400));
  }

  const messages = await MessageEnhanced.find({
    conversation: conversationId,
    content: { $regex: q, $options: 'i' },
    deleted: false
  })
    .sort('-createdAt')
    .limit(20)
    .populate({
      path: 'sender',
      select: 'firstName lastName profilePhoto'
    });

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages
    }
  });
});

module.exports = exports;
