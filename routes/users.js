const router = require('express').Router();
const user_controller = require('../controllers/userController');
const { check } = require('express-validator');
const User = require('../models/User');

// Render sign up form
router.get('/new', (req, res) => {
  if (req.user) {
    res.redirect('/');
  }

  res.render('sign-up', { params: {}, validationErrors: [] });
});

// Sign up action
router.post(
  '/',
  [
    check('firstname')
      .not()
      .isEmpty()
      .bail()
      .trim()
      .escape()
      .isLength({ min: 2, max: 10 })
      .bail(),
    check('lastname')
      .not()
      .isEmpty()
      .bail()
      .trim()
      .escape()
      .isLength({ min: 2, max: 10 })
      .bail(),
    check('username')
      .not()
      .isEmpty()
      .bail()
      .trim()
      .escape()
      .isLength({ min: 3, max: 12 })
      .bail()
      .matches(/^[A-Za-z0-9 .,'!&]+$/)
      .custom(async (value, { req }) => {
        const res = await User.findOne({ username: value });

        if (res !== null) {
          return Promise.reject(new Error(400));
        }
      }),
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

        if (res !== null) {
          return Promise.reject(new Error(400));
        }
      }),
    check('password')
      .not()
      .isEmpty()
      .bail()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/, 'i'),
  ],
  user_controller.signUp
);

// Render membership form
router.get('/membership', (req, res) => {
  res.render('membership', { user: req.user });
});

// Membership action
router.post('/membership', user_controller.updateMembership);

module.exports = router;
