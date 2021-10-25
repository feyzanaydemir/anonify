const Message = require('../models/Message');
const { format } = require('date-fns');

// Create a new message and save it to the database
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

  // Return to homepage
  res.redirect('/');
};

// Delete a message posted by the current user
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};
