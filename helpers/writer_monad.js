const Writer = ([a, s]) => ({
  runWriter: () => ([a, s]),
  map: (f) => Writer([f(a), s]),
  chain: (f) => {
    const [l, ss] = f(a).runWriter()
    return Writer([l, s.concat(ss)])
  },
  ap: (v) => {
    const [l, r] = v.runWriter()
    return Writer([a(l), r.concat(s)])
  },
  extract: () => ([a, s]),
  inspect: () => `Writer(${[a, s]})`
})

Writer.of = a => Writer([a, ''])

module.exports = Writer
