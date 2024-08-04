const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String, unique: true },
  photo: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  about: { type: String },
  collections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
})

const collectionSchema = new Schema({
  name: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  pins: [{ type: Schema.Types.ObjectId, ref: 'Pin' }],
})

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const defaultCollection = new Collection({ name: 'Profile', pins: [], user: this._id })
      const savedCollection = await defaultCollection.save()
      this.collections.push(savedCollection._id)
    } catch (error) {
      return next(error)
    }
  }
  next()
})

const User = mongoose.model('User', userSchema)
const Collection = mongoose.model('Collection', collectionSchema)

module.exports = { User, Collection }