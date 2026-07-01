const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const User = require('../models/User');

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user.id;

    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if submission already exists
    const existingSubmission = await Submission.findOne({
      where: { assignment_id: assignmentId, student_id: studentId }
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const submission = await Submission.create({
      assignment_id: assignmentId,
      student_id: studentId,
      status: 'submitted',
      submittedAt: new Date()
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Server error during submission' });
  }
};

exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findByPk(assignmentId, {
      include: [{ model: Course }]
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.Course.instructor_id !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to view these submissions' });
    }

    const submissions = await Submission.findAll({
      where: { assignment_id: assignmentId },
      include: [{ model: User, attributes: ['id', 'name', 'email', 'avatar'] }]
    });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error fetching submissions' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, status } = req.body;

    const submission = await Submission.findByPk(id, {
      include: [{
        model: Assignment,
        include: [{ model: Course }]
      }]
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.Assignment.Course.instructor_id !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized to grade this submission' });
    }

    submission.score = score !== undefined ? score : submission.score;
    submission.status = status || 'graded';

    await submission.save();

    res.json(submission);
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ message: 'Server error grading submission' });
  }
};
