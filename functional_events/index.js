const { assign } = Object

const dropItem = (a, i) => a.filter(fn => fn !== i)

module.exports = {
  emit: (a, s) => s.map(([v, st]) => {
    (st.listeners[a] || []).concat(st.anyListeners || []).map(f => f([v, st]))
    return [v, st]
  }),
  on: (a, e, s) => s.map(([_, st]) => (
    [e, assign({}, st, { listeners: assign({}, st.listeners, { [a]: [...(st.listeners[a] || []), e] }) })]
  )),
  onAny: (e, s) => s.map(([_, st]) => (
    [e, assign({}, st, { anyListeners: [...(st.anyListeners || []), e] })]
  )),
  remove: (a, e, s) => s.map(([_, st]) => (
    [e, assign({}, st, { listeners: { [a]: dropItem(st.listeners[a], e) } })]
  ))
}
