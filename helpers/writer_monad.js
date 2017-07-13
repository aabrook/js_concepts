const Writer = ([a, s]) => ({
  runWriter: () => ([a, s]),
  map: (f) => Writer([f(a), s]),
  chain: (f) => {
    const [l, ss] = f(a).runWriter()
    return Writer([l, s.concat(ss)])
  },
  extract: () => ([a, s]),
  inspect: () => `Writer(${[a, s]})`
})

Writer.of = a => Writer([a, ''])

module.exports = Writer
