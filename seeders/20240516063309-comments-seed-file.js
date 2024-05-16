'use strict'
const faker = require('faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    const books = await queryInterface.sequelize.query('SELECT id FROM Books', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 50 }, (_, index) => ({
        text: faker.lorem.text(),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        book_id: books[Math.floor(Math.random() * books.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', {})
  }
}
