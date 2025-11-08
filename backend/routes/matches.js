const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authController = require('../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for matches
router
  .route('/')
  .get(matchController.getAllMatches)
  .post(matchController.createMatch);

router
  .route('/:id')
  .get(matchController.getMatch)
  .patch(matchController.updateMatch)
  .delete(matchController.deleteMatch);

// Get matches for current user
router.get('/my-matches', matchController.getMyMatches);

module.exports = router;
