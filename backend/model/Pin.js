const mongoose = require('mongoose')

module.exports = mongoose.model('Pin', new mongoose.Schema({
  title: { type: String },
  image: { type: String },
  description: { type: String },
  user: { type: String },
  createdAt: { type: Date, default: Date.now() }
}))