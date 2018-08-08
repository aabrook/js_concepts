const assert = require('assert')
const laws = require('./monad_laws')
const Continuation = require('../continuation_monad')

describe('Continuation Monad', () => {
  laws(Continuation, c => c.run(a => a))

  it('should chain with timeout and map', (done) => {
    let sequence = false
    const split = s => s.split('')
    const expecting = (v) => {
      assert.deepEqual(v, 'A-B-C')
      assert(sequence)
      done()
    }

    Continuation(done => done('abc'))
      .chain(v =>
        Continuation(done => setTimeout(_ => done(v.toUpperCase()), 10))
      )
      .map(split)
      .chain(v =>
        Continuation(done => setTimeout(_ => done(v.join('-'), 10)))
      )
      .run(expecting)

    sequence = true
  })
})
