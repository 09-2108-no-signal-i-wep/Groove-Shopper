const { DECIMAL, INTEGER, BOOLEAN, DATE } = require('sequelize');
const db = require('../db');

const Order = db.define('order', {
  userId: {
    type: INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  isOrder: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isCart: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  total: {
    type: DECIMAL,
    allowNull: false,
  },
  date: {
      type: DATE,
      allowNull: false,
      defaultValue: Date.now()
  }
});

module.exports = Order