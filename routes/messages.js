const router = require('express').Router();
const message_controller = require('../controllers/messageController');

router.post('/', message_controller.createMessage);

router.delete('/:id', message_controller.deleteMessage);

router.get('/new', (req, res) => {
  res.render('new-message', { user: req.user });
});

module.exports = router;
