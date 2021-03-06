const assert = require('assert')
const laws = require('./monad_laws')
const { maybe, Just, Maybe, Nothing } = require('../maybe_monad')

describe('Maybe', () => {
  laws(Maybe, a => a.fork(b => b, c => c))

  it('will do fizz buzz with concat!', () => {
    const fizz = n => n % 3 === 0 ? Just('Fizz') : Nothing()
    const buzz = n => n % 5 === 0 ? Just('Buzz') : Nothing()
    const run = n => fizz(n).concat(buzz(n)).fork(a => a, _ => n)

    assert.equal(run(3), 'Fizz')
    assert.equal(run(5), 'Buzz')
    assert.equal(run(13), 13)
    assert.equal(run(15), 'FizzBuzz')
  })

  it('should default to a Just monad', () => (
    Maybe.of(5).fork((v) => assert.equal(v, 5), () => assert.fail(new Error('Not a Just')))
  ))

  it('should default to nothing if undefined is provided', () => (
    Maybe.of(undefined).fork((v) => assert.fail('Should be nothing'), () => {})
  ))

  it('should default to nothing if null is provided', () => (
    Maybe.of(null).fork((v) => assert.fail('Should be nothing'), () => {})
  ))

  it('should not map over Nothing after chaining Just', () => (
    Maybe.of(5).chain(a => Nothing()).map(a => assert.fail(new Error('should not map')))
    .fork(() => assert.fail('Should not be Just'), () => {})
  ))

  it('should not do anything with Nothing', () => (
    Nothing().fork(() => assert.fail('Should not be a Just'), () => {})
  ))

  it('should not map anything with Nothing', () => (
    Nothing().map(() => assert.fail(new Error('should not map')))
    .fork(() => assert.fail('Should not be a Just'), () => {})
  ))

  it('should not chain anything with Nothing', () => (
    Nothing().chain(() => assert.fail(new Error('should not chain')))
    .fork(() => assert.fail('Should not be a Just'), () => {})
  ))

  describe('maybe', () => {
    it('should fallback to default with nothing', () => (
      assert.equal(
        maybe(5)(a => a + 2)(Nothing()),
        5
      )
    ))

    it('should apply the function to the value and return it', () => (
      assert.equal(
        maybe(5)(a => a + 2)(Just(10)),
        12
      )
    ))
  })
})
