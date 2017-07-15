exports.Maybe = require('./maybe_monad')
exports.Reader = require('./reader_monad')
exports.Writer = require('./writer_monad')
exports.State = require('./state_monad')

const mdo = (gen) => {
  const g = gen()
  const step = value => {
    const result = g.next(value)
    return result.done
      ? result.value
      : result.value.chain(step)
  }
  return step()
}

exports.Monad = {
  do: mdo
}
