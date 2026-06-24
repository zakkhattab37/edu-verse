const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/db');

// Import models
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
const Activity = require('./models/Activity');

// Model Associations
Course.hasMany(Assignment, { foreignKey: 'course_id' });
Assignment.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(Submission, { foreignKey: 'student_id' });
Submission.belongsTo(User, { foreignKey: 'student_id' });

Assignment.hasMany(Submission, { foreignKey: 'assignment_id' });
Submission.belongsTo(Assignment, { foreignKey: 'assignment_id' });

User.hasMany(Activity, { foreignKey: 'user_id' });
Activity.belongsTo(User, { foreignKey: 'user_id' });

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EDUVERSE API is running' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
