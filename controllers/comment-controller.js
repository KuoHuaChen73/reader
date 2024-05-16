const { Comment, Book, User } = require('../models')
const commentController = {
  postComment: (req, res, next) => {
    const { text, bookId } = req.body
    const userId = req.user.id
    Promise.all([
      Book.findByPk(bookId),
      User.findByPk(userId)
    ])
      .then(([book, user]) => {
        if (!book) throw new Error("Book didn't exist")
        if (!user) throw new Error("User didn't exist")
        return Comment.create({
          text,
          bookId: book.id,
          userId
        })
      })
      .then(comment => res.redirect(`/books/${comment.bookId}`))
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist")
        return comment.destroy()
      })
      .then(comment => res.redirect(`/books/${comment.bookId}`))
      .catch(err => next(err))
  }
}
module.exports = commentController
