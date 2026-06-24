const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Instructor only
router.post('/', authenticate, authorize('Instructor', 'Admin'), courseController.createCourse);

// Student only
router.post('/:id/enroll', authenticate, authorize('Student'), courseController.enrollInCourse);
router.get('/student/enrollments', authenticate, authorize('Student'), courseController.getStudentEnrollments);

module.exports = router;
