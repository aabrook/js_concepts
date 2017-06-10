const express = require('express')
const uuid = require('uuid/v4')
const { assign } = Object
const { stringify } = JSON
const { Try } = require('../../helpers')

module.exports = ({ state, store: { emit, on, remove, storeEvent } }) => {
  const route = express()

  route.post('/', (req, res) => {
    const id = uuid()
    const sender = (payload, reqId) =>
      (reqId === id ? (
        Try(
          (payload) => res.send(payload)
        )(
          (resp) => console.log('send', resp),
          console.error
        )(payload) && remove(sender)
      ) : payload)

    on('stateUpdated', sender)
    return storeEvent({
      aggregate: 'tasks',
      event: assign({ type: 'addedTask' }, req.body)
    }).then(
      ({ dataValues: { event } }) => emit('addedTask', event, id)
    ).catch(
      e => console.error('Failed to add and emit', e) || res.send(stringify({ error: e }))
    )
  })

  route.get('/', (req, res) => (
    res.send(state())
  ))

  route.delete('/:id', (req, res) => {
    const id = uuid()
    const sender = (payload, reqId) =>
      (reqId === id ? (
        Try(
          (payload) => res.type('application/json').send(payload)
        )(
          (resp) => console.log('send', resp),
          console.error
        )(payload) && remove(sender)
      ) : payload)

    on('stateUpdated', sender)
    return storeEvent({
      aggregate: 'tasks',
      event: { type: 'deletedTask', id: req.params['id'] }
    }).then(
      ({ dataValues: { event } }) => emit('deletedTask', event, id)
    ).catch(e =>
      console.error('Failed to delete and emit', e) || res.send(stringify(e))
    )
  })

  return route
}
