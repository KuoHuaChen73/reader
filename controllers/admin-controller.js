const adminController = {
  getBooks: (req, res, next) => {
    res.render('admin/books')
  }
}

module.exports = adminController
