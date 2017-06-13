const { describe, it } = require('mocha')
const assert = require('assert')
const { prepend, words, unwords } = require('../')

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

  it('should split a string on \' \'', () => (
    assert.deepEqual(words('hello world'), ['hello', 'world'])
  ))

  it('should join an array with \' \'', () => (
    assert.deepEqual(unwords(['hello', 'world']), 'hello world')
  ))
})
