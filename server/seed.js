const sequelize = require('./src/config/db');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');
const Assignment = require('./src/models/Assignment');
const Submission = require('./src/models/Submission');
const Activity = require('./src/models/Activity');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database reset and synced.');

    // Create User (Student)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const student = await User.create({
      name: 'John Doe',
      email: 'student@example.com',
      password: hashedPassword,
      role: 'Student',
      streakDays: 45,
      preferences: { email: true, sms: false, publicProfile: true }
    });

    // Create User (Instructor)
    const instructor = await User.create({
      name: 'Dr. Smith',
      email: 'instructor@example.com',
      password: hashedPassword,
      role: 'Instructor'
    });

    // Create User (Admin)
    await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'Admin'
    });

    // Create Courses
    const course1 = await Course.create({
      title: 'Advanced Machine Learning',
      description: 'Deep dive into neural networks.',
      category: 'Computer Science',
      status: 'Published',
      instructor_id: instructor.id
    });

    const course2 = await Course.create({
      title: 'Data Science 101',
      description: 'Introduction to data analysis.',
      category: 'Data Science',
      status: 'Published',
      instructor_id: instructor.id
    });

    // Enroll Student
    await Enrollment.create({ student_id: student.id, course_id: course1.id, progress: 85 });
    await Enrollment.create({ student_id: student.id, course_id: course2.id, progress: 30 });

    // Create Assignments
    const a1 = await Assignment.create({ title: 'Neural Networks Architecture', course_id: course1.id, dueDate: new Date(Date.now() + 86400000), totalPoints: 100 });
    const a2 = await Assignment.create({ title: 'Data Preprocessing Quiz', course_id: course2.id, dueDate: new Date(Date.now() - 86400000), totalPoints: 50 });
    const a3 = await Assignment.create({ title: 'Final Project', course_id: course1.id, dueDate: new Date(Date.now() + 86400000 * 7), totalPoints: 200 });

    // Create Submissions
    await Submission.create({ assignment_id: a1.id, student_id: student.id, status: 'pending' });
    await Submission.create({ assignment_id: a2.id, student_id: student.id, status: 'urgent' });
    await Submission.create({ assignment_id: a3.id, student_id: student.id, status: 'graded', score: 195, submittedAt: new Date() });

    // Create Activity
    await Activity.create({ user_id: student.id, title: 'Submitted Final Project', type: 'assignment' });
    await Activity.create({ user_id: student.id, title: 'Watched Lecture 5', type: 'video' });
    await Activity.create({ user_id: student.id, title: 'Grade Received: Data Science 101 Quiz', type: 'grade' });

    console.log('Seed completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedData();
