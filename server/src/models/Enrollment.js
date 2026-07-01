const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Course = require('./Course');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category: {
    type: DataTypes.STRING, // e.g. 'Top Performer', 'At Risk', 'Leader', 'Regular'
    allowNull: true,
    defaultValue: null
  },
  courseRole: {
    type: DataTypes.STRING, // e.g. 'Study Group Leader', 'Mentor', 'Regular'
    allowNull: true,
    defaultValue: null
  }
});

Enrollment.belongsTo(User, { as: 'student', foreignKey: 'student_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(Enrollment, { foreignKey: 'student_id' });
Course.hasMany(Enrollment, { foreignKey: 'course_id' });

module.exports = Enrollment;
