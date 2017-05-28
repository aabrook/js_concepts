import React, { Component } from 'react'
import axios from 'axios'
import TaskList from './TaskList'
const { floor, random } = Math

export default class Task extends Component {
  constructor () {
    super()
    this.state = {task: '', tasks: []}
  }

  changed (e) {
    this.setState({...this.state, task: e.target.value})
  }

  addTask () {
    axios.post('http://localhost:8001/tasks', {
      task: this.state.task,
      id: floor(random() * 100)
    }).then(({ data: { tasks } }) =>
      this.setState({...this.state, tasks})
    )
  }

  deleteTask (id) {
    return () => {
      console.log('try to delete', id)
      axios
        .delete(`http://localhost:8001/tasks/${id}`)
        .then(({ data: { tasks } }) => {
          this.setState({...this.state, tasks})
        })
    }
  }

  render () {
    return (
      <div>
        <input value={this.state.task} onChange={this.changed.bind(this)} />
        <button onClick={this.addTask.bind(this)}>Add Task</button>
        <TaskList tasks={this.state.tasks} deleteClick={this.deleteTask.bind(this)} />
      </div>
    )
  }
}
