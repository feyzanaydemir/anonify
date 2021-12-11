const Message = require('../models/Message');
const { format } = require('date-fns');

exports.createMessage = (req, res, next) => {
  new Message({
    title: req.body.title,
    content: req.body.content,
    user: req.user.username,
    date: format(new Date(), 'HH:mm, dd/MM/yyyy'),
  }).save((err) => {
    if (err) {
      return next(err);
    }
  });

  res.redirect('/');
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json('Message deleted successfully.');
  } catch (err) {
    res.status(500).json(err);
  }
};
