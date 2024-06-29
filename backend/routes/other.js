const express = require('express')
const router = express.Router()
const Pin = require('../model/Pin')
const User = require('../model/User')

router.get('/pins', async (req, res) => {
  try {
    const pins = await Pin.find()
    res.send(pins)
  } catch(error) {
    res.status(500).send({ message: error.message })
  }
})

router.put('/editUser', async (req, res) => {
  try {
    const userId = req.body.user._id
    const updateFields = req.body

    const user = await User.findById(userId)
    await user.update(updateFields)

    const updatedUser = User.findById(userId)
    res.send(updatedUser)
  } catch(error) {
    res.status(500).send({ message: error.message })  
  }
})

module.exports = router