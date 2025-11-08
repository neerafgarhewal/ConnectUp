const express = require('express');
const alumniController = require('../controllers/alumniController');

const router = express.Router();

// Public routes
router.post('/register', alumniController.registerAlumni);
router.post('/login', alumniController.loginAlumni);
router.get('/', alumniController.getAllAlumni);
router.get('/:id', alumniController.getAlumniProfile);

// Protected routes (add authentication middleware later)
router.patch('/:id', alumniController.updateAlumniProfile);
router.post('/:id/accept-request', alumniController.acceptMentorshipRequest);

module.exports = router;
