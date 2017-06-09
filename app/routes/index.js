const express = require('express')
const uuid = require('uuid/v4')
const { assign } = Object

module.exports = ({ state, store: { emit, storeEvent } }) => {
  const route = express()

  route.post('/', (req, res) => {
    const id = uuid()
    console.log('Saving', req.body)

    storeEvent({
      aggregate: 'tasks',
      event: assign({ type: 'addedTask' }, req.body)
    }).then(
      ({ dataValues: { event } }) => emit('addedTask', event, id)
    ).then(
      results => console.log('We have emitted', results[0]) || res.send(results[0])
    ).catch(
      e => console.error('Failed to add and emit', e) || res.send(JSON.stringify({ error: e }))
    )
  })

  route.get('/', (req, res) => (
    console.log(state()) ||
    res.send(state())
  ))

  route.delete('/:id', (req, res) => (
    storeEvent({
      aggregate: 'tasks',
      event: { type: 'deletedTask', id: req.params['id'] },
      waitForProjection: true
    }).then(ev => emitter.emit('deletedTask', ev.dataValues)
    ).then(projections =>
      res.type('application/json').send(projections[0])
    ).catch(e =>
      res.send(JSON.stringify(e))
    )
  ))

  return route
}
