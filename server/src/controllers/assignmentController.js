const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, course_id, dueDate, totalPoints } = req.body;
    
    // Verify course ownership
    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor_id !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to add assignment to this course' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course_id,
      dueDate,
      totalPoints
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Server error creating assignment' });
  }
};

exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.findAll({
      where: { course_id: courseId }
    });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, totalPoints } = req.body;

    const assignment = await Assignment.findByPk(id, {
      include: [{ model: Course }]
    });

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.Course.instructor_id !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to update this assignment' });
    }

    assignment.title = title || assignment.title;
    assignment.description = description !== undefined ? description : assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.totalPoints = totalPoints || assignment.totalPoints;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Server error updating assignment' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findByPk(id, {
      include: [{ model: Course }]
    });

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.Course.instructor_id !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this assignment' });
    }

    await assignment.destroy();
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Server error deleting assignment' });
  }
};
