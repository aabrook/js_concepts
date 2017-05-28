import React from 'react'

const singleTask = (deleteAction, { text, id }) => (
  <li key={id}>
    {text || 'nope'}
    <button onClick={deleteAction(id)}>Delete - {id}</button>
  </li>
)

export default (props) => (
  <ul>
    {props.tasks.map((t) => singleTask(props.deleteClick, t.task))}
  </ul>
)
