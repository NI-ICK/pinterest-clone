const express = require('express')
const router = express.Router()
const { Collection, User } = require('../model/User')
const mongoose = require('mongoose')

router.post('/collections/create', async (req, res) => {
  try {
    const collection = new Collection({
      name: req.body.name,
      user: req.body.user
    })
    if(req.body.pin) collection.pins.push(req.body.pin)
    const user = await User.findById(req.body.user)
    user.collections.push(collection._id)
    await collection.save()
    await user.save()
    res.status(201).json(collection)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/collections', async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.query.id }).populate('pins')
    res.status(200).json(collections)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

router.get('/collections/id/:id', async (req, res) => {
  try {
    if(!isValidObjectId(req.params.id)) return res.status(200).json(null)
    const collection = await Collection.findById(req.params.id).populate('pins')
    res.status(200).json(collection)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/collections/add', async (req, res) => {
  try {
    const collection = await Collection.findById(req.body.id)
    collection.pins.push(req.body.pinId)
    await collection.save()
    res.status(200).json(collection)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/collections/remove', async (req, res) => {
  try {
    const collection = await Collection.findById(req.body.id)
    collection.pins.pop(req.body.pinId)
    await collection.save()
    res.status(200).json(collection)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router