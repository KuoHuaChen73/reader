const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { errorHandler } = require('../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../middlewares/auth')
const upload = require('../middlewares/multer')
const bookController = require('../controllers/book-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signinPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
router.get('/logout', userController.logout)

router.get('/books/top', authenticated, bookController.getTopBooks)
router.get('/books/:id', authenticated, bookController.getBook)
router.get('/books', authenticated, bookController.getBooks)

router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', commentController.deleteComment)

router.get('/users/:id/experiences', authenticated, userController.getExperiences)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
router.get('/users/:id', authenticated, userController.getUser)

router.post('/favorite/:id', authenticated, userController.addFavorite)
router.delete('/favorite/:id', authenticated, userController.removeFavorite)

router.post('/like/:id', authenticated, userController.addLike)
router.delete('/like/:id', authenticated, userController.removeLike)

router.get('/experiences/:id/edit', authenticated, userController.editExperience)
router.get('/experiences/create', authenticated, userController.createExperience)
router.put('/experiences/:id', authenticated, userController.putExperience)
router.get('/experiences/:id', authenticated, userController.getExperience)
router.delete('/experiences/:id', authenticated, userController.deleteExperience)
router.post('/experiences', authenticated, userController.postExperience)

router.post('/state/:id', authenticated, userController.postStatedBook)
router.delete('/state/:id', authenticated, userController.deleteStatedBook)

router.use('/', (req, res) => res.redirect('/books'))
router.use(errorHandler)
module.exports = router
