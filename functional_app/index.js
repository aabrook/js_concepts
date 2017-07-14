const readline = require('readline-sync')
const { on, onAny, emit } = require('../functional_events')
const { assign } = Object

const AlmostState = ([l, r]) => ({
  chain: (f) => f([l, r]),
  map: (f) => AlmostState(f([l, r]))
})
AlmostState.of = (init) => AlmostState([init, init])

let eventStore = []
const print = ([message, state]) => ([console.log(message), state])

const printTasks = ([v, s]) => AlmostState(print([s.tasks.join('\n'), s]))
const quit = () => process.exit(0)

const addTask = ([task, state]) => [task, assign({}, state, { tasks: [...state.tasks, task] })]
const promptAndAddTask = ([v, s]) => (
  AlmostState(print(['Task:', s]))
  .chain(([_v, s]) => AlmostState(addTask([readline.prompt(), s])))
  .chain((s) => emit('addedTask', AlmostState(s)))
)

const viewEvents = ([v, s]) => AlmostState(print([eventStore, s]))

const promptResponses = ({
  'y': promptAndAddTask,
  'n': printTasks,
  'v': viewEvents,
  'q': quit
})

const initialPrompt = (l) => (
  promptResponses[l]
  ? promptResponses[l]
  : ([v, s]) => AlmostState(print([`Failed to find your selection ${v}`, s]))
)

const buildTaskList = (st) => (
  st.chain(([_v, s]) => AlmostState(print(['Add task? y/n/v/q', s])))
  .chain(([v, s]) => AlmostState([readline.prompt(), s]))
  .chain(([v, s]) => emit(`selected${v.toUpperCase()}`, AlmostState([v, s])))
  .chain(([v, s]) => initialPrompt(v)([v, s]))
)

const main = (st) => (
  main(buildTaskList(st))
)

main(
  AlmostState.of({ tasks: [], anyListeners: [], listeners: {} })
  .chain((s) => on('addedTask', ([v, s]) => console.log(`Added --- ${v} ---`), AlmostState(s)))
  .chain((s) => on('selectedQ', ([v, s]) => console.log('Bye bye'), AlmostState(s)))
  .chain((s) => on('selectedY', ([v, s]) => console.log('Tasks so far', s.tasks), AlmostState(s)))
  .chain((s) => onAny(([v, s]) => (eventStore = [...eventStore, v]), AlmostState(s)))
)
