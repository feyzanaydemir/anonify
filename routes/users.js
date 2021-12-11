const router = require('express').Router();
const user_controller = require('../controllers/userController');
const { checkSignUp } = require('../middlewares/userMiddleware');

router.get('/new', (req, res) => {
  if (req.user) {
    res.redirect('/');
  }

  res.render('sign-up', { params: {}, validationErrors: [] });
});
router.post('/', checkSignUp, user_controller.signUp);
router.get('/membership', (req, res) => {
  res.render('membership', { user: req.user });
});
router.post('/membership', user_controller.updateMembership);

module.exports = router;
