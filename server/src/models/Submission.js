const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  assignment_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'submitted', 'graded', 'urgent'),
    defaultValue: 'pending'
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Submission;
