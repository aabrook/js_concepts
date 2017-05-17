const { assign } = Object
const {
  createStore
} = require('./observer')

const initialState = { total: 0, transactions: [] }
const logger = (_oldState, newState) => console.log(newState)
const increment = (state, action) => (
  action.type == 'INC' ?
    assign({}, state, { total: state.total + action.amount, transactions: [...state.transactions, action] }) :
    state
)

const decrement = (state, action) => (
  action.type == 'DEC' ?
    assign({}, state, { total: state.total - action.amount, transactions: [...state.transactions, action] }) :
    state
)

const store = createStore(initialState, [increment, decrement], [logger])

const main = (observable, n = 0) => (
  n > 0 ? main(observable.dispatch({ type: 'INC', amount: n }), n - 1) : observable
)

const main2 = (observable, count) => (
  Array.from({ length: count }).reduce((s, _un, i) =>
    s.dispatch(i % 3 == 0 ? {type: 'DEC', amount: i} : {type: 'INC', amount: i})
  , observable)
)

main(store, 10)
console.log(main2(store, 10).store().state)
