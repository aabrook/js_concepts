const express = require('express')
const parser = require('body-parser')
const { compose } = require('../helpers')
const { assign } = Object
const routes = require('./routes')
const db = require('./data')

const { Reader, Maybe } = require('../monads')

const env = {
  port: 3000,
  db
}

const started = (port) => compose(
  console.log,
  res => res.fork(err => `Failed to start ${err}`, () => `Listening on ${port}`),
  Maybe.Maybe.of
)

const run = () => (
  Reader.ask()
    .map(env => {
      const { app, port } = env
      app.use(parser.json())

      Reader.run(routes(), env)

      return app.listen(port, started(port))
    })
)

run().runReader(assign({}, env, { app: express() }))
