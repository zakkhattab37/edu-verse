const sequelize = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    
    const hash = await bcrypt.hash('password123', 10);
    
    // Create Users
    const student = await User.create({ name: 'Alice Student', email: 'alice@student.com', password: hash, role: 'Student' });
    const instructor = await User.create({ name: 'Dr. Bob', email: 'bob@instructor.com', password: hash, role: 'Instructor' });
    const admin = await User.create({ name: 'Admin User', email: 'admin@eduverse.com', password: hash, role: 'Admin' });

    // Create Courses
    await Course.create({
      title: 'Introduction to Artificial Intelligence',
      description: 'Learn the fundamentals of AI, machine learning, and neural networks in this comprehensive introductory course.',
      category: 'Computer Science',
      instructor_id: instructor.id,
      status: 'Published'
    });

    await Course.create({
      title: 'Data Structures and Algorithms',
      description: 'Master the core concepts of software engineering with hands-on algorithm design and complex data structures.',
      category: 'Software Engineering',
      instructor_id: instructor.id,
      status: 'Published'
    });

    await Course.create({
      title: 'Advanced Mathematics for Tech',
      description: 'Dive deep into linear algebra, calculus, and discrete mathematics required for modern computing.',
      category: 'Mathematics',
      instructor_id: instructor.id,
      status: 'Published'
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
