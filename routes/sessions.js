const router = require('express').Router();
const sessionController = require('../controllers/sessionController');
const { checkSignIn } = require('../middlewares/sessionMiddleware');

router.post('/', checkSignIn, sessionController.signIn);
router.delete('/', sessionController.signOut);
router.get('/new', (req, res) => {
  if (req.user) {
    res.redirect('/');
  }

  res.render('sign-in', { validationErrors: false });
});

module.exports = router;
