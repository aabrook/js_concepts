const assert = require('assert')
const laws = require('./monad_laws')
const Reader = require('../reader_monad')

describe('Reader Monad', () => {
  laws(Reader, r => r.runReader())

  it('should provide both current and environment to the function', () => (
    assert.equal(
      Reader.of('abc').withEnv((v, e) => v.concat(e)).runReader('def'),
      'abcdef'
    )
  ))

  it('should not change the environment', () => (
    assert.equal(
      Reader.of('abc').withEnv((v, e) => e.concat(v)).chain(v =>
        Reader.ask().map(e => {
          assert.equal(e, 'def')
          return v
        })
      ).runReader('def'),
      'defabc'
    )
  ))

  it('should run the reader and return env', () => (
    assert.deepEqual(
      Reader(_ => 'name').runReader('names'),
      'name'
    )
  ))

  it('should expose the env to the map', () => (
    assert.deepEqual(
      Reader.of('jo').map(a => {
        assert.equal(a, 'jo')
        return a
      }).runReader('names'),
      'jo'
    )
  ))

  it('should extract the function', () => (
    assert.equal(Reader.of('Jo').extract()(), 'Jo')
  ))
})
