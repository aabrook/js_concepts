const Event = require('./models/Event')
const { assign } = Object
const uuid = require('uuid/v4')

const drop = (ary = [], val) => ary.includes(val) ? ary.splice(ary.indexOf(val), 1) && ary : ary

const init = () => {
  let listeners = {}
  let onAny = []

  return {
    on: (type, fn) => assign(listeners, {[type]: [...(listeners[type] || []), fn]}),
    remove: (type, fn) => assign(listeners, {[type]: drop(listeners[type], fn)}),
    onAny: (fn) => onAny.push(fn),
    removeAny: (fn) => drop(onAny, fn),
    emit: (type, payload, id = uuid()) => {
      return (listeners[type]
          ? listeners[type].map(fn => fn(payload, id))
          : []
      ).concat(onAny.map(fn => fn(type, payload, id)))
    }
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
    allEvents: allEvents(sequelize)
  }, init())
)
