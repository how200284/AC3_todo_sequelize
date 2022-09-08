module.exports = {
  authenticator: (req, res, next) => {
    if (isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', 'Please login first.')
    res.redirect('/users/login')
  }
}