const Nothing = () => ({
  concat: (f, _) => f,
  map: (f) => Nothing(),
  chain: (f) => Nothing(),
  ap: (f) => Nothing(),
  alt: (other) => other,

  extract: () => null,
  fork: (_s, f) => f(),
  inspect: () => 'Nothing'
})

const Just = (v) => ({
  concat: (f, concat = (a, b) => a.concat(b)) =>
    f.fork(fv => Just(concat(v, fv)), _ => Just(v)),
  map: (f) => Just(f(v)),
  chain: (f) => f(v),
  ap: (f) => f.chain(val => Just(v(val))),
  alt: (_other) => Just(v),
  extract: () => v,
  fork: (s, _f) => s(v),
  inspect: () => `Just(${v})`
})

const Maybe = () => {}
Maybe.of = (v) => v === null || v === undefined ? Nothing() : Just(v)

const maybe = def => f => m => m.map(f).fork(a => a, _ => def)

module.exports = { Maybe, maybe, Just, Nothing }
