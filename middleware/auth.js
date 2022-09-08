module.exports = {
  authenticator: (req, res, next) => {
    if (isAuthenticated()) {
      return next()
    }
    res.redirect('/users/login')
  }
}