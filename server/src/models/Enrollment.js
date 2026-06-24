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
  }
});

Enrollment.belongsTo(User, { as: 'student', foreignKey: 'student_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

User.hasMany(Enrollment, { foreignKey: 'student_id' });
Course.hasMany(Enrollment, { foreignKey: 'course_id' });

module.exports = Enrollment;
