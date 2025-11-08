const express = require('express');
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Message routes
router.post('/', messageController.sendMessage);
router.get('/conversations', messageController.getConversations);
router.get('/conversation/:userId', messageController.getConversation);

module.exports = router;
