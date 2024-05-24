'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class StatedBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      StatedBook.belongsTo(models.State, { foreignKey: 'stateId' })
      StatedBook.belongsTo(models.Book, { foreignKey: 'bookId' })
    }
  }
  StatedBook.init({
    stateId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StatedBook',
    tableName: 'Stated_books',
    underscored: true
  })
  return StatedBook
}
