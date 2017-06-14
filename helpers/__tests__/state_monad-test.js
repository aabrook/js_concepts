const assert = require('assert')
const State = require('../state_monad')
const { assign } = Object

const id = a => a

describe('State Monad', () => {
  it('should create a default State with of', () => (
    State.of({my: 'test'})
    .map(([v, s]) => assert.deepEqual(s, {my: 'test'}) && assert.deepEqual(v, {}))
  ))

  it('should chain States', () => (
    State.of({})
    .chain(([a, s]) => State([a, assign({}, {hello: 'world'}, s)]))
    .chain(([a, s]) => State([a, assign({}, {nextSet: 'Yay'}, s)]))
    .map(([a, s]) =>
      assert.deepEqual(s, {hello: 'world', nextSet: 'Yay'}) && assert.deepEqual(a, {})
    )
  ))

  it('should map', () => (
    State.of({})
    .map(([a, s]) => ([a, assign({}, {hello: 'world'}, s)]))
    .map(([a, s]) => ([a, assign({}, {nextSet: 'Yay'}, s)]))
    .map(([a, s]) =>
      assert.deepEqual(s, {hello: 'world', nextSet: 'Yay'}) && assert.deepEqual(a, {})
    )
  ))

  it('should match id laws', () => (
    State.of('abcd')
      .map(id)
      .map(s => {
        id(State.of('abcd'))
          .map(s2 =>
            assert.deepEqual(s, s2)
          )

        return s
      })
  ))

  it('should match composition laws', () => {
    const f = ([x, s]) => [assign({}, x, {a: 'a'}), assign({}, s, {b: 'b'})]
    const g = ([x, s]) => [assign({}, x, {c: 'c'}), assign({}, s, {d: 'd'})]
    State.of({})
      .map(f)
      .map(g)
      .map(s => {
        State.of({})
          .map(x => f(g(x)))
          .map(x => assert.deepEqual(s, x))

        return s
      })
  })

  it('should be able to join states', () => (
    State.of({ a: 'b' })
      .join(State.of({ b: 'c' }))
      .map(s => assert.deepEqual(s, [{}, { a: 'b', b: 'c' }]))
  ))
})
