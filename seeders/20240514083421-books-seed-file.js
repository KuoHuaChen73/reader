'use strict'
const faker = require('faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query('SELECT id FROM Categories', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    await queryInterface.bulkInsert('Books',
      Array.from({ length: 50 }).map(() => {
        return {
          name: faker.name.findName(),
          author: faker.name.findName(),
          description: faker.lorem.text(),
          image: `https://loremflickr.com/320/240/book/?random=${Math.random() * 100}`,
          created_at: new Date(),
          updated_at: new Date(),
          category_id: categories[Math.floor(Math.random() * categories.length)].id
        }
      })
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', {})
  }
}
