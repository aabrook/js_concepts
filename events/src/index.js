const Event = require('./models/Event')
const { assign, keys } = Object
const { parse } = JSON

const runProjections = ({ event, projections }) =>
  keys(projections)
    .map(k => ({ k, p: projections[k](event) }))
    .reduce((mp, { k, p }) => assign(mp, { [k]: p }), {})

const backgroundProjections = ({ event, projections }) =>
  setTimeout(runProjections, 1, ({ event, projections }))

const reproject = (sequelize) => ({ projections }) =>
  allEvents(sequelize)()
    .then(events =>
      events.map(({ dataValues: { event } }) => runProjections({ event: parse(event), projections })))

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
  allEvents: allEvents(sequelize),
  reproject: reproject(sequelize)
})
