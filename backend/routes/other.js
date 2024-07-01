const express = require('express')
const router = express.Router()
const Pin = require('../model/Pin')

router.get('/pins', async (req, res) => {
  try {
    const pins = await Pin.find()
    res.send(pins)
  } catch(error) {
    res.status(500).send({ message: error.message })
  }
})

module.exports = router