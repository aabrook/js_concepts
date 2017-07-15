const Reader = (func) => ({
  runReader: (env) => func(env),
  map: (f) => Reader(env =>
    f(func(env))
  ),
  chain: (f) => Reader(env =>
    f(func(env)).runReader(env)
  ),
  ap: (v) => Reader(env => {
    const f = func(env)
    const r = v.runReader(env)
    return f(r)
  }),
  withEnv: (f) => Reader(env =>
    f(func(env), env)
  ),
  extract: () => func,
  inspect: () => `Reader(${func})`
})

Reader.of = a => Reader(_ => a)
Reader.ask = () => Reader(env => env)
Reader.run = (r, env) => r.hasOwnProperty('runReader') ? r.runReader(env) : r

module.exports = Reader
