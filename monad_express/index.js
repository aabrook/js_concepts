const express = require('express')
const parser = require('body-parser')
const uuid = require('uuid/v4')
const { assign, keys } = Object

const { State, Reader, Maybe, Writer } = require('../monads')
const { Just, Nothing } = Maybe

let data = {
  [uuid()]: { name: 'jo', job: 'plumber' },
  [uuid()]: { name: 'bob', job: 'builder' }
}
const byId = (id) => Just(data[id]).chain(d => d ? Just(d) : Nothing())
const addRecord = (payload) => assign(data, { [uuid()]: payload })

const env = {
  port: 3000,
  byId,
  all: data,
  addRecord
}

const app = express()
const getAll = (_, res) => (
  Reader.ask().map(({ all }) => res.send(all))
)
const get = ({ params: { id } }, res) => (
  Reader.ask().map(({ byId }) =>
    byId(id).fork(
      r => res.send(r),
      _ => res.send({ 'error': 'not found' })
    )
  )
)
const post = ({ body }, res) => (
  Reader.ask().map(
    ({ addRecord }) => addRecord(body)
  ).map(
    a => res.send(a)
  )
)

const run = () => (
  Reader.of(app)
    .withEnv((a, env) => {
      const { port } = env
      a.use(parser.json())

      a.get('/', (...args) => getAll(...args).runReader(env))
      a.get('/:id', (...args) => get(...args).runReader(env))
      a.post('/', (...args) => post(...args).runReader(env))

      return a.listen(port, (err) =>
        err ? console.log('Failed to start', err) : console.log(`Listening on ${port}`)
      )
    })
)

run().runReader(env)
