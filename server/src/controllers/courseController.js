const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'instructor', attributes: ['id', 'name'] }]
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: User, as: 'instructor', attributes: ['id', 'name'] }]
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching course' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const course = await Course.create({
      title,
      description,
      category,
      instructor_id: req.user.id
    });
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const studentId = req.user.id;

    const existingEnrollment = await Enrollment.findOne({ where: { student_id: studentId, course_id: courseId } });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student_id: studentId,
      course_id: courseId
    });

    res.status(201).json({ message: 'Successfully enrolled', enrollment });
  } catch (error) {
    console.error('Error enrolling:', error);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
};

exports.getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { student_id: req.user.id },
      include: [{ model: Course }]
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching enrollments' });
  }
};
