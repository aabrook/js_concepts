const express = require('express')

module.exports = ({ projections, state, store: { allEvents, storeEvent, models: { Event } } }) => {
  const route = express()
  route.get('/', (_req, res) => (
    allEvents()
      .then(events => events.map(ev => ev.dataValues))
      .then(events => res.send(events))
      .catch(e => res.send(e))
  ))

  return route
}
