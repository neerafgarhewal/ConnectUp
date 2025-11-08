const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Public routes
router.post('/register', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentProfile);

// Protected routes (add authentication middleware later)
router.patch('/:id', studentController.updateStudentProfile);

module.exports = router;
