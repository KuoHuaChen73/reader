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
        const favoritedBooksId = req.user.FavoritedBooks.map(f => f.id)
        const likedBooksId = req.user.LikedBooks.map(l => l.id)
        const data = books.rows.map(b => ({
          ...b,
          description: b.description.substring(0, 30),
          isFavorited: favoritedBooksId.includes(b.id),
          isLiked: likedBooksId.includes(b.id)
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
        const favoritedBooksId = req.user.FavoritedBooks.map(f => f.id)
        const likedBooksId = req.user.LikedBooks.map(l => l.id)
        book = book.toJSON()
        res.render('book', {
          book,
          isFavorited: favoritedBooksId.includes(book.id),
          isLiked: likedBooksId.includes(book.id)
        })
      })
      .catch(err => next(err))
  },
  getTopBooks: (req, res, next) => {
    Book.findAll({
      include: {
        model: User,
        as: 'FavoritedUsers'
      }
    })
      .then(books => {
        const booksId = req.user.FavoritedBooks.map(fb => fb.id)
        const result = books.map(b => ({
          ...b.toJSON(),
          description: b.description && b.description.substring(0, 50),
          favoritedCount: b.FavoritedUsers.length,
          isFavorited: booksId.includes(b.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .splice(0, 10)
        res.render('top-books', { books: result })
      })
  }
}

module.exports = bookController
