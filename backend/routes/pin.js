require('dotenv').config()
const express = require('express')
const router = express.Router()
const { Pin, Comment, Reply } = require('../model/Pin')
const multer = require('multer')
const mongoose = require('mongoose')
const { S3Client, DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const sharp = require('sharp')

const removeFromBucket = async (objectKey) => {
    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: objectKey,
    }))
}

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Wrong file format'), false)
    }
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
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

    if(metadata.hasAlpha) return image.png({ compressionLevel: 9, quality: 80 }).toBuffer()
    return image.webp({ quality: 80 }).toBuffer()
}

router.post('/createPin', upload.single('image'), async (req, res) => {
    try {  
        const optimisedBuffer = await optimiseImage(req.file.buffer)
        const fileKey = `pins/${Date.now().toString()}-${req.file.originalname.split('.').slice(0, -1).join('.')}`

        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: optimisedBuffer,
                ContentType: req.file.mimetype,
        }))

        const pin = new Pin({
            title: req.body.title,
            image: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`, 
            imageId: fileKey,
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
                { description: new RegExp(query, 'i')},
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
        const { title, description, tags } = pin
        
        const similarPins = await Pin.find({
            $or: [
                { tags: { $in: tags } },
                { title: new RegExp(title, 'i')},
                { description: new RegExp(description, 'i')},
            ],
            _id: { $ne: req.query.id } 
        }).populate('user', '-password -email')
        
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

router.delete('/delete/pin/:id', async (req, res) => {
    try {
        const { id } = req.params
        const pin = await Pin.findById(id)
        .populate({
            path: 'comments',
            populate: { path: 'replies' }
        })
        await removeFromBucket(pin.imageId)
        
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