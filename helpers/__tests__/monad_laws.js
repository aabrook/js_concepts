const assert = require('assert')

const id = a => a

module.exports = (M, run = id) => {
  it(`should abide by functor id law`, () => (
    assert.deepEqual(
      run(M.of('abc')
      .map(id)),
      run(M.of('abc'))
    )
  ))

  it(`should abide by composition law`, () => {
    const double = a => a * 2
    const add2 = a => a + 2

    assert.deepEqual(
      run(M.of(5)
        .map(double)
        .map(add2)),
      run(M.of(5)
        .map(x => add2(double(x))))
    )
  })

  it('should work with monad id', () => (
    assert.deepEqual(
      run(M.of(5)
        .chain(a => M.of(a))),
      run(M.of(5))
    )
  ))

  it('should return a >>= k  =  k a', () => (
    assert.deepEqual(
      run(M.of(5)
        .chain(s => M.of(s * 4))),
      run(M.of(5 * 4))
    )
  ))
}

