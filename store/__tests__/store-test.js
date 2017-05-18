const assert = require('assert')
const { createStore, functionalStore, update } = require('../')
const { assign } = Object

describe('store', () => {
  describe('createStore', () => {
    it('should not change initial state', () => {
      const initialState = {total: 0}
      const reducer = (state, action) => ({
        total: state.total + 1
      })
      const store = createStore(initialState, [reducer])

      store.dispatch(0)

      assert.deepEqual({total: 0}, initialState)
    })

    it('should use the reducers to update state', () => {
      const initialState = {output: []}
      const fizz = (i) => (i % 3 == 0 ? 'fizz' : '')
      const buzz = (i) => (i % 5 == 0 ? 'buzz' : '')
      const buzzer = (i) => fizz(i) + buzz(i) || i
      const fizzBuzz = (state, index) => assign({}, state, {output: [...state.output, buzzer(index)]})

      const store = createStore(initialState, [fizzBuzz])

      Array.from({length: 10}).forEach((_un, i) => store.dispatch(i + 1))
      assert.deepEqual(store.store().state, {
        output:[1,
          2,
          'fizz',
          4,
          'buzz',
          'fizz',
          7,
          8,
          'fizz',
          'buzz'
        ]
      })
    })

    it('should not allow observers to update state', () => {
      const observer = (oldState, newState) => (
        newState = assign({}, newState, {whatsThis: 'error'})
      )
      const store = createStore({}, [], [observer])
      store.dispatch(0)
      assert.deepEqual(store.store().state, {})
    })

    it('should provide new and old state to the observers', () => {
      let observed = false
      const reducer = (state, _action) => ({newState: 'sup'})
      const observer = (oldState, newState) => {
        observed = true

        assert.deepEqual(oldState, { oldState: 'sup' })
        assert.deepEqual(newState, { newState: 'sup' })
      }
      const store = createStore({oldState: 'sup'}, [reducer], [observer])
      store.dispatch(0)

      assert.equal(observed, true)
    })

    it('should call all reducers', () => {
      const inc = (state, action) => action == 'inc' ? assign({}, state, { output: state.output + 1 }) : state
      const dec = (state, action) => action == 'dec' ? assign({}, state, { output: state.output - 1 }) : state
      const store = createStore({ output: 0 }, [inc, dec])

      store.dispatch('inc')
      store.dispatch('inc')
      store.dispatch('dec')
      store.dispatch('inc')
      assert.equal(store.store().state.output, 2)
    })
  })

  describe('functionalStore', () => {
    it('should not change initial state', () => {
      const initialState = {total: 0}
      const reducer = (state, action) => ({
        total: state.total++
      })
      const store = functionalStore(initialState, [reducer])

      update(store, 0)

      assert.deepEqual({total: 0}, initialState)
    })

    it('should use the reducers to update state', () => {
      const initialState = {output: []}
      const fizz = (i) => (i % 3 == 0 ? 'fizz' : '')
      const buzz = (i) => (i % 5 == 0 ? 'buzz' : '')
      const buzzer = (i) => fizz(i) + buzz(i) || i
      const fizzBuzz = (state, index) => assign({}, state, {output: [...state.output, buzzer(index)]})

      const store = functionalStore(initialState, [fizzBuzz])

      const result = Array.from({ length: 10 }).reduce((s, _un, i) => update(s)(i + 1), store)
      assert.deepEqual(result.state, {
        output:[1,
          2,
          'fizz',
          4,
          'buzz',
          'fizz',
          7,
          8,
          'fizz',
          'buzz'
        ]
      })
    })

    it('should not allow observers to update state', () => {
      const observer = (oldState, newState) => (
        newState = assign({}, newState, {whatsThis: 'error'})
      )
      const store = functionalStore({}, [], [observer])
      const result = update(store)(0)
      assert.deepEqual(result.state, {})
    })

    it('should call all reducers', () => {
      const inc = (state, action) => action == 'inc' ? assign({}, state, { output: state.output + 1 }) : state
      const dec = (state, action) => action == 'dec' ? assign({}, state, { output: state.output - 1 }) : state
      const store = functionalStore({ output: 0 }, [inc, dec])

      let state = update(store)('inc')
      state = update(state)('inc')
      state = update(state)('dec')
      state = update(state)('inc')
      assert.equal(state.state.output, 2)
    })
  })
})
