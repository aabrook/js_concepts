import React from 'react'

const singleTask = (deleteAction, { text, id }) => (
  <li key={id}>
    {text || 'nope'}
    <button onClick={deleteAction(id)}>Delete - {id}</button>
  </li>
)

export default ({ tasks, deleteClick, loading }) => (
  <ul>
    {!loading && tasks.map((t) => singleTask(deleteClick, t.task))}
  </ul>
)
