module.exports = {
  errorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    // if (err.message === "You don't have permission") return res.redirect('/')
    console.log('123')
    res.redirect('back')
    next(err)
  }
}
