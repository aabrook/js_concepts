'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface
      .createTable('events', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        aggregate: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        event: {
          type: JSON,
          allowNull: false
        }
      })
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.dropTable('events')
  )
}
