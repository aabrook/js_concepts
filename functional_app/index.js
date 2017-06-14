const express = require('express')
const State = require('../helpers/state_monad')
const { on, emit } = require('../functional_events')
const { assign } = Object

let globalState =
  on('addToState', (task) => console.log(task), State.of({ listeners: {}, tasks: ['init'] }))
  .chain((st) => on('root', (state) => console.log('Current State', state), State(st)))

const addTask = (list = [], task) => [...list, task]
const appendToState = (task, [_, st]) =>
  State([task, assign({}, st, { tasks: addTask(st.tasks, task) })])

const app = express()
const main = () => {
  globalState.map(([_, s]) => console.log('a', s.tasks))

  app.get('/', (req, res) => (
    globalState = globalState
      .chain(([_, state]) => State([res.send({ tasks: state.tasks }), state]))
      .chain((state) => {
        console.log('b', state[1])
        return emit('root', State(state))
      })
  ))

  app.post('/:addToState', (req, res) => (
    globalState = globalState
      .chain((state) => appendToState(req.params['addToState'], state))
      .chain(([task, st]) => State([res.send(task), st]))
      .chain((state) => {
        console.log('c', state[1])
        return emit('addToState', State(state))
      })
  ))
}

app.listen(3000, () => console.log('listening on 3000') || main())
