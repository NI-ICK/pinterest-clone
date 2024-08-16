require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const pinRoutes = require('./routes/pin')
const usersRoutes = require('./routes/users')
const collectionRoutes = require('./routes/collection')
const initializePassport = require('./passport-config')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const https = require('https')
const fs = require('fs')

const db = `mongodb+srv://Admin:${process.env.DB_PASS}@pins.m5wwv9v.mongodb.net/?retryWrites=true&w=majority&appName=Pins`
mongoose.connect(db)
const app = express()

initializePassport(passport)

app.use(cors({
  origin: process.env.SITE_URL,
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: db }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 5, // 5 h
    secure: true,
    sameSite: 'Lax',
  }
}))
app.use(passport.initialize())
app.use(passport.session())

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
  app.listen(process.env.PORT, '0.0.0.0', () => console.log(`Server running on port ${process.env.PORT}`))
}

module.exports = app