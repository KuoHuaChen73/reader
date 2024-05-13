const { Book } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const adminController = {
  getBooks: (req, res, next) => {
    Book.findAll({ raw: true })
      .then(books => {
        res.render('admin/books', { books })
      })
      .catch(err => next(err))
  },
  getBook: (req, res, next) => {
    console.log('123')
    Book.findByPk(req.params.id, { raw: true })
      .then(book => {
        if (!book) throw new Error("Book didn't exist")
        res.render('admin/book', { book })
      })
      .catch(err => next(err))
  },
  createBook: (req, res, next) => {
    res.render('admin/create-book')
  },
  postBook: (req, res, next) => {
    const { name, author, description } = req.body
    const { file } = req
    if (!name) throw new Error('請輸入書名')
    localFileHandler(file)
      .then(filePath => {
        return Book.create({
          name,
          author,
          description,
          image: filePath || null
        })
      })
      .then(() => {
        req.flash('success_messages', '新增成功')
        res.redirect('/admin/books')
      })
      .catch(err => next(err))
  },
  editBook: (req, res, next) => {
    Book.findByPk(req.params.id, { raw: true })
      .then(book => {
        if (!book) throw new Error("Book didn't exist")
        res.render('admin/edit-book', { book })
      })
      .catch(err => next(err))
  },
  putBook: (req, res, next) => {
    const { name, author, description } = req.body
    const { file } = req
    Promise.all([
      Book.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([book, filePath]) => {
        if (!book) throw new Error("Book didn't exist")
        return book.update({
          name,
          author,
          description,
          image: filePath || book.image
        })
      })
      .then(book => {
        req.flash('success_messages', '修改成功')
        res.redirect(`/admin/books/${book.id}`)
      })
      .catch(err => next(err))
  },
  deleteBook: (req, res, next) => {
    Book.findByPk(req.params.id)
      .then(book => {
        if (!book) throw new Error("Book didn't exist")
        return book.destroy()
      })
      .then(() => res.redirect('/admin/books'))
      .catch(err => next(err))
  }
}

module.exports = adminController
