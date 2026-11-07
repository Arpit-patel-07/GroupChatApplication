const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Simple, direct Group model
const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  invite_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'groups',
  timestamps: true
});

module.exports = Group;
