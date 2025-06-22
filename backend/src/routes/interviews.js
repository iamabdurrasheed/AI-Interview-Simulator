const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { auth, optionalAuth } = require('../middleware/auth');
const { validateInterview } = require('../middleware/validation');

// Create a new interview
router.post('/', optionalAuth, validateInterview, interviewController.createInterview);

// Get interview details
router.get('/:id', interviewController.getInterview);

// Submit an answer
router.post('/:id/answers', interviewController.submitAnswer);

// Finish interview
router.post('/:id/finish', interviewController.finishInterview);

// Get interview results
router.get('/:id/results', interviewController.getResults);

// Get user's interview history (requires auth)
router.get('/user/history', auth, interviewController.getUserInterviews);

// Get user statistics (requires auth)
router.get('/user/stats', auth, interviewController.getUserStats);

module.exports = router;
