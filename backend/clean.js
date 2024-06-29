const mongoose = require('mongoose')
require('dotenv').config()
const Pin = require('./model/Pin')
const User = require('./model/User')
const fs = require('fs')
const path = require('path')

mongoose.connect(`mongodb+srv://Admin:${process.env.DB_PASS}@pins.m5wwv9v.mongodb.net/?retryWrites=true&w=majority&appName=Pins`)

const clean = async () => {
  await Pin.deleteMany({})
  await User.deleteMany({})
  console.log('Deleted')
}
clean()

const dir = 'uploads'

fs.readdir(dir, (err, files) => {
  if(err) {
    console.log("Error")
    return
  } 

  files.forEach(file => {
    const filePath = path.join(dir, file)

    fs.unlink(filePath, err => {
      if(err) {
        console.log('Error')
      } else {
        console.log('Deleted')
      }
    })
  })
})