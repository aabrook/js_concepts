const error = () => {
  throw new Error('not implemented')
}

const Reader = (func) => ({
  runReader: (env) => func(env),
  map: (f) => Reader(env => {
    return f(func(env))
  }),
  chain: (f) => Reader(env => {
    return f(func(env)).runReader(env)
  }),
  ask: () => Reader(env => env),
  ap: (v) => error(),
  extract: error,
  inspect: () => `Reader(${func})`
})

Reader.of = a => Reader(_ => a)
Reader.ask = () => Reader(env => env)

module.exports = Reader
