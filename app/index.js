const express = require('express')
const parser = require('body-parser')
const { createStore } = require('../store')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('events', null, null, {
  dialect: 'sqlite',
  storage: './events/db/store/development/events.db'
})
const { assign } = Object

const addTask = (state, { type, task }) =>
  type === 'addTask' ? assign({}, state, { tasks: [...state.tasks, task] }) : state

const myStore = createStore({tasks: []}, [addTask])
const projection = (event) =>
  myStore.dispatch({type: 'addTask', task: event.task}).state

const store = require('../events/src')({ sequelize, projections: [projection] })
const config = {
  port: 8001
}

const app = express()
app.use(parser.json())

app.use('/tasks', require('./routes')({ store }))

app.listen(config.port, (err) => err ? console.error(err) : console.log(`Started on port ${config.port}`))
