import React, { Component } from 'react'
import axios from 'axios'
const { parse } = JSON

const tryParse = (message) => {
  try {
    if (typeof message === 'object') return message

    return parse(message)
  } catch (e) {
    return { error: e }
  }
}

const renderEvent = ({ createdAt, event = {} }, i) => {
  const ev = tryParse(event)
  return (
    <tr key={`event_${i}`}>
      <td>{createdAt}</td>
      <td>{ev.type}</td>
      <td>{ev.task}</td>
    </tr>
  )
}

export default class Events extends Component {
  constructor () {
    super()
    axios
    .get('http://localhost:8001/events')
    .then(({ data }) => console.log(data) || data)
    .then((events) => (this.setState({ ...this.state, events, loading: false })))

    this.state = { events: [], loading: true }
  }

  render () {
    const { loading, events } = this.state
    return (<table>
      {!loading && events.map(renderEvent)}
    </table>)
  }
}
