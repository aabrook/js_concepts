const Event = require('./models/Event')

const runProjections = ({ event, projections }) =>
  projections.map(p => p(event))


const backgroundProjections = ({ event, projections }) =>
  setTimeout(runProjections, 1, ({ event, projections }))

const storeEvent = ({ sequelize, projections = [] }) => ({ event, aggregate, waitForProjection }) => {
  const model = Event({ sequelize })

  const saved = sequelize.transaction(() => (
    model.create({
      aggregate,
      event
    })
  ))

  return waitForProjection
    ? saved.then(savedEvent => runProjections({ event, projections }))
    : backgroundProjections({ event, projections }) && saved
}

const allEvents = (sequelize) => () => Event({ sequelize }).findAll()

module.exports = ({ sequelize, projections }) => ({
  models: {
    Event: Event({ sequelize })
  },
  storeEvent: storeEvent({ sequelize, projections }),
  allEvents: allEvents(sequelize)
})
