const assert = require('assert')
const laws = require('./monad_laws')
const Reader = require('../reader_monad')

describe('Reader Monad', () => {
  laws(Reader, r => r.runReader())

  it('should run the writer and return then env', () => (
    assert.deepEqual(
      Reader(_ => 'name').runReader(),
      'name'
    )
  ))

  it('should expose the first tuple to the map', () => (
    assert.deepEqual(
      Reader.of('jo').map(a => {
        assert.equal(a, 'jo')
        return a
      }).runReader(),
      'jo'
    )
  ))

  it('should extract the function', () => (
    assert.equal(Reader.of('Jo').extract()(), 'Jo')
  ))
})
