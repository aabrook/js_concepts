const { describe, it } = require('mocha')
const assert = require('assert')
const sinon = require('sinon')
const { Try } = require('../')

describe('Try', () => {
  it('should call the success when successful with the function result', () => {
    const success = (result) => assert.equal(result, 1234)
    const error = () => assert.fail('Should be success case')
    const func = () => 1234
    Try(func)(success, error)()
  })

  it('should call the error when an error occurs', () => {
    const success = (result) => assert.fail('Should have errored')
    const error = (e) => assert.equal(e.message, 'Succeeded!')
    const func = () => {
      throw new Error('Succeeded!')
    }
    Try(func)(success, error)()
  })

  it('should always call the function provided', () => {
    const func = sinon.spy()
    Try(func)(() => {}, () => {})()
    assert(func.called)
  })

  it('should be called with the the parameters provided', () => {
    const func = sinon.spy()
    Try(func)(() => {}, () => {})(1234)
    assert(func.calledWith(1234))
  })
})
