'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Book.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  Book.init({
    name: DataTypes.STRING,
    author: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'Books',
    underscored: true
  })
  return Book
}
