const express = require('express')
const { assign } = Object

module.exports = ({ state, store: { emitter, storeEvent } }) => {
  const route = express()
  route.post('/', (req, res) => {
    storeEvent({
      aggregate: 'tasks',
      event: assign({ type: 'addedTask' }, req.body)
    }).then(saved => emitter.emit('addedTask', saved.dataValues)
    ).then(projections =>
      res.type('application/json').send(projections[0])
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
    }).then(ev => emitter.emit('deletedTask', ev.dataValues)
    ).then(projections =>
      res.type('application/json').send(projections[0])
    ).catch(e =>
      res.send(JSON.stringify(e))
    )
  ))

  return route
}
