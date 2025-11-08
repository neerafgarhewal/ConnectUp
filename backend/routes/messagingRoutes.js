const express = require('express');
const messagingController = require('../controllers/messagingController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Conversation routes
router.get('/conversations', messagingController.getAllConversations);
router.post('/conversations', messagingController.getOrCreateConversation);

// Message routes
router.get('/conversations/:conversationId/messages', messagingController.getMessages);
router.post('/conversations/:conversationId/messages', messagingController.sendMessage);
router.put('/conversations/:conversationId/mark-read', messagingController.markMessagesAsRead);
router.get('/conversations/:conversationId/search', messagingController.searchMessages);

// Individual message operations
router.put('/messages/:messageId', messagingController.editMessage);
router.delete('/messages/:messageId', messagingController.deleteMessage);

module.exports = router;
