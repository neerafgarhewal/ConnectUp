const express = require('express');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Event routes
router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);
router.get('/locations', eventController.getLocations);
router.get('/categories', eventController.getCategories);

router.get('/:eventId', eventController.getEvent);
router.patch('/:eventId', eventController.updateEvent);
router.delete('/:eventId', eventController.deleteEvent);

router.post('/:eventId/register', eventController.registerForEvent);

module.exports = router;
