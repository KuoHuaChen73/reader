const { Book, Category } = require('../models')
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
        const data = books.rows.map(b => ({
          ...b,
          description: b.description.substring(0, 30)
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
  }
}

module.exports = bookController
