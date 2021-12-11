const router = require('express').Router();
const message_controller = require('../controllers/messageController');

router.post('/', message_controller.createMessage);
router.delete('/:id', message_controller.deleteMessage);
router.get('/new', (req, res) => {
  const { password, email, ...user } = req.user;

  res.render('new-message', { user });
});

module.exports = router;
