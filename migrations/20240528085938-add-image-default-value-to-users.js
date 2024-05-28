'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: null
    })
  }
}
