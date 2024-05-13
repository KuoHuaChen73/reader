const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
router.get('/books', adminController.getBooks)
router.get('/books/create', adminController.createBook)
router.post('/books', adminController.postBook)

router.use('/', (req, res) => {
  res.redirect('/admin/books')
})

module.exports = router
