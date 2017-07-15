const Nothing = () => ({
  map: (f) => Nothing(),
  chain: (f) => Nothing(),
  ap: (f) => Nothing(),
  extract: () => null,
  fork: (_s, f) => f(),
  inspect: () => 'Nothing'
})

const Just = (v) => ({
  map: (f) => Just(f(v)),
  chain: (f) => f(v),
  ap: (f) => Just(v(f.extract())),
  extract: () => v,
  fork: (s, _f) => s(v),
  inspect: () => `Just(${v})`
})

const Maybe = () => {}
Maybe.of = (v) => v === null || v === undefined ? Nothing() : Just(v)

module.exports = { Maybe, Just, Nothing }
