const express = require('express')
const router = express.Router()
const Pin = require('../model/Pin')
const multer = require('multer')
const User = require('../model/User')
const bcrypt = require('bcrypt')

const mimetypes = ['image/webp', 'image/png', 'image/jpg', 'image/jpeg', 'image/avif']
const fileFilter = (req, file, cb) => {
  if(mimetypes.includes(file.mimetype)) {
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

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/avatars')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
  }
})

const avatarUpload = multer({ 
  storage: avatarStorage, 
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
})

router.put('/editUser', avatarUpload.single('avatar'), async (req, res) => {
  try {
    const updateFields = {}

    if(req.file) updateFields.avatar = req.file.filename
    if(req.body.username.length > 0) updateFields.username = req.body.username 
    if(req.body.password.length > 0) updateFields.password = await bcrypt.hash(req.body.password, 10)
    if(req.body.email.length > 0) updateFields.email = req.body.email

    const user = await User.updateOne({ _id: req.body.user._id }, { $set: updateFields })
    res.status(200).json(user)
  } catch(error) {
    res.status(500).json({ message: error.message })  
  }
})

module.exports = router