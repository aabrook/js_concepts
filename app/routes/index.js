const express = require('express')
const { assign } = Object

module.exports = ({ store: { allEvents, storeEvent, models: { Event } } }) => {
  const route = express()
  route.post('/', (req, res) => {
    storeEvent({
      aggregate: 'tasks',
      event: assign({ type: 'addedTask' }, req.body),
      waitForProjection: true
    }).then(projections =>
      res.type('application/json').send(projections[0])
    ).catch(e =>
      res.send(JSON.stringify(e))
    )
  })

  route.get('/', (req, res) => (
    allEvents()
      .then(events =>
        events.filter(ev => ev.aggregate === 'tasks')
      ).then(events =>
        res.type('application/json').send(JSON.stringify(events))
      ).catch(e =>
        res.send(JSON.stringify(e))
      )
  ))

  route.delete('/:id', (req, res) => (
    storeEvent({
      aggregate: 'tasks',
      event: { type: 'deletedTask', id: req.params['id'] },
      waitForProjection: true
    }).then(projections =>
      res.type('application/json').send(projections[0])
    ).catch(e =>
      res.send(JSON.stringify(e))
    )
  ))

  return route
}
