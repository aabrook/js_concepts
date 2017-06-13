const assert = require('assert')
const { zip, zipWith } = require('../arrays')

describe('array helpers', () => {
  it('should merge arrays with zip', () => (
    assert.deepEqual(zip([1, 2, 3], [4, 5, 6]), [[1, 4], [2, 5], [3, 6]])
  ))

  it('should not break with undefined', () => (
    assert.deepEqual(zip([1, 2, 3], [4]), [[1, 4], [2, undefined], [3, undefined]])
  ))

  it('should merge arrays using the function provided', () => (
    assert.deepEqual(zipWith((a, b) => a + b)([1, 2, 3], [4, 5, 6]), [5, 7, 9])
  ))
})
