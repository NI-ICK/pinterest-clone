require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const pinRoutes = require('./routes/pin')
const usersRoutes = require('./routes/users')
const collectionRoutes = require('./routes/collection')
const https = require('https')
const fs = require('fs')

const db = process.env.MONGODB_URI
mongoose.connect(db)
const app = express()

app.use(cors({
  origin: process.env.SITE_URL,
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', pinRoutes)
app.use('/api', usersRoutes)
app.use('/api', collectionRoutes)

if(process.env.NODE_ENV === 'development') {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CRT_FILE)
  }

  https.createServer(options, app).listen(process.env.PORT, '0.0.0.0', () => console.log(`Server running on port ${process.env.PORT}`))
} else {
  app.listen(process.env.PORT, '0.0.0.0', () => console.log(`Secure server running on port ${process.env.PORT}`))
}

module.exports = app