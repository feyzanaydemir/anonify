const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { check } = require('express-validator');

const checkSignIn = [
  check('email')
    .not()
    .isEmpty()
    .bail()
    .trim()
    .toLowerCase()
    .isEmail()
    .bail()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const res = await User.findOne({ email: value });

      if (!res) {
        return Promise.reject(new Error(400));
      }
    }),
  check('password')
    .custom((value, { req }) => req.body.email !== '')
    .bail()
    .not()
    .isEmpty()
    .bail()
    .custom(async (value, { req }) => {
      const res = await User.findOne({ email: req.body.email });
      if (!res) {
        return Promise.reject(new Error(400));
      }

      const bool = await bcrypt.compare(value, res.password);
      if (!bool) {
        return Promise.reject(new Error(400));
      }
    }),
];

module.exports = { checkSignIn };
