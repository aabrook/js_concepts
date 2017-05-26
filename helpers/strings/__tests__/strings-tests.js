const { describe, it } = require('mocha')
const assert = require('assert')
const { prepend } = require('../')

describe('string helpers', () => {
  it('should add the same character to the front', () => (
    assert.equal(prepend('0', 8, 'abc'), '00000abc')
  ))

  it('should not prepend if the string is the same length', () => (
    assert.equal(prepend('0', 3, 'abc'), 'abc')
  ))

  it('should not prepend if the string is the longer', () => (
    assert.equal(prepend('0', 3, 'abcd'), 'abcd')
  ))
})
