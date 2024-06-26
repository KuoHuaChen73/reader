'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('States', [
      'Not yet', 'Reading', 'Finished'
    ].map(s => ({
      name: s,
      created_at: new Date(),
      updated_at: new Date()
    }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('States', {})
  }
}
