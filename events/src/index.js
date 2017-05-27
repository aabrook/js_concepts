const Event = require('./models/Event')

const storeEvent = (sequelize) => ({ event, aggregate }) => {
  const model = Event({ sequelize })

  return model.sync().then(() => (
    model.create({
      aggregate,
      event
    })
  ))
}

const allEvents = (sequelize) => () => (
  Event({ sequelize }).findAll()
)

module.exports = ({ sequelize }) => ({
  models: {
    Event: Event({ sequelize })
  },
  storeEvent: storeEvent(sequelize),
  allEvents: allEvents(sequelize)
})
