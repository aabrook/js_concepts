const assert = require('assert')
const Writer = require('../writer_monad')
const laws = require('./monad_laws')

describe('WriterMonad', () => {
  laws(Writer, m => m.runWriter())

  it('should return the function result and log when run', () => (
    assert.deepEqual(
      Writer(['left', 'log']).runWriter(),
      ['left', 'log']
    )
  ))

  it('should create a default writer', () => (
    assert.deepEqual(
      Writer.of('abc').runWriter(),
      ['abc', '']
    )
  ))

  it('should map over the function', () => (
    assert.deepEqual(
      Writer.of('abc')
        .map(l => {
          assert.equal(l, 'abc')
          return l
        })
        .runWriter(),
      ['abc', '']
    )
  ))

  it('should chain over the monad', () => (
    assert.deepEqual(
      Writer.of('abc')
      .chain(s => Writer([s.concat('def'), 'Data']))
      .runWriter(),
      ['abcdef', 'Data']
    )
  ))
})
