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
