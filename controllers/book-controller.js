const bookController = {
  getBooks: (req, res, next) => {
    res.render('books')
  }
}

module.exports = bookController
