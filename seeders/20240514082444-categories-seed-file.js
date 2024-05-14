'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      '心理勵志', '文學小說', '商業理財', '藝術設計', '人文社科', '宗教命理', '自然科普', '醫療保健', '生活風格'
    ].map(c => {
      return {
        name: c,
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
