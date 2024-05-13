const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true })
      .then(categories => {
        res.render('admin/categories', { categories })
      })
      .catch(err => next(err))
  },
  getCategory: (req, res, next) => {
    Promise.all([
      Category.findAll({ raw: true }),
      Category.findByPk(req.params.id, { raw: true })
    ])
      .then(([categories, category]) => {
        if (!category) throw new Error("Category didn't exist")
        res.render('admin/categories', { category, categories })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入分類名稱')
    Category.findOne({ where: { name } })
      .then(category => {
        if (category) throw new Error('已有重複分類名稱')
        return Category.create({
          name
        })
      })
      .then(() => {
        req.flash('success_messages', '新增成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入分類名稱')
    Category.findOne({ where: { name } })
      .then(category => {
        if (category) throw new Error('已有重複分類名稱')
        return Category.findByPk(req.params.id)
      })
      .then(category => {
        if (!category) throw new Error("Category didn't exist")
        return category.update({
          name
        })
      })
      .then(() => {
        req.flash('success_messages', '修改成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist")
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', '刪除成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
