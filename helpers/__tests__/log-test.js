const { describe, it } = require('mocha')
const assert = require('assert')
const sinon = require('sinon')
const { log } = require('../')

describe('log', () => {
  const sum = (...args) => args.reduce((acc, n) => acc + n, 0)
  it('should log all arguments', () => {
    const logger = sinon.spy()
    log(logger)(sum)(1, 2, 3, 4)

    assert.deepEqual(logger.getCall(0).args, ['args', 1, 2, 3, 4])
    assert.deepEqual(logger.getCall(1).args, ['result', 10])
  })

  it('should return the result of the function logged', () => {
    const logger = () => {}
    const func = sinon.spy(sum)
    const result = log(logger)(func)(1, 2, 3, 4)

    assert.equal(result, 10)
  })
})
