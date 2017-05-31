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

const functionalStore = ({state = {}, reducers = [], observers = []}) => ({
  addObserver: (observer) => functionalStore({state, reducers, observers: [...observers, observer]}),
  addReducer: (reducer) => functionalStore({state, reducers: [...reducers, reducer], observers}),
  dispatch: (action) => functionalStore(update({state, reducers, observers})(action)),
  state,
  reducers,
  observers
})

const update = (observable) => (action) => {
  const newState = updateState(observable, action)
  const newObservable = assign({}, observable, {state: newState})
  observable.observers.forEach(fn => fn(observable.state, newObservable.state))

  return newObservable
}

const updateState = ({ state, reducers }, action) =>
  reducers.reduce((state, reducer) => reducer(state, action), state)

module.exports = {
  createStore, functionalStore
}
