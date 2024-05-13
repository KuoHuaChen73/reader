const { Book } = require('../models')
const adminController = {
  getBooks: (req, res, next) => {
    Book.findAll({ raw: true })
      .then(books => {
        res.render('admin/books', { books })
      })
      .catch(err => next(err))
  },
  createBook: (req, res, next) => {
    res.render('admin/create-book')
  },
  postBook: (req, res, next) => {
    const { name, author, description } = req.body
    console.log('req.body:', req.body)
    if (!name) throw new Error('請輸入書名')
    Book.create({
      name,
      author,
      description
    })
      .then(() => {
        req.flash('success_messages', '新增成功')
        res.redirect('/admin/books')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
