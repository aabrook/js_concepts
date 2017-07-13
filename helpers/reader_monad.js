const error = () => {
  throw new Error('not implemented')
}

const Reader = (func) => ({
  runReader: (env) => func(env),
  map: (f) => Reader(env =>
    f(func(env))
  ),
  chain: (f) => Reader(env =>
    f(func(env)).runReader(env)
  ),
  ap: (v) => error(),
  extract: () => func,
  inspect: () => `Reader(${func})`
})

Reader.of = a => Reader(_ => a)
Reader.ask = () => Reader(env => env)

module.exports = Reader
