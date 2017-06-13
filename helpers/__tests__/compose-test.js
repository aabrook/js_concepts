const { describe, it } = require('mocha')
const assert = require('assert')
const sinon = require('sinon')
const { $, compose, curry, flip, id, map } = require('../')

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

  describe('flip', () => {
    it('should flip a curried function\'s args', () => (
      assert(flip(a => b => a * a * b)(3)(1), 3)
    ))
  })

  describe('curry', () => {
    it('should evaluate when enough arguments are provided', () => {
      const sum3 = (a, b, c) => a + b + c
      const add1 = curry(sum3)(1)
      assert.equal(typeof add1(2), 'function')
      assert.equal(add1(2, 3), 6)
    })
  })

  describe('map', () => {
    it('should apply the function to all input', () => (
      assert.deepEqual(map(a => a * a, [1, 2, 3, 4]), [1, 4, 9, 16])
    ))

    it('should not break with an empty input', () => (
      assert.deepEqual(map(id, []), [])
    ))
  })
})
