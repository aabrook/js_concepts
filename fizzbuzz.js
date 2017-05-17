const { assign } = Object
const {
  createStore
} = require('./store')

const initialState = { output: [], last: '' }
const fizz = (i) => (i % 3 == 0 ? 'fizz' : '')
const buzz = (i) => (i % 5 == 0 ? 'buzz' : '')
const buzzer = (i) => fizz(i) + buzz(i) || i

const fizzBuzz = (state, index) => assign({}, state, {output: [...state.output, buzzer(index)], last: buzzer(index)})
const logger = (_old, {last}) => console.log(last)

const store = createStore(initialState, [fizzBuzz], [logger])

const main = (store, n = 0) => (
  n <= 100 ? main(store.dispatch(n), n + 1) : store
)

main(store, 1)
