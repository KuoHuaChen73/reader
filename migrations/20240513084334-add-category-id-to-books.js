'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Books', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Books', 'category_id')
  }
}
