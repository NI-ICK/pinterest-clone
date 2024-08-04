const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pinSchema = new Schema({
  title: { type: String },
  image: { type: String },
  description: { type: String },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
})

const commentSchema = new Schema({
  content: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
  createdAt: { type: Date, default: Date.now },
})

const replySchema = new Schema({
  content: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
})

const Pin = mongoose.model('Pin', pinSchema)
const Comment = mongoose.model('Comment', commentSchema)
const Reply = mongoose.model('Reply', replySchema)

module.exports = { Pin, Comment, Reply }