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

const run = () => (
  Reader.ask()
    .map(env => {
      const { app, port } = env
      app.use(parser.json())

      Reader.run(routes(), env)

      const started = compose(
        console.log,
        res => res.fork(err => `Failed to start ${err}`, () => `Listening on ${port}`),
        Maybe.Maybe.of)

      return app.listen(port, started)
    })
)

run().runReader(assign({}, env, { app: express() }))
