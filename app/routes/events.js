const express = require('express')

module.exports = ({ store: { allEvents } }) => {
  const route = express()
  route.get('/', (_req, res) => (
    allEvents()
      .then(events => events.map(ev => ev.dataValues))
      .then(events => res.send(events))
      .catch(e => res.send(e))
  ))

  return route
}
