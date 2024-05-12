const { ensureAuthenticated } = require('../helpers/auth-helper')
const { getUser } = require('../helpers/auth-helper')
module.exports = {
  authenticated: (req, res, next) => {
    if (ensureAuthenticated(req)) return next()
    return res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    if (getUser(req).isAdmin === true) return next()
    return res.redirect('/books')
  }
}
