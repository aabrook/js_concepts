const Event = require('./models/Event')
const { assign, keys } = Object
const { parse } = JSON
const uuid = require('uuid/v4')

const init = () => {
  let listeners = {}
  let onAny = []

  return {
    on: (type, fn) => assign(listeners, {[type]: [...(listeners[type] || []), fn]}),
    onAny: (fn) => onAny = [...onAny, fn],
    emit: (type, payload, id = uuid()) => (
      listeners[type]
        ? listeners[type].map(fn => fn(payload, id))
        : []
    ).concat(onAny.map(fn => fn(type, payload, id)))
  }
}

const storeEvent = ({ sequelize }) => ({ event, aggregate }) => (
  sequelize.transaction(() => (
    Event({ sequelize }).create({
      aggregate,
      event
    })
  ))
)

const allEvents = (sequelize) => () => Event({ sequelize }).findAll({ order: '"createdAt" ASC' })

module.exports = ({ sequelize }) => (
  assign({}, {
    models: {
      Event: Event({ sequelize })
    },
    storeEvent: storeEvent({ sequelize }),
    allEvents: allEvents(sequelize),
  }, init())
)