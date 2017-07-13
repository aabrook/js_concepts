const assert = require('assert')
const State = require('../state_monad')
const laws = require('./monad_laws')

const id = a => a

describe('State Monad', () => {
  laws(State, m => m.runState(5))

  it('should run and return the result of the state function', () => (
    assert.deepEqual(
      State(s => [s, s * 2]).runState(5),
      [5, 10]
    )
  ))

  it('should create a default state with the value in the left', () => (
    assert.deepEqual(
      State.of(5).runState(8),
      [5, 8]
    )
  ))

  it('should put the state in the right side of the tuple', () => (
    assert.deepEqual(
      State.of(5)
        .put(10)
        .map(s => {
          assert.equal(s, 5)
          return s
        })
        .runState(5),
      [5, 10]
    )
  ))

  it.only('should return the final state when executed', () => (
    assert.equal(
      State.of('hello')
      .chain(s => State(state => [s.toUpperCase(), s.concat(', ').concat(state)]))
      .exec('Jo'),
      'hello, Jo'
    )
  ))

  it.only('should return the final result of the functions', () => (
      State.of('hello')
      .chain(s => State(state => [s.toUpperCase(), s.concat(', ').concat(state)]))
      .eval('Jo'),
      'HELLO'
  ))

  it('should return the right side of the tuple', () => (
    assert.deepEqual(
      State.of(5).get().map(s => {
        assert.equal(s, 10)
        return s
      }).runState(10),
      [10, 10]
    )
  ))

  it('should use map on the first tuple pair', () => (
    assert.deepEqual(
      State.of(2)
        .map(a => a + 4)
        .runState(5),
      [6, 5])
  ))

  it('should chain states together', () => (
    assert.deepEqual(
      State.of(0)
        .chain(l => State(r => [r * 2, l]))
        .runState(5),
      [10, 0]
    )
  ))

  it('should apply the function in the state to the state provided', () => (
    assert.deepEqual(
      State.of(a => a + 1).ap(State.of(0)).runState(4),
      [1, 4]
    )
  ))
})
