const assert = require('assert')
const sinon = require('sinon')
const events = require('../')
const State = require('../../helpers/state_monad')

const id = a => a

describe.only('functional events', () => {
  it('should add listeners with on', () => {
    const t = sinon.spy()
    const t2 = sinon.spy()
    const setup = events.on('test-state', t, State.of({ listeners: {} }))
    const subject = events.on('second-state', t2, setup)
    subject.map(([a, st]) => {
      assert.deepEqual([a, st], [
        t2,
        {
          listeners: { 'test-state': [t], 'second-state': [t2] }
        }
      ])
      return [a, st]
    })
  })

  it('should remove listeners', () => {
    const t = sinon.spy(id)
    const f = sinon.spy(id)
    const subject = State.of({
      listeners: {
        'run-me': [t, f]
      }
    })

    const test = events.remove('run-me', t, subject)
    test.map(([v, st]) => {
      assert.equal(v, t)
      assert.deepEqual(st, {
        listeners: {
          'run-me': [f]
        }
      })
    })
  })

  it('should emit events to registered listeners', () => {
    const t = sinon.spy(id)
    const f = sinon.spy(id)
    const subject = State.of({
      listeners: {
        'run-me': [t],
        'not-me': [f]
      }
    })

    const state = events.emit('run-me', subject.map(([_, st]) => ['test-action', st]))
    assert(t.called)
    assert.deepEqual(t.getCall(0).args, [[
      'test-action', {
        listeners: {
          'run-me': [t],
          'not-me': [f]
        }
      }
    ]])
    assert(!f.called)

    state.map(([v, st]) => {
      assert.equal(v, 'test-action')
      assert.deepEqual(st, {
        listeners: {
          'run-me': [t],
          'not-me': [f]
        }
      })
      return [v, st]
    })
  })
})
