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
  },
  logout: (req, res, next) => {
    req.logout()
    res.redirect('/signin')
  },
  getUsers: (req, res, next) => {
    User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User dedn't exist")
        if (user.email === 'root@example.com') throw new Error('不可更動此用戶')
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(() => res.redirect('/admin/users'))
      .catch(err => next(err))
  }
}

module.exports = userController
