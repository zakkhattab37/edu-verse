const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate, authorize } = require('../middleware/auth');

// Student routes
router.post('/:assignmentId', authenticate, authorize('Student'), submissionController.submitAssignment);

// Instructor routes
router.get('/assignment/:assignmentId', authenticate, authorize('Instructor', 'Admin'), submissionController.getAssignmentSubmissions);
router.put('/:id/grade', authenticate, authorize('Instructor', 'Admin'), submissionController.gradeSubmission);

module.exports = router;
