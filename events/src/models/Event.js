const Sequelize = require('sequelize')
const Event = (sequelize) => sequelize.define('event', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  aggregate: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  event: {
    type: Sequelize.JSON
  }
}, {
  updatedAt: false
})

module.exports = ({ sequelize }) => Event(sequelize)
