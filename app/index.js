const express = require('express')
const parser = require('body-parser')
const cors = require('cors')
const { createStore } = require('../store')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('events', null, null, {
  dialect: 'sqlite',
  storage: './events/db/store/development/events.db'
})
const { assign } = Object
const { log } = require('../helpers')

const addedTask = (state, { type, task }) =>
  type === 'addedTask' ? assign({}, state, { tasks: [...state.tasks, { task }] }) : state

const deletedTask = (state, { type, task }) =>
  type === 'deletedTask'
    ? assign({}, state, { tasks: state.tasks.filter((t) => t.task.id !== parseInt(task.id)) })
    : state

const myStore = createStore({tasks: []}, [addedTask, deletedTask])
const taskState = log((...args) => console.log('state', ...args))((event) =>
  myStore.dispatch({type: event.type, task: { text: event.task, id: event.id }}).state
)

const eventStore = require('../events/src')({ sequelize, projections: { taskState } })
const config = {
  port: 8001
}

const app = express()
app.use(cors())
app.use(parser.json())

app.use('/tasks', require('./routes')({ store: eventStore, state: () => myStore.state, projections: { taskState } }))
app.use('/events', require('./routes/events')({ store: eventStore, state: () => myStore.state, projections: { taskState } }))
eventStore.reproject({ projections: { taskState } })

app.listen(config.port, (err) => err ? console.error(err) : console.log(`Started on port ${config.port}`))
