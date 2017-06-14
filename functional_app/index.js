const express = require('express')
const State = require('../helpers/state_monad')
const { on, emit } = require('../functional_events')
const { assign } = Object

const addTask = (list = [], task) => [...list, task]
const appendToState = (task, [_, st]) =>
  State([task, assign({}, st, { tasks: addTask(st.tasks, task) })])

const app = express()
const main = (st = State.of({ tasks: ['init'] })) => {
  st.map(([_, s]) => console.log('a', s.tasks))

  app.use((req, res, next) =>
    req.originalUrl !== '/'
    ? next()
    : main(
      st.chain(([_, state]) => State([res.send(state), state]))
      .chain((state) => {
        console.log('b', state[1])
        return State(state)
      })
    )
  )

  app.post('/:addToState', (req, res) => (
    main(
      st.chain((state) => appendToState(req.params['addToState'], state))
      .chain(([task, st]) => State([res.send(task), st]))
      .chain((state) => {
        console.log('c', state[1])
        return State(state)
      })
    )
  ))
}

app.listen(3000, () => console.log('listening on 3000') || main())
