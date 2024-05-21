const { User, Comment, Book, Favorite, Like, Experience, Category } = require('../models')
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
  },
  getExperiences: (req, res, next) => {
    Experience.findAll({
      where: { userId: req.params.id },
      include: {
        model: Book,
        include: Category
      },
      order: [['createdAt', 'DESC']]
    })
      .then(experiences => {
        experiences = experiences.map(e => ({
          ...e.toJSON(),
          text: e.text.substring(0, 50),
          isHimself: e.userId === req.user.id
        }))
        console.log(experiences)
        res.render('users/experiences', { experiences })
      })
      .catch(err => next(err))
  },
  getExperience: (req, res, next) => {
    Experience.findByPk(req.params.id, {
      include: {
        model: Book,
        include: Category
      },
      raw: true,
      nest: true
    })
      .then(experience => {
        if (!experience) throw new Error("Experience didn't exist")
        const isHimself = experience.userId === req.user.id
        res.render('users/experience', { experience, isHimself })
      })
      .catch(err => next(err))
  },
  createExperience: (req, res, next) => {
    Book.findAll({ raw: true })
      .then(books => {
        req.flash('success_messages', '建立成功')
        res.render('users/create-experience', { books })
      })
      .catch(err => next(err))
  },
  postExperience: (req, res, next) => {
    const { bookId, text } = req.body
    Promise.all([
      Book.findByPk(bookId),
      Experience.findOne({ where: { bookId, userId: req.user.id } })
    ])
      .then(([book, experience]) => {
        if (!book) throw new Error("Book didn't exist")
        if (experience) throw new Error('You have create experience of this book')
        return Experience.create({
          text,
          bookId,
          userId: req.user.id
        })
      })
      .then(experience => res.redirect(`/users/${experience.userId}/experiences`))
      .catch(err => {
        next(err)
      })
  },
  editExperience: (req, res, next) => {
    Promise.all([
      Experience.findByPk(req.params.id, {
        include: Book,
        raw: true,
        nest: true
      }),
      Book.findAll({ raw: true })
    ])
      .then(([experience, books]) => {
        if (!experience) throw new Error("Experience didn't exist")
        if (experience.userId !== req.user.id) throw new Error("You don't have permission")
        res.render('users/edit-experience', { experience, books })
      })
      .catch(err => next(err))
  },
  putExperience: (req, res, next) => {
    const { bookId, text } = req.body
    Experience.findByPk(req.params.id)
      .then(experience => {
        if (!experience) throw new Error("Experience didn't exist")
        if (req.user.id !== experience.userId) throw new Error("You don't have permission")
        return experience.update({
          bookId,
          text
        })
      })
      .then(experience => {
        req.flash('success_messages', '修改成功:)')
        res.redirect(`/experiences/${experience.id}`)
      })
      .catch(err => next(err))
  },
  deleteExperience: (req, res, next) => {
    Experience.findByPk(req.params.id)
      .then(experience => {
        if (!experience) throw new Error("Experience didn't exist")
        if (!req.user.isAdmin || req.user.id !== experience.userId) throw new Error("You don't have permission")
        return experience.destroy()
      })
      .then(experience => {
        req.flash('success_messages', '刪除成功:)')
        res.redirect(`/users/${experience.userId}/experiences`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
