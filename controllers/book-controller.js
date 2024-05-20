const { Book, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const bookController = {
  getBooks: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = 9
    const offset = getOffset(limit, page)
    Promise.all([
      Book.findAndCountAll({
        include: Category,
        where: { ...categoryId ? { categoryId } : {} },
        limit,
        offset,
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([books, categories]) => {
        const favoritedBooksId = req.user.FavoritedBooks.map(b => b.id)
        const data = books.rows.map(b => ({
          ...b,
          description: b.description.substring(0, 30),
          isFavorited: favoritedBooksId.includes(b.id)
        })
        )
        res.render('books', {
          books: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, books.count)
        })
      })
      .catch(err => next(err))
  },
  getBook: (req, res, next) => {
    Book.findByPk(req.params.id, {
      include: [
        Category,
        {
          model: Comment,
          separate: true,
          order: [['createdAt', 'DESC']],
          include: User
        }
      ]
    })
      .then(book => {
        if (!book) throw new Error("Book didn't exist")
        const favoritedBooksId = req.user.FavoritedBooks.map(b => b.id)
        book = book.toJSON()
        res.render('book', {
          book,
          isFavorited: favoritedBooksId.includes(book.id)
        })
      })
      .catch(err => next(err))
  }
}

module.exports = bookController
