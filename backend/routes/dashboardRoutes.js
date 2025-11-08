const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes - require authentication
router.use(authController.protect);

// Dashboard routes
router.get('/stats', dashboardController.getDashboardStats);
router.get('/activity', dashboardController.getRecentActivity);
router.get('/recommended', dashboardController.getRecommendedProfiles);

module.exports = router;
