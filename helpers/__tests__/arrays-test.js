const assert = require('assert')
const { cycle, replicate, zip, zipWith } = require('../arrays')

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

  it('should append to the array a cycling recursion to length', () => (
    assert.deepEqual(cycle(5)([1, 2]), [1, 2, 1, 2, 1])
  ))

  it('should not care if there\'s only 1 array value', () => (
    assert.deepEqual(cycle(5, [1]), [1, 1, 1, 1, 1])
  ))

  it('should assign undefined when the array is empty', () => (
    assert.deepEqual(cycle(5)([]), [undefined, undefined, undefined, undefined, undefined])
  ))

  it('should repeat the input 5 times', () => (
    assert.deepEqual(replicate(5, 1), [1, 1, 1, 1, 1])
  ))

  it('should curry replicate', () => (
    assert.deepEqual(replicate(5)(1), [1, 1, 1, 1, 1])
  ))

  it('should return an empty array with 0 replications', () => (
    assert.deepEqual(replicate(0, 1), [])
  ))
})
