const express = require('express')
const parser = require('body-parser')
const { createStore } = require('../store')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('events', null, null, {
  dialect: 'sqlite',
  storage: './events/db/store/development/events.db'
})
const { assign } = Object
const { log } = require('../helpers')

const addedTask = (state, { type, task }) =>
  type === 'addedTask' ? assign({}, state, { tasks: [...state.tasks,
    { task, id: (state.tasks.reduce((acc, { id }) => id > acc ? id : acc, 0) + 1) }
  ] }) : state

const deletedTask = (state, { type, task }) =>
  type === 'deletedTask' ? assign({}, state, { tasks: state.tasks.filter(({ id }) => parseInt(id) === task.id) }) : state

const myStore = createStore({tasks: []}, [addedTask, deletedTask])
const projection = log()((event) =>
  myStore.dispatch({type: event.type, task: event.task}).state
)

const store = require('../events/src')({ sequelize, projections: [projection] })
const config = {
  port: 8001
}

const app = express()
app.use(parser.json())

app.use('/tasks', require('./routes')({ store }))

app.listen(config.port, (err) => err ? console.error(err) : console.log(`Started on port ${config.port}`))
