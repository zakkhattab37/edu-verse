const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate, authorize } = require('../middleware/auth');

// Instructor routes
router.post('/', authenticate, authorize('Instructor', 'Admin'), assignmentController.createAssignment);
router.put('/:id', authenticate, authorize('Instructor', 'Admin'), assignmentController.updateAssignment);
router.delete('/:id', authenticate, authorize('Instructor', 'Admin'), assignmentController.deleteAssignment);

// Shared routes (Student or Instructor)
// Get assignments for a specific course
router.get('/course/:courseId', authenticate, assignmentController.getCourseAssignments);

module.exports = router;
