const Nothing = () => ({
  concat: (f) => f,
  map: (f) => Nothing(),
  chain: (f) => Nothing(),
  ap: (f) => Nothing(),
  extract: () => null,
  fork: (_s, f) => f(),
  inspect: () => 'Nothing'
})

const Just = (v) => ({
  concat: (f) => f.fork(fv => Just(v.concat(fv)), _ => Just(v)),
  map: (f) => Just(f(v)),
  chain: (f) => f(v),
  ap: (f) => Just(v(f.extract())),
  extract: () => v,
  fork: (s, _f) => s(v),
  inspect: () => `Just(${v})`
})

const Maybe = () => {}
Maybe.of = (v) => v === null || v === undefined ? Nothing() : Just(v)

const maybe = def => f => m => m.map(f).fork(a => a, _ => def)

module.exports = { Maybe, maybe, Just, Nothing }
