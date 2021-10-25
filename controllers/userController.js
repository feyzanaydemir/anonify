const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Sign Up
exports.signUp = async (req, res, next) => {
  const result = validationResult(req);

  // Send error signals if validation was failed
  if (result.errors.length > 0) {
    let list = [false, false, false, false, false];

    result.errors.map((err) => {
      if (err.param === 'firstname') {
        list[0] = true;
      } else if (err.param === 'lastname') {
        list[1] = true;
      } else if (err.param === 'username') {
        list[2] = true;
      } else if (err.param === 'email') {
        list[3] = true;
      } else if (err.param === 'password') {
        list[4] = true;
      }
    });

    return res.render('sign-up', {
      params: req.body,
      validationErrors: list,
    });
  }

  // Hash the password input
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Create a new user and save it to the database
  new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  }).save((err) => {
    if (err) {
      return next(err);
    }

    res.redirect('/signin');
  });
};

// Change user membership status
exports.updateMembership = async (req, res) => {
  if (req.body.code === process.env.MEMBERSHIP) {
    await User.findOneAndUpdate(
      { username: req.user.username },
      { membership: true }
    );

    res.redirect('/');
  } else {
    res.redirect(`/users/membership`);
  }
};
