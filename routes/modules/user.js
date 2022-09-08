const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.Todo

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const errors = []
  const { name, email, password, confirmPassword } = req.body

  if (!name || !email || !password || !confirmPassword) {
    errors.push('All fields are inquired')
  }
  if (password !== confirmPassword) {
    errors.push('Password & Confirm Password do not match. Please try again.')
  }
  if (errors.length) {
    return res.render('register', { errors, name, email })
  }

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      errors.push('This email has been registered.')
      return res.render('register', { name, email, password, confirmPassword })
    }
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => res.redirect('/'))
      .catch(err => console.error(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You\'ve logged out successfully.')
  res.redirect('/users/login')
})

module.exports = router