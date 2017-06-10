const express = require('express')
const uuid = require('uuid/v4')
const { assign } = Object
const { stringify } = JSON

module.exports = ({ state, store: { emit, storeEvent } }) => {
  const route = express()

  route.post('/', (req, res) => {
    const id = uuid()

    return storeEvent({
      aggregate: 'tasks',
      event: assign({ type: 'addedTask' }, req.body)
    }).then(
      ({ dataValues: { event } }) => emit('addedTask', event, id)
    ).then(
      results => console.log('ADDED', results) || res.send(results[0])
    ).catch(
      e => console.error('Failed to add and emit', e) || res.send(stringify({ error: e }))
    )
  })

  route.get('/', (req, res) => (
    console.log(state()) ||
    res.send(state())
  ))

  route.delete('/:id', (req, res) => {
    const id = uuid()

    return storeEvent({
      aggregate: 'tasks',
      event: { type: 'deletedTask', id: req.params['id'] }
    }).then(
      ({ dataValues: { event } }) => emit('deletedTask', event, id)
    ).then(projections =>
      res.type('application/json').send(projections[0])
    ).catch(e =>
      console.error('Failed to delete and emit', e) || res.send(stringify(e))
    )
  })

  return route
}
