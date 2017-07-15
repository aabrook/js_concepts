const express = require('express')
const parser = require('body-parser')
const uuid = require('uuid/v4')
const { bool, compose } = require('../helpers')
const { assign } = Object
const routes = require('./routes')

const { Reader, Maybe } = require('../monads')
const { Just, Nothing } = Maybe

let data = {
  [uuid()]: { name: 'jo', job: 'plumber' },
  [uuid()]: { name: 'bob', job: 'builder' }
}
const byId = (id) => Just(data[id]).chain(d => d ? Just(d) : Nothing())
const insert = (payload) => assign(data, { [uuid()]: payload })

const env = {
  port: 3000,
  db: {
    byId,
    all: data,
    insert
  }
}
const runReader = (env) => (
  bool(
    a => a,
    r => r.runReader(env),
    r => r.hasOwnProperty('runReader')
  )
)

const run = () => (
  Reader.ask()
    .map(env => {
      const { app, port } = env
      app.use(parser.json())

      runReader(env)(routes())

      const started = compose(
        console.log,
        res => res.fork(err => `Failed to start ${err}`, () => `Listening on ${port}`),
        Maybe.Maybe.of)

      return app.listen(port, started)
    })
)

run().runReader(assign({}, env, { app: express() }))
