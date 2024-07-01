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

const dir1 = './public/avatars'
const dir2 = './public/pins'

fs.readdir(dir1, (err, files) => {
  if(err) {
    console.log("Error1" + err)
    return
  } 

  files.forEach(file => {
    const filePath = path.join(dir1, file)

    fs.unlink(filePath, err => {
      if(err) {
        console.log('Error11')
      } else {
        console.log('Deleted')
      }
    })
  })
})

fs.readdir(dir2, (err, files) => {
  if(err) {
    console.log("Error2")
    return
  } 

  files.forEach(file => {
    const filePath = path.join(dir2, file)

    fs.unlink(filePath, err => {
      if(err) {
        console.log('Error22')
      } else {
        console.log('Deleted')
      }
    })
  })
})