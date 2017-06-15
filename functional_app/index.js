const readline = require('readline-sync')
const State = require('../helpers/state_monad')
const { on, emit } = require('../functional_events')
const { assign } = Object

const prompt = ([message, state]) => [console.log(message), state]
const addTask = ([task, state]) => [task, assign({}, state, { tasks: [...state.tasks, task] })]
const promptAndAddTask = ([v, s]) => (
    State(prompt(['Task:', s]))
    .chain(([_v, s]) => State(addTask([readline.prompt(), s])))
    .chain((s) => emit('addedTask', State(s)))
)
const printTasks = ([v, s]) => State([console.log(s.tasks), s])
const quit = () => console.log('Bye bye!') || process.exit(0)

const promptResponses = ({
  'y': promptAndAddTask,
  'n': printTasks,
  'q': quit
})

const buildTaskList = (st) => (
  st.chain(([_v, s]) => State(prompt(['Add task? y/n/q', s])))
  .chain(([v, s]) => State([readline.prompt(), s]))
  .chain(([v, s]) => promptResponses[v]([v, s]))
)

const main = (st = State.of({})) => (
  main(buildTaskList(st))
)

main(
  State.of({ tasks: [], listeners: {} })
  .chain((s) => on('addedTask', ([v, s]) => console.log('Added', v), State(s)))
)
