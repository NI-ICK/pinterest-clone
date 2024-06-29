const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./model/User')

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    User.findOne({ email: email })
      .then(async user => {
        if(!user) {
          return done(null, false, { message: 'No user with that email' })
        }
    
        try {
          if(await bcrypt.compare(password, user.password)) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Password incorrect' })
          }
        } catch(error) {
          done(error)
        }
      })
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => { done(null, user.id) })
  passport.deserializeUser((id, done) => { 
    User.findById(id)
      .then(user => { 
        done(null, user) 
      }).catch(error => {
        done(error)
      }) 
  })
}

module.exports = initialize