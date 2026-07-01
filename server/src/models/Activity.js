const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING, // 'video', 'assignment', 'grade', 'message', etc.
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT, // Optional message body (e.g. instructor notes)
    allowNull: true
  },
  from_user_id: {
    type: DataTypes.UUID, // Track who sent it (for instructor->student messages)
    allowNull: true
  }
});

module.exports = Activity;
