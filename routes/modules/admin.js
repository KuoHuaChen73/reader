const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const userController = require('../../controllers/user-controller')
const upload = require('../../middlewares/multer')
router.get('/books/create', adminController.createBook)
router.get('/books/:id/edit', adminController.editBook)
router.get('/books/:id', adminController.getBook)
router.post('/books', upload.single('image'), adminController.postBook)
router.put('/books/:id', upload.single('image'), adminController.putBook)
router.delete('/books/:id', adminController.deleteBook)
router.get('/books', adminController.getBooks)

router.get('/categories/:id', categoryController.getCategory)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.post('/categories', categoryController.postCategory)
router.get('/categories', categoryController.getCategories)

router.get('/users', userController.getUsers)
router.use('/', (req, res) => {
  res.redirect('/admin/books')
})

module.exports = router
