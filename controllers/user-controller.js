const { User, Comment, Book, Favorite, Like } = require('../models')
const bcrypt = require('bcryptjs')
const { localFileHandler } = require('../helpers/file-helpers')
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
  },
  getUser: (req, res, next) => {
    User.findByPk(req.params.id, {
      include: {
        model: Comment,
        include: Book
      }
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist")
        user = user.toJSON()
        user.totalComments = user.Comments.length
        const temp = []
        user.Comments = user.Comments.filter(c => {
          if (temp.some(t => t.bookId === c.bookId)) return false
          temp.push(c)
          return true
        })
        res.render('users/profile', { userProfile: user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User dedn't exist")
        res.render('users/edit', { userProfile: user })
      })
  },
  putUser: (req, res, next) => {
    const { name, description } = req.body
    const { file } = req
    Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User dedn't exist")
        return user.update({
          name,
          description,
          image: filePath || user.image
        })
      })
      .then(user => res.redirect(`/users/${user.id}`))
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const bookId = req.params.id
    Promise.all([
      Book.findByPk(bookId),
      Favorite.findOne({
        where: {
          bookId,
          userId: req.user.id
        }
      })
    ])
      .then(([book, favorite]) => {
        if (!book) throw new Error("Book didn't exist")
        if (favorite) throw new Error('You have already favorited this book')
        return Favorite.create({
          userId: req.user.id,
          bookId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const bookId = req.params.id
    Promise.all([
      Book.findByPk(bookId),
      Favorite.findOne({
        where: {
          bookId,
          userId: req.user.id
        }
      })
    ])
      .then(([book, favorite]) => {
        if (!book) throw new Error("Book didn't exist")
        if (!favorite) throw new Error("You haven't favorited this book")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const bookId = req.params.id
    Promise.all([
      Book.findByPk(bookId),
      Like.findOne({
        where: {
          bookId,
          userId: req.user.id
        }
      })
    ])
      .then(([book, like]) => {
        if (!book) throw new Error("Book didn't exist")
        if (like) throw new Error('You have liked this book')
        return Like.create({
          userId: req.user.id,
          bookId
        })
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const bookId = req.params.id
    Promise.all([
      Book.findByPk(bookId),
      Like.findOne({
        where: {
          bookId,
          userId: req.user.id
        }
      })
    ])
      .then(([book, like]) => {
        if (!book) throw new Error("Book didn't exist")
        if (!like) throw new Error("You haven't liked this book")
        return like.destroy()
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
