const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
    defaultValue: 'Draft'
  }
});

// A course belongs to an instructor (User)
Course.belongsTo(User, { as: 'instructor', foreignKey: 'instructor_id' });
User.hasMany(Course, { foreignKey: 'instructor_id' });

module.exports = Course;
