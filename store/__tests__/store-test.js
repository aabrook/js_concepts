const assert = require('assert')
const { describe, it } = require('mocha')
const { createStore, functionalStore } = require('../')
const { assign } = Object

describe('store', () => {
  describe('createStore', () => {
    it('should use the reducers to update state', () => {
      const initialState = {output: []}
      const fizz = (i) => (i % 3 === 0 ? 'fizz' : '')
      const buzz = (i) => (i % 5 === 0 ? 'buzz' : '')
      const buzzer = (i) => fizz(i) + buzz(i) || i
      const fizzBuzz = (state, index) => assign({}, state, {output: [...state.output, buzzer(index)]})

      const store = createStore(initialState, [fizzBuzz])

      Array.from({length: 10}).forEach((_un, i) => store.dispatch(i + 1))
      assert.deepEqual(store.store().state, {
        output: [
          1,
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
      const inc = (state, action) => action === 'inc' ? assign({}, state, { output: state.output + 1 }) : state
      const dec = (state, action) => action === 'dec' ? assign({}, state, { output: state.output - 1 }) : state
      const store = createStore({ output: 0 }, [inc, dec])

      store.dispatch('inc')
      store.dispatch('inc')
      store.dispatch('dec')
      store.dispatch('inc')
      assert.equal(store.store().state.output, 2)
    })
  })

  describe('functionalStore', () => {
    it('should use the reducers to update state', () => {
      const initialState = {output: []}
      const fizz = (i) => (i % 3 === 0 ? 'fizz' : '')
      const buzz = (i) => (i % 5 === 0 ? 'buzz' : '')
      const buzzer = (i) => fizz(i) + buzz(i) || i
      const fizzBuzz = (state, index) => assign({}, state, {output: [...state.output, buzzer(index)]})

      const store = functionalStore({state: initialState, reducers: [fizzBuzz]})

      const result = Array.from({ length: 10 }).reduce((s, _un, i) => s.dispatch(i + 1), store)
      assert.deepEqual(result.state, {
        output: [
          1,
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
      const result = store.dispatch(0)
      assert.deepEqual(result.state, {})
    })

    it('should call all reducers', () => {
      const inc = (state, action) => action === 'inc' ? assign({}, state, { output: state.output + 1 }) : state
      const dec = (state, action) => action === 'dec' ? assign({}, state, { output: state.output - 1 }) : state
      const store = functionalStore({state: { output: 0 }, reducers: [inc, dec]})

      let state = store.dispatch('inc')
      state = state.dispatch('inc')
      state = state.dispatch('dec')
      state = state.dispatch('inc')
      assert.equal(state.state.output, 2)
    })
  })
})
