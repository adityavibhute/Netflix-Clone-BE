const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  emailid: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password!"],
  },
});

module.exports = mongoose.model('User', userSchema)