const State = (st) => ({
  // s -> (a, s)
  runState: x => st(x),
  map: (f) => State(x => {
    [a, ss] = State(st).runState(x)
    return [f(a), ss]
  }),
  chain: (f) => State(s => {
    const [l, r] = State(st).runState(s)
    return f(l).runState(r)
  }),
  ap: (state) => State(s => {
    const [f, r] = State(st).runState(s)
    const [a, u] = state.runState(r)
    return [f(a), u]
  }),
  extract: () => (st),
  inspect: () => (st)
})

State.of = (x) => State((s) => [x, s])

module.exports = State
