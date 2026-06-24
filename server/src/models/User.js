const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Instructor', 'Student'),
    defaultValue: 'Student'
  },
  streakDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  studyHours: {
    type: DataTypes.JSON, // e.g. { mon: 2, tue: 3, ... }
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSON, // e.g. { email: true, sms: false, publicProfile: true }
    allowNull: true
  }
});

module.exports = User;
