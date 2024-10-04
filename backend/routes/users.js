require('dotenv').config()
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { User, Collection } = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const fileFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Wrong file format'), false)
  }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB
    },
    fileFilter: fileFilter
})

const optimiseImage = async (buffer) => {
    const image = sharp(buffer)
    const metadata = await image.metadata()

    if(metadata.width > 700) image.resize({ width: 700 })

    if(metadata.hasAlpha) return image.png({ quality: 80, lossless: false }).toBuffer()
    return image.webp({ quality: 80, lossless: false, progressive: true }).toBuffer()
}

router.put('/editUser', upload.single('photo'), async (req, res) => {
  try {
    const optimisedBuffer = await optimiseImage(req.file.buffer)

        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: 'pins', resource_type: 'image' },
                (error, result) => {
                  if (result) {
                    resolve(result)
                  } else {
                    reject(error)
                  }
                }
              )
              streamifier.createReadStream(buffer).pipe(stream)
            })
          }
      
          const result = await streamUpload(optimisedBuffer)

    const updateFields = {}
    if(req.file) updateFields.photo = result.secure_url
    if(req.file) updateFields.imageId = result.public_id
    if(req.body.username) updateFields.username = req.body.username 
    if(req.body.password) updateFields.password = await bcrypt.hash(req.body.password, 10)
    if(req.body.email) updateFields.email = req.body.email
    if(req.body.firstName) updateFields.firstName = req.body.firstName
    if(req.body.lastName) updateFields.lastName = req.body.lastName
    if(req.body.about) updateFields.about = req.body.about
    const user = await User.findById(req.body.user)
    if(user.imageId) await cloudinary.uploader.destroy(user.imageId)
    await user.updateOne({ $set: updateFields })
    res.status(200).json(user)
  } catch(error) {
    res.status(500).json({ message: error.message })  
  }
})

const generateToken = (user) => {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '5h' })
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(200).json(null)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

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
    const token = generateToken(user)
    res.status(201).json({ user, token })
  } catch(error) {
    res.status(500).json({ message: error.moessage })
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(401).json({ message: 'Invalid email' })

    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' })

    const token = generateToken(user)
    res.status(200).json({ token, user })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/currUser', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -email')
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
    if(user.imageId) await removeFromBucket(user.imageId)
    const collectionIds = user.collections
    await Collection.deleteMany({ _id: { $in: collectionIds } })
    await user.deleteOne()
    res.status(200).json({ message: 'User deleted' })
  } catch(error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router