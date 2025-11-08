const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Post routes
router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);

router.post('/:postId/like', postController.toggleLike);
router.post('/:postId/comment', postController.addComment);
router.post('/:postId/share', postController.sharePost);

router.patch('/:postId', postController.editPost);
router.delete('/:postId', postController.deletePost);

module.exports = router;
