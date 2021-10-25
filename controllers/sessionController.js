const { validationResult } = require('express-validator');
const passport = require('passport');

// Sign in
exports.signIn = async (req, res, next) => {
  const result = validationResult(req);

  // Send an error signal if validation was failed
  if (result.errors.length > 0) {
    return res.render('sign-in', {
      validationErrors: true,
    });
  }

  // Sign user in if there were no validation errors
  try {
    await passport.authenticate('local', { session: true }, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.redirect('/signin');
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        // Set user
        req.user = user;

        res.redirect('/');
      });
    })(req, res, next);
  } catch (err) {
    res.redirect('/signin');
  }
};

// Sign Out
exports.signOut = (req, res) => {
  try {
    req.logout();

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};
