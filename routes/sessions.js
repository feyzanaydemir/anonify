const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = require('express').Router();
const { check } = require('express-validator');
const sessionController = require('../controllers/sessionController');

// Render sign in form
router.get('/new', (req, res) => {
  if (req.user) {
    res.redirect('/');
  }

  res.render('sign-in', { validationErrors: false });
});

// Sign in action
router.post(
  '/',
  [
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

        if (res === null) {
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

        if (res === null) {
          return Promise.reject(new Error(400));
        }

        const bool = await bcrypt.compare(value, res.password);

        if (!bool) {
          return Promise.reject(new Error(400));
        }
      }),
  ],
  sessionController.signIn
);

// Sign out action
router.delete('/', sessionController.signOut);

module.exports = router;
