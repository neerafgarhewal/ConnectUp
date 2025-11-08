const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// User routes
router.get('/', userController.getAllUsers);
router.get('/matches', userController.getMatches);
router.get('/:id', userController.getUser);
router.patch('/updateMe', userController.updateUser);
router.delete('/deleteMe', userController.deleteUser);
router.post('/like/:userId', userController.likeUser);
router.post('/dislike/:userId', userController.dislikeUser);

// Admin only routes
// router.use(authController.restrictTo('admin'));
// router.route('/').post(userController.createUser);
// router.route('/:id').delete(userController.deleteUser);

module.exports = router;
