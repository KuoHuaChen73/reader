'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Experience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Experience.belongsTo(models.Book, { foreignKey: 'bookId' })
      Experience.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Experience.init({
    text: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Experience',
    tableName: 'Experiences',
    underscored: true
  })
  return Experience
}
