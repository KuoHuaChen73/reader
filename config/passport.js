const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Book } = require('../models')
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤'))
        bcrypt.compare(password, user.password)
          .then(result => {
            if (!result) return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤'))
            return cb(null, user)
          })
      })
      .catch(err => cb(err))
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      {
        model: Book, as: 'FavoritedBooks'
      },
      {
        model: Book, as: 'LikedBooks'
      }
    ]
  })
    .then(user => {
      cb(null, user.toJSON())
    })
    .catch(err => cb(err))
})
module.exports = passport
