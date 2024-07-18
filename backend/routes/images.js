const express = require('express')
const router = express.Router()
const { Pin } = require('../model/Pin')
const multer = require('multer')
const User = require('../model/User')
const bcrypt = require('bcrypt')

const fileFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Wrong file format'), false)
  }
}

// Create Pin

const pinStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/pins')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
  }
})

const pinUpload = multer({ 
  storage: pinStorage, 
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
})

router.post('/createPin', pinUpload.single('image'), async (req, res) => {
  try {
    const pin = new Pin({
      title: req.body.title,
      image: req.file.filename,
      description: req.body.description,
      user: req.body.user
    })
    await pin.save()
    res.status(201).json(pin)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
  
})

// Edit User

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/photos')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
  }
})

const photoUpload = multer({ 
  storage: photoStorage, 
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
})

router.put('/editUser', photoUpload.single('photo'), async (req, res) => {
  try {
    const updateFields = {}

    if(req.file) updateFields.photo = req.file.filename
    if(req.body.username) updateFields.username = req.body.username 
    if(req.body.password) updateFields.password = await bcrypt.hash(req.body.password, 10)
    if(req.body.email) updateFields.email = req.body.email
    if(req.body.firstName) updateFields.firstName = req.body.firstName
    if(req.body.lastName) updateFields.lastName = req.body.lastName
    if(req.body.about) updateFields.about = req.body.about

    const user = await User.updateOne({ _id: req.body.user._id }, { $set: updateFields })
    res.status(200).json(user)
  } catch(error) {
    res.status(500).json({ message: error.message })  
  }
})

module.exports = router