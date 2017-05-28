const express = require('express')
const { assign } = Object

module.exports = ({ projections, state, store: { allEvents, storeEvent, models: { Event } } }) => {
  const route = express()
  route.post('/', (req, res) => {
    storeEvent({
      aggregate: 'tasks',
      event: assign({ type: 'addedTask' }, req.body),
      waitForProjection: true
    }).then(projections =>
      res.type('application/json').send(projections.taskState)
    ).catch(e =>
      res.send(JSON.stringify(e))
    )
  })

  route.get('/', (req, res) => (
    res.send(state())
  ))

  route.delete('/:id', (req, res) => (
    storeEvent({
      aggregate: 'tasks',
      event: { type: 'deletedTask', id: req.params['id'] },
      waitForProjection: true
    }).then(projections =>
      res.type('application/json').send(projections.taskState)
    ).catch(e =>
      res.send(JSON.stringify(e))
    )
  ))

  return route
}
