const readline = require('readline-sync')
const State = require('../helpers/state_monad')
const { on, emit } = require('../functional_events')
const { assign } = Object

const print = ([message, state]) => ([console.log(message), state])

const printTasks = ([v, s]) => State(print([s.tasks.join('\n'), s]))
const quit = () => process.exit(0)

const addTask = ([task, state]) => [task, assign({}, state, { tasks: [...state.tasks, task] })]
const promptAndAddTask = ([v, s]) => (
  State(print(['Task:', s]))
  .chain(([_v, s]) => State(addTask([readline.prompt(), s])))
  .chain((s) => emit('addedTask', State(s)))
)

const promptResponses = ({
  'y': promptAndAddTask,
  'n': printTasks,
  'q': quit
})

const initialPrompt = (l) => (
  promptResponses[l]
  ? promptResponses[l]
  : ([v, s]) => State(print([`Failed to find your selection ${v}`, s]))
)

const buildTaskList = (st) => (
  st.chain(([_v, s]) => State(print(['Add task? y/n/q', s])))
  .chain(([v, s]) => State([readline.prompt(), s]))
  .chain(([v, s]) => emit(`selected${v.toUpperCase()}`, State([v, s])))
  .chain(([v, s]) => initialPrompt(v)([v, s]))
)

const main = (st) => (
  main(buildTaskList(st))
)
main(
  State.of({ tasks: [], listeners: {} })
  .chain((s) => on('addedTask', ([v, s]) => console.log(`Added --- ${v} ---`), State(s)))
  .chain((s) => on('selectedQ', ([v, s]) => console.log('Bye bye'), State(s)))
)
