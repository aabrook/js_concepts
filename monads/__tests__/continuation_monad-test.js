const laws = require('./monad_laws')
const Continuation = require('../continuation_monad')

describe('Continuation Monad', () => {
  laws(Continuation, c => c.run(a => a))
})
