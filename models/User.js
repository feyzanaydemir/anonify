const mongoose = require('mongoose');

const User = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  membership: { type: Boolean, default: false },
  moderator: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', User);
