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
  listen: (f) => {
    const r = f(a)
    return Writer([r, s.concat(r)])
  },
  extract: () => ([a, s]),
  inspect: () => `Writer(${[a, s]})`
})

Writer.of = a => Writer([a, ''])
Writer.listen = m => run => {
  const r = run(m)
  return Writer([r, r])
}

module.exports = Writer
