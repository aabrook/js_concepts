const { assign } = Object

function Store (state, reducers, observers) {
  this.observers = observers
  this.reducers = reducers
  this.state = state
}

Store.prototype.store = function () {
  return {
    observers: this.observers,
    reducers: this.reducers,
    state: this.state
  }
}

Store.prototype.dispatch = function (action) {
  const {observers, reducers, state} = update(this.store())(action)
  this.observers = observers
  this.reducers = reducers
  this.state = state

  return this
}

const createStore = (state = {}, reducers = [], observers = []) => {
  return new Store(state, reducers, observers)
}

const functionalStore = (state = {}, reducers = [], observers = []) => ({
  state, reducers, observers
})

const updateState = (observable, action) => observable.reducers.reduce((state, reducer) => reducer(state, action), observable.state)

const update = (observable) => (action) => {
  const newState = updateState(observable, action)
  const newObservable = assign({}, observable, {state: newState})
  observable.observers.forEach(fn => fn(observable.state, newObservable.state))

  return newObservable
}

module.exports = {
  createStore, functionalStore, update
}
