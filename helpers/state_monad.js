// s -> (a, s)
const State = (st) => ({
  runState: (x) => st(x),
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
  get: () => State(s => {
    const [_, r] = State(st).runState(s)
    return [r, r]
  }),
  put: (s) => State(ss => {
    const [l , _] = State(st).runState(ss)
    return [l, s]
  }),
  extract: () => (st),
  inspect: () => `State(${st})`
})

State.of = (x) => State((s) => [x, s])

module.exports = State
