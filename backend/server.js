if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const passport = require('passport')
const otherRoutes = require('./routes/other')
const imagesRoutes = require('./routes/images')
const authRoutes = require('./routes/auth')
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
  origin: 'https://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(session({
  // ENV
  secret: "qwe",
  // ENV
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: db }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'none',
    secure: true
  }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(otherRoutes)
app.use(imagesRoutes)
app.use(authRoutes)

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CRT_FILE)
}

https.createServer(options, app).listen(5000, () => console.log("Server running on port 5000"))