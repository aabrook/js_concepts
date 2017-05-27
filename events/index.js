const Sequelize = require('sequelize')
const sequelize = new Sequelize('events', null, null, {
  dialect: 'sqlite',
  storage: './db/store/development/events.db'
})

const main = (sequelize) => {
  return require('./src')({ sequelize })
}

module.exports = main(sequelize)
