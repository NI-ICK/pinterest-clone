const mongoose = require('mongoose')

module.exports = mongoose.model('User', new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  photo: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  about: { type: String }
}))