const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userController = {
  signUpPage: (req, res, next) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (!name) throw new Error('請輸入名稱')
    if (password !== passwordCheck) throw new Error('確認密碼錯誤')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('信箱已註冊')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          email,
          password: hash
        })
      })
      .then(() => res.render('signin'))
      .catch(err => next(err))
  },
  signinPage: (req, res, next) => {
    res.render('signin')
  },
  signin: (req, res, next) => {
    res.redirect('/books')
  }
}

module.exports = userController
