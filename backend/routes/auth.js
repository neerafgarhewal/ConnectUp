const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes (authentication required)
// router.use(authController.protect);

// router.post('/updatePassword', authController.updatePassword);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;
