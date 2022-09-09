const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = rquire('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
module.exports = app => {
  app.use(passport.initialize())  // initialize the authentication middleware "Passport"
  app.use(passport.session())  // initialize the middleware "Express-Session"

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'This email has not registered yet.' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Invalid password. Please try again.'})
          }
          return done(null, user)
        })
      })
      .catch(err => console.error(err))
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { name, email } = profile._json
      const user = await User.findOne({ where: { email} })
      if (user) return done(null, user)
  
      const randomPassword = Math.random().toString(36).slice(-8)
      const createdUser = await User.create({
        name,
        email,
        password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10), null)
      })
      
      done(null, createdUser)
    } catch(err) {
      done(err, false)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      }).catch(err => done(err, null))
  })
}