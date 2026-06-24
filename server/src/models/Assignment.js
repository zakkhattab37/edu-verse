const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assignment = sequelize.define('Assignment', {
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
    allowNull: true
  },
  course_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  }
});

module.exports = Assignment;
