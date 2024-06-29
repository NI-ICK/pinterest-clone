const express = require('express')
const router = express.Router()
const Pin = require('../model/Pin')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
  }
})

const mimetype = ['image/webp', 'image/png', 'image/jpg', 'image/jpeg', 'image/avif']
const fileFilter = (req, file, cb) => {
  if(mimetype.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Wrong file format'), false)
  }
}

const upload = multer({ 
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
})

router.post('/', upload.single('image'), async (req, res) => {
  const pin = new Pin({
      title: req.body.title,
      image: req.file.filename,
      description: req.body.description,
      user: req.body.user
  })
  await pin.save()
  res.status(201).json(pin)
})

module.exports = router