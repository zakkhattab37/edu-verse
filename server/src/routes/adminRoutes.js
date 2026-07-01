const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { authenticate: auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Activity = require('../models/Activity');

// All admin routes require authentication + Admin role
router.use(auth, authorize('Admin'));

// ─── OVERVIEW ────────────────────────────────────────────────────────
// GET /api/admin/overview — Platform-wide stats
router.get('/overview', async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, totalSubmissions, pendingCourses] = await Promise.all([
      User.count(),
      Course.count(),
      Enrollment.count(),
      Submission.count(),
      Course.count({ where: { status: 'Draft' } })
    ]);

    const usersByRole = await User.findAll({
      attributes: ['role', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['role'],
      raw: true
    });

    const recentActivities = await Activity.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    res.json({
      stats: { totalUsers, totalCourses, totalEnrollments, totalSubmissions, pendingCourses },
      usersByRole,
      recentActivities
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─── USERS CRUD ──────────────────────────────────────────────────────
// GET /api/admin/users — List all users (with search/filter)
router.get('/users', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const where = {};
    if (role) where.role = role;
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({ users: rows, total: count, page: Number(page), pages: Math.ceil(count / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/admin/users/:id — Get single user with enrollments
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Enrollment, include: [{ model: Course, attributes: ['id', 'title', 'status'] }] }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/admin/users — Create user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || 'Student' });

    const { password: _, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/admin/users/:id — Update user (name, email, role, bio)
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, role, bio, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (bio !== undefined) user.bio = bio;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    const { password: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/admin/users/:id — Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ message: 'Cannot delete your own account' });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ─── COURSES CRUD ─────────────────────────────────────────────────────
// GET /api/admin/courses — List all courses
router.get('/courses', async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const courses = await Course.findAll({
      where,
      include: [
        { model: User, as: 'instructor', attributes: ['id', 'name', 'email'] },
        { model: Enrollment, attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const result = courses.map(c => ({
      ...c.toJSON(),
      enrollmentCount: c.Enrollments?.length || 0
    }));

    res.json({ courses: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/admin/courses — Create course (admin can specify any instructor)
router.post('/courses', async (req, res) => {
  try {
    const { title, description, category, targetYear, instructor_id, status } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description required' });
    const course = await Course.create({ title, description, category, targetYear, instructor_id: instructor_id || req.user.id, status: status || 'Draft' });
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/admin/courses/:id — Update course (including approve/publish)
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, description, category, targetYear, status, instructor_id } = req.body;
    if (title) course.title = title;
    if (description) course.description = description;
    if (category !== undefined) course.category = category;
    if (targetYear !== undefined) course.targetYear = targetYear;
    if (status) course.status = status;
    if (instructor_id) course.instructor_id = instructor_id;

    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/admin/courses/:id — Delete course
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
