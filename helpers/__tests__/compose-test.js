const { describe, it } = require('mocha')
const assert = require('assert')
const sinon = require('sinon')
const { $, compose } = require('../')

describe('function helpers', () => {
  describe('compose', () => {
    it('should produce a function that parses through all functions in order', () => {
      const squared = sinon.spy(a => a * a)
      const plusOne = sinon.spy(a => a + 1)
      const func = compose(squared, plusOne)

      assert.equal(func(2), 9)
      sinon.assert.callOrder(plusOne, squared)
    })

    it('should not fail with one function', () => {
      const id = sinon.spy(a => a)
      const func = compose(id)

      assert.equal(func(2), 2)
    })
  })

  describe('$', () => {
    it('should apply the function to the arguments provided', () => (
      assert.equal($(a => a + 2)(2), 4)
    ))

    it('should apply the function to the arguments provided - in map', () => (
      assert.deepEqual([1, 2, 3, 4, 5].map($(a => a * a)), [1, 4, 9, 16, 25])
    ))
  })
})
