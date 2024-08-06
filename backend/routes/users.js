const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const { User, Collection } = require('../model/User')
const bcrypt = require('bcrypt')

const fileFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Wrong file format'), false)
  }
}

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
    const user = await User.findById(req.body.user)
    await user.updateOne({ $set: updateFields })
    res.status(200).json(user)
    console.log(user)
  } catch(error) {
    res.status(500).json({ message: error.message })  
  }
})

router.post('/register', async (req, res) => {
  try {
    const checkEmail = await User.findOne({ email: req.body.email })
    if(checkEmail) return res.status(401).json({ message: 'Account with that email already exists' })
    const checkUsername = await User.findOne({ username: req.body.username })
    if(checkUsername) return res.status(401).json({ message: 'Account with that username already exists' })
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email
    })
    await user.save()
    res.status(201).json(user)
  } catch(error) {
    res.status(500).json({ message: error.moessage })
  }
})

router.post('/login', (req, res, next) => {
  try {
    passport.authenticate('local', (error, user, info) => {
      if (error) throw error
      if (!user) return res.status(401).json({ message: info.message })
  
      req.logIn(user, (error) => {
        if (error) return next(error)
  
        return res.json(user)
      })
    })(req, res, next) 
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/logout', (req, res) => {
  try {
    req.logout((error) => {
      if (error) {
        console.error('Logout error:', error)
        return res.status(500).json({ message: error.message })
      }
      res.status(200).json({ message: 'Logged out successfully' })
    })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/currUser', (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json(req.user)
    }
    const { password, email, ...user } = req.user._doc
    res.status(200).json(user)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/user', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username }).select('-password -email')
    res.status(200).json(user)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password -email')
    res.status(200).json(users)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/delete/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const collectionIds = user.collections
    await Collection.deleteMany({ _id: { $in: collectionIds } })
    await user.deleteOne()
    res.status(200).json({ message: 'User deleted' })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})


module.exports = router