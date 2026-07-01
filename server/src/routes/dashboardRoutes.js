const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authenticate: auth } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Activity = require('../models/Activity');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/avatars'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// @route   GET /api/dashboard/student
// @desc    Get all dashboard data for a student
// @access  Private
router.get('/student', auth, async (req, res) => {
  try {
    const student_id = req.user.id;

    // 1. Fetch User Settings & Stats
    const user = await User.findByPk(student_id, {
      attributes: ['name', 'email', 'streakDays', 'studyHours', 'bio', 'avatar', 'preferences']
    });

    // 2. Fetch Enrollments
    const enrollments = await Enrollment.findAll({
      where: { student_id },
      include: [{ model: Course, attributes: ['id', 'title', 'description'] }]
    });

    // 3. Fetch Submissions (which give us Assignments)
    const submissions = await Submission.findAll({
      where: { student_id },
      include: [{
        model: Assignment,
        include: [{ model: Course, attributes: ['title'] }]
      }]
    });

    // Format assignments into urgent, pending, completed
    const assignments = submissions.map(sub => ({
      id: sub.assignment_id,
      title: sub.Assignment.title,
      course: sub.Assignment.Course.title,
      dueDate: sub.Assignment.dueDate,
      status: sub.status,
      score: sub.score,
      totalPoints: sub.Assignment.totalPoints,
      submittedAt: sub.submittedAt
    }));

    // Format grades (completed submissions)
    const grades = assignments.filter(a => a.status === 'graded' || a.status === 'completed');

    // 4. Fetch Recent Activity
    const activities = await Activity.findAll({
      where: { user_id: student_id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      user,
      enrollments,
      assignments,
      grades,
      activities
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/instructor
// @desc    Get all dashboard data for an instructor
// @access  Private
router.get('/instructor', auth, async (req, res) => {
  try {
    const instructor_id = req.user.id;

    // 1. Fetch User Settings & Stats
    const user = await User.findByPk(instructor_id, {
      attributes: ['name', 'email', 'streakDays', 'studyHours', 'bio', 'avatar', 'preferences']
    });

    // 2. Fetch Courses taught by instructor
    const courses = await Course.findAll({
      where: { instructor_id },
      attributes: ['id', 'title', 'description', 'status', 'createdAt']
    });

    const courseIds = courses.map(c => c.id);

    // 3. Fetch Total Students (unique enrollments across all their courses)
    const enrollments = await Enrollment.findAll({
      where: { course_id: courseIds },
      attributes: ['student_id']
    });
    // Calculate unique students
    const uniqueStudents = new Set(enrollments.map(e => e.student_id)).size;

    // 4. Fetch Pending Submissions
    // Get all assignments for these courses
    const assignments = await Assignment.findAll({
      where: { course_id: courseIds },
      attributes: ['id', 'title', 'course_id'],
      include: [{ model: Course, attributes: ['title'] }]
    });
    const assignmentIds = assignments.map(a => a.id);

    // Get submissions for these assignments that need grading
    const pendingSubmissions = await Submission.findAll({
      where: { 
        assignment_id: assignmentIds,
        status: 'submitted'
      },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar'] },
        { model: Assignment, include: [{ model: Course, attributes: ['title'] }] }
      ],
      order: [['submittedAt', 'ASC']]
    });

    // Format pending tasks
    const pendingTasks = pendingSubmissions.map(sub => ({
      id: sub.id,
      studentName: sub.User.name,
      assignmentTitle: sub.Assignment.title,
      courseTitle: sub.Assignment.Course.title,
      submittedAt: sub.submittedAt
    }));

    // 5. Fetch Recent Activity
    const activities = await Activity.findAll({
      where: { user_id: instructor_id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({
      user,
      courses,
      totalStudents: uniqueStudents,
      pendingTasks,
      activities
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/instructor/students
// @desc    Get all students enrolled in instructor's courses with stats
// @access  Private (Instructor/Admin)
router.get('/instructor/students', auth, async (req, res) => {
  try {
    const instructor_id = req.user.id;

    // Get all courses by instructor
    const courses = await Course.findAll({ where: { instructor_id }, attributes: ['id', 'title'] });
    const courseIds = courses.map(c => c.id);

    if (courseIds.length === 0) return res.json({ students: [] });

    // Get enrollments with student info
    const enrollments = await Enrollment.findAll({
      where: { course_id: courseIds },
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'avatar', 'category', 'academicYear'] },
        { model: Course, attributes: ['id', 'title', 'category'] }
      ]
    });

    // Build per-student aggregated data
    const studentMap = {};
    for (const enr of enrollments) {
      const sid = enr.student.id;
      if (!studentMap[sid]) {
        studentMap[sid] = {
          id: sid,
          name: enr.student.name,
          email: enr.student.email,
          avatar: enr.student.avatar,
          category: enr.student.category,
          academicYear: enr.student.academicYear,
          enrollments: []
        };
      }
      // Submission stats per enrollment
      const assignmentsForCourse = await Assignment.findAll({ where: { course_id: enr.course_id }, attributes: ['id'] });
      const assignmentIds = assignmentsForCourse.map(a => a.id);
      const submissions = assignmentIds.length > 0
        ? await Submission.findAll({ where: { assignment_id: assignmentIds, student_id: sid } })
        : [];
      const gradedSubs = submissions.filter(s => s.status === 'graded');
      const avgScore = gradedSubs.length > 0
        ? Math.round(gradedSubs.reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubs.length)
        : null;

      studentMap[sid].enrollments.push({
        enrollmentId: enr.id,
        courseId: enr.Course.id,
        courseTitle: enr.Course.title,
        progress: enr.progress,
        category: enr.category,
        courseRole: enr.courseRole,
        totalAssignments: assignmentsForCourse.length,
        submittedCount: submissions.length,
        avgScore
      });
    }

    res.json({ students: Object.values(studentMap) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/dashboard/instructor/students/:studentId/category
// @desc    Assign a category and/or role to a student within a course
// @access  Private (Instructor/Admin)
router.put('/instructor/students/:studentId/category', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, category, courseRole } = req.body;
    const instructor_id = req.user.id;

    // Verify instructor owns this course
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor_id !== instructor_id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update enrollment
    const enrollment = await Enrollment.findOne({ where: { student_id: studentId, course_id: courseId } });
    if (!enrollment) return res.status(404).json({ message: 'Student not enrolled in this course' });

    enrollment.category = category !== undefined ? category : enrollment.category;
    enrollment.courseRole = courseRole !== undefined ? courseRole : enrollment.courseRole;
    await enrollment.save();

    res.json({ message: 'Student category updated', enrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/dashboard/instructor/message/:studentId
// @desc    Send a message/notification to a student
// @access  Private (Instructor/Admin)
router.post('/instructor/message/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { title, message } = req.body;
    const instructor_id = req.user.id;

    // Ensure at least one shared course
    const instructorCourses = await Course.findAll({ where: { instructor_id }, attributes: ['id'] });
    const courseIds = instructorCourses.map(c => c.id);
    const enrollment = await Enrollment.findOne({ where: { student_id: studentId, course_id: courseIds } });
    if (!enrollment && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'This student is not in any of your courses' });
    }

    // Create activity log for the student
    const activity = await Activity.create({
      user_id: studentId,
      title: title || 'Message from your instructor',
      type: 'message',
      message,
      from_user_id: instructor_id
    });

    res.status(201).json({ message: 'Message sent', activity });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/dashboard/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
  try {
    const { name, bio, avatar, preferences } = req.body;
    
    let user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.avatar = avatar !== undefined ? avatar : user.avatar;
    user.preferences = preferences || user.preferences;

    await user.save();
    
    res.json({
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      preferences: user.preferences
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/dashboard/upload-avatar
// @desc    Upload user avatar image
// @access  Private
router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const avatarUrl = `http://localhost:5000/uploads/avatars/${req.file.filename}`;
    
    // Automatically save to user profile
    let user = await User.findByPk(req.user.id);
    if (user) {
      user.avatar = avatarUrl;
      await user.save();
    }

    res.json({ avatarUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
