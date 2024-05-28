'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('Users', 'description', {
      type: Sequelize.STRING,
      defaultValue: '這個人很懶，什麼都沒有留下:('
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('Users', 'description', {
      type: Sequelize.STRING,
      defaultValue: null
    })
  }
}
