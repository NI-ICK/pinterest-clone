const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../model/User')
const passport = require('passport')

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email
    })
    await user.save()
    res.status(201).json(user)
  } catch(error) {
    console.log(error)
  }
})

router.post('/login', (req, res, next) => {
  try {
    passport.authenticate('local', (error, user) => {
      if (error) throw error
      if (!user) res.json({ message: error })
  
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

router.get('/user', (req, res) => {
  try {
    res.json(req.user) 
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router