const { describe, it } = require('mocha')
const assert = require('assert')
const { id } = require('../')

describe('id', () => {
  it('returns what it receives', () => (
    assert.deepEqual(id({a: 'a', b: 'b'}), {a: 'a', b: 'b'})
  ))
})
