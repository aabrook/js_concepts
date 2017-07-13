const assert = require('assert')
const State = require('../state_monad')

const id = a => a

describe('State Monad', () => {
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

  it('should abide by id law', () => (
    assert.deepEqual(
      State(s => [s, s])
        .map(id)
        .runState(5),
      [5, 5]
    )
  ))

  it('should abide by composition law', () => {
    const double = a => a * 2
    const add2 = a => a + 2

    assert.deepEqual(
      State(s => [s, s])
        .map(double)
        .map(add2)
        .runState(5),
      State(s => [s, s])
        .map(x => add2(double(x)))
        .runState(5)
    )
  })

  it('should chain states together', () => (
    assert.deepEqual(
      State.of(0)
        .chain(l => State(r => [r * 2, l]))
        .runState(5),
      [10, 0]
    )
  ))

  it('should work with monad id', () => (
    assert.deepEqual(
      State.of(5)
        .chain(a => State.of(a))
        .runState(0),
      State.of(5).runState(0)
    )
  ))

  it('should return a >>= k  =  k a', () => (
    assert.deepEqual(
      State.of(5)
        .chain(s => State(ss => [s, ss]))
        .runState(6),
      (s => ss => [s, ss])(5)(6)
    )
  ))

  it('should extract the state function', () => (
    assert.equal(
      State(id).extract(),
      id
    )
  ))

  it('should apply the function in the state to the state provided', () => (
    assert.deepEqual(
      State.of(a => a + 1).ap(State.of(0)).runState(4),
      [1, 4]
    )
  ))

  it('should abide by applicative id law', () => (
    assert.deepEqual(
      State.of(id).ap(State(s => [s, s])).runState(4),
      [4, 4]
    )
  ))

  it('should abide by applicative homomorphism law', () => {
    const double = a => a * 2
    assert.deepEqual(
      State.of(double)
        .ap(State.of(5))
        .runState(3),
      State.of(double(5))
        .runState(3)
    )
  })

  it('should abide by applicative composition law', () => {
    const double = a => a * 2
    const add2 = a => a + 2
    assert.deepEqual(
      State.of(a => b => x => a(b(x)))
        .ap(State.of(double))
        .ap(State.of(add2))
        .ap(State.of(5))
        .runState(0),
      State.of(double(add2(5)))
        .runState(0)
    )
  })
})
