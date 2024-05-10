const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
router.get('/books', adminController.getBooks)

module.exports = router
