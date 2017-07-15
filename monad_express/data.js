const uuid = require('uuid/v4')
const { assign } = Object
const { Maybe } = require('../monads')
const { Just, Nothing } = Maybe

let data = {
  [uuid()]: { name: 'jo', job: 'plumber' },
  [uuid()]: { name: 'bob', job: 'builder' }
}
const byId = (id) => Just(data[id]).chain(d => d ? Just(d) : Nothing())
const insert = (payload) => assign(data, { [uuid()]: payload })

module.exports = ({
  byId,
  all: data,
  insert
})
