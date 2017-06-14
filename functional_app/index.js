const express = require('express')
const State = require('../helpers/state_monad')
const { on, emit } = require('../functional_events')
const { assign } = Object

let globalState =
  State.of({ listeners: {}, tasks: ['init'] })
  .chain(st => on('addedToState', ([_, state]) => console.log(state), State(st)))
  .chain(st => on('rootViewed', ([_, state]) => console.log('Current State', state), State(st)))

const addTask = (list = [], task) => [...list, task]
const appendToState = (task, [_, st]) =>
  State([task, assign({}, st, { tasks: addTask(st.tasks, task) })])

const app = express()
const main = () => {
  globalState.map(([_, s]) => console.log('a', s))

  app.get('/', (req, res) => (
    globalState = globalState
      .chain(([_, state]) => State([res.send({ tasks: state.tasks }), state]))
      .chain((state) =>
        emit('rootViewed', State(state))
      )
  ))

  app.post('/:addToState', (req, res) => (
    globalState = globalState
      .chain((state) => appendToState(req.params['addToState'], state))
      .chain(([task, st]) => State([res.send(task), st]))
      .chain((state) =>
        emit('addedToState', State(state))
      )
  ))
}

app.listen(3000, () => console.log('listening on 3000') || main())
