require('dotenv').config()
const express = require('express')
const router = express.Router()
const { Pin, Comment, Reply } = require('../model/Pin')
const multer = require('multer')
const mongoose = require('mongoose')
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

router.post('/createPin', upload.single('image'), async (req, res) => {
    try {  
        const optimisedBuffer = await optimiseImage(req.file.buffer)

        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: 'pins', resource_type: 'image' },
                (error, result) => {
                  if (result) { resolve(result) } 
                  else { reject(error) }
                }
              )
              streamifier.createReadStream(buffer).pipe(stream)
            })
          }
      
          const result = await streamUpload(optimisedBuffer)

        const pin = new Pin({
            title: req.body.title,
            image: result.secure_url,
            imageId: result.public_id,
            imgWidth: result.width,
            imgHeight: result.height,
            description: req.body.description,
            tags: req.body.tags,
            user: req.body.user,
        })
        
        await pin.save()
        res.status(201).json(pin)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/editPin/:id', async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id)
        const { description, title, tags } = req.body

        const updateFields = {}
        if(description) updateFields.description = description
        if(title) updateFields.title = title
        updateFields.tags = tags
        
        await pin.updateOne({ $set: updateFields })
        res.status(200).json({ message: 'Updated' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/pins', async (req, res) => {
    try {
        const pins = await Pin.find()
        .populate('user', '-password -email')
        res.status(200).json(pins)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/pins/search', async (req, res) => {
    try {
        const { query } = req.query
        const pins = await Pin.find({ 
            $or: [
                { title: new RegExp(query, 'i')},
                { tags: { $in: [new RegExp(query, 'i')]}}
            ]
        }).populate('user', '-password -email')
        res.status(200).json(pins)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/pins/similar', async (req, res) => {
    try {
        const pin = await Pin.findById(req.query.id)
        const { title, tags } = pin
        const query = { _id: { $ne: req.query.id }, $or: [] }

        if(title) query.$or.push({ title: new RegExp(title, 'i')})
        if(tags.length) query.$or.push({ tags: { $in: tags }}) 

        const similarPins = await Pin.find(query).populate('user', '-password -email')
        res.status(200).json(similarPins)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/pins/created', async (req, res) => {
    try {
        const pins = await Pin.find({ user: req.query.id })
        .populate('user', '-password -email')
        res.status(200).json(pins)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

router.get('/pin/:id', async (req, res) => {
    try {
        if(!isValidObjectId(req.params.id)) return res.status(200).json(null)
            
        const pin = await Pin.findById(req.params.id)
        .select('-comments -likes')
        .populate('user', '-password -email')
        res.status(200).json(pin)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/pin/:id/comments', async (req, res) => {
    try {
        const comments = await Pin.findById(req.params.id)
        .select('comments')
        .populate({
            path: 'comments',
            populate: [
                { path: 'user', select: '-password -email' },
                {
                    path: 'replies',
                    populate: { path: 'user', select: '-password -email' }
                }
            ]
        })
        res.status(200).json(comments)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/pin/delete/:id', async (req, res) => {
    try {
        const pin = await Pin.findById(req.params.id)
        .populate({
            path: 'comments',
            populate: { path: 'replies' }
        })
        await cloudinary.uploader.destroy(pin.imageId)
        
        for (const comment of pin.comments) {
            for (const reply of comment.replies) {
                const rep = await Reply.findById(reply._id)
                await rep.deleteOne()
            }
            const com = await Comment.findById(comment._id)
            await com.deleteOne()
        }
        
        await pin.deleteOne()
        res.status(200).json({ message: 'Pin deleted' })
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/comment', async (req, res) => {
    try {
        const pin = await Pin.findById(req.body.parentId)
        if(pin) {
            const newComment = new Comment({
                content: req.body.content,
                user: req.body.user
            })
            await newComment.save()
            pin.comments.push(newComment._id)
            await pin.save()
            return res.status(200).json(newComment)
        }
        
        const comment = await Comment.findById(req.body.parentId)
        if(comment) {
            const newReply = new Reply({
                content: req.body.content,
                user: req.body.user
            })
            await newReply.save()
            comment.replies.push(newReply._id)
            await comment.save()
            return res.status(200).json(newReply)
        }
        return res.status(404).json({ message: 'Invalid id' })
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/comment/delete/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('replies')
        if(comment) {
            for (const reply of comment.replies) {
                const rep = await Reply.findById(reply._id)
                await rep.deleteOne()
            }

            const pin = await Pin.findById(req.query.pinId)
            await pin.comments.pull(req.params.id)
            await pin.save()
            await comment.deleteOne()
            res.status(200).json({ message: 'Deleted' })
            return 
        }
        
        const parentComm = await Comment.findById(req.query.commId)
        await parentComm.replies.pull(req.params.id)
        await parentComm.save()
        const reply = await Reply.findById(req.params.id)
        if(reply) await reply.deleteOne()
        res.status(200).json({ message: 'Deleted' })
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/likes', async (req, res) => {
    try {
        const { id, action, currUser } = req.body
        const comment = await Comment.findById(id)
        if(comment) {
            if(action === 'increment') {
                await comment.updateOne({ $push: { likes: currUser._id }})
                return res.status(200).json({ message: 'Liked'})
            }
            if(action === 'decrement') {
                await comment.updateOne({ $pull: { likes: currUser._id }})
                return res.status(200).json({ message: 'Disliked'})
            }
        }
        
        const reply = await Reply.findById(id)
        if(reply) {
            if(action === 'increment') {
                await reply.updateOne({ $push: { likes: currUser._id }})
                return res.status(200).json({ message: 'Liked'})
            }
            if(action === 'decrement') {
                await reply.updateOne({ $pull: { likes: currUser._id }})
                return res.status(200).json({ message: 'Disliked'})
            }
        }
        
        res.status(404).json({ message: 'Invalid id' })
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router