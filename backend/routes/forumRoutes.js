const express = require('express');
const forumController = require('../controllers/forumController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Forum routes
router.get('/posts', forumController.getAllPosts);
router.post('/posts', forumController.createPost);
router.get('/stats', forumController.getForumStats);
router.get('/tags', forumController.getPopularTags);
router.get('/trending', forumController.getTrendingPosts);

router.post('/posts/:postId/vote', forumController.votePost);
router.post('/posts/:postId/save', forumController.toggleSave);
router.post('/posts/:postId/share', forumController.sharePost);
router.post('/posts/:postId/reply', forumController.addReply);

module.exports = router;
