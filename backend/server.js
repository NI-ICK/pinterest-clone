if(process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
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

const db = `mongodb+srv://Admin:${process.env.DB_PASS}@main.5ak1f4t.mongodb.net/data?retryWrites=true&w=majority&ssl=true`
mongoose.connect(db)
const app = express()

initializePassport(passport)

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'attribution-reporting=(), run-ad-auction=(), join-ad-interest-group=(), compute-pressure=(), browsing-topics=()')
  next()
})

app.use(cors({
  origin: 'https://clonepinterest.netlify.app',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: db }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: true
  }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', pinRoutes)
app.use('/api', usersRoutes)
app.use('/api', collectionRoutes)

app.use(express.static(path.join(__dirname, '../frontend/build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
})

// const options = {
//   key: fs.readFileSync(process.env.SSL_KEY_FILE),
//   cert: fs.readFileSync(process.env.SSL_CRT_FILE)
// }

// https.createServer(options, app)
app.listen(process.env.PORT, '0.0.0.0', () => console.log("Server running on port 5000"))