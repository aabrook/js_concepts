const { assign } = Object

const State = ([v, x] = [{}, {}]) => ({
  chain: (f) => f([v, x]),
  map: (f) => State(f([v, x])),
  concat: ([vv, xx]) => State([vv, assign({}, x, xx)]),
})

State.of = (x => State([{}, x]))

module.exports = State
