const mongoose = require('mongoose');

const Message = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: String, required: true },
  date: { type: String },
});

module.exports = mongoose.model('Message', Message);
